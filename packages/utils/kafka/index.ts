import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: [process.env.KAFKA_BROKERS!],
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.KAFKA_CA_CERT!,
        key: process.env.KAFKA_ACCESS_KEY!,
        cert: process.env.KAFKA_ACCESS_CERT!,
    }
})