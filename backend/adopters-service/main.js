import express from 'express';
import jwt from 'jsonwebtoken';
const app = express();
const port = 80;
import mongoose from "mongoose";
import { Dog, User } from "../utils/database-utils.js";
import { Kafka } from "kafkajs";
import cors from 'cors';

app.use(cors());

mongoose.connect(process.env.DATABASE_URL);

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

// Initialize Kafka producer and admin
const producer = kafka.producer();

async function initKafka() {
    try {
        const admin = kafka.admin();
        console.log("Admin connecting...");
        await admin.connect();
        console.log("Admin Connection Success...");

        // Create the topic
        console.log("Creating Topic adoption-requests");
        await admin.createTopics({
            topics: [
                {
                    topic: "adoption-requests",
                    numPartitions: 1,
                },
            ],
        });
        console.log("Topic Created Success adoption-requests");

        // Disconnect Admin
        console.log("Disconnecting Admin..");
        await admin.disconnect();

        // Connect producer
        console.log("Connecting Producer...");
        await producer.connect();
        console.log("Producer Connected Successfully");
    } catch (error) {
        console.error("Error while initializing Kafka:", error);
        process.exit(1);
    }
}

initKafka().then(() => {
    app.use(express.json());

    app.options('/dogs/:dogId', async (req, res) => {
        res.status(200).send("");
    });

    app.post('/dogs/:dogId', async (req, res) => {
        const { token } = req.body;
        try {
            const verifToken = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findOne({ _id: verifToken.id });
            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const dog = await Dog.findOne({ _id: req.params.dogId });
            if (!dog) {
                return res.status(404).json({ message: 'Dog not found' });
            }

            const adoptionRequest = { adopterId: user._id, dogId: dog._id };
            console.log("Adoption request created:", adoptionRequest);

            await producer.send({
                topic: "adoption-requests",
                messages: [{ partition: 0, key: "adoption-request", value: JSON.stringify(adoptionRequest) }]
            });

            res.status(200).json({ message: 'Adoption request sent successfully', adoptionRequest: adoptionRequest });

        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'User not authenticated' });
        }
    });

    app.listen(port, () => {
        console.log(`Adopters service running on port ${port}`);
    });
});
