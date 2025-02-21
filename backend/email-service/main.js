import amqp from "amqplib/callback_api.js";

amqp.connect(process.env.RABBITMQ_CONNECT, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'emails';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for adoption confirmation messages...");
        channel.consume(queue, function(msg) {
            const message = JSON.parse(msg.content.toString());
            console.log(" Sending adoption confirmation email to: %s about dog: %s", message.email, message.dogName);
        }, {
            noAck: true
        });
    });
});
