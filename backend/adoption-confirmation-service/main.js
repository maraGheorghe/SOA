import mongoose from "mongoose";
import {Kafka} from "kafkajs";
import amqp from "amqplib/callback_api.js";
import { Dog, User } from "../utils/database-utils.js";

mongoose.connect(process.env.DATABASE_URL);

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

async function init() {
    const consumer = kafka.consumer({ groupId: "my-app" });
    await consumer.connect();

    await consumer.subscribe({ topics: ["adoption-requests"], fromBeginning: true });

    amqp.connect(process.env.RABBITMQ_CONNECT, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'emails';

            channel.assertQueue(queue, { durable: false });

            await consumer.run({
                eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                    const parsedMessage = JSON.parse(message.value.toString());
                    const user = await User.findOne({ _id: parsedMessage.adopterId });
                    const dog = await Dog.findOne({ _id: parsedMessage.dogId });
                    if (!user || !dog) {
                        console.log("Invalid adopter or dog.");
                        return;
                    }
                    const payload = {
                        email: user.email,
                        dogName: dog.name,
                    };
                    console.log(`[${topic}]: PART:${partition}:`, JSON.stringify(payload));
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
                    console.log(" [x] Sent adoption confirmation to RabbitMQ:", JSON.stringify(payload));
                },
            });
        });
    });
}

init();