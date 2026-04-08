import { Kafka, logLevel } from "kafkajs";

function getBrokers() {
    const brokerList = process.env.KAFKA_BROKERS ?? 'localhost:9092';

    return brokerList
        .split(',')
        .map((broker) => broker.trim())
        .filter(Boolean);
}

export const kafka = new Kafka({
    clientId: 'Kafka-zomato',
    brokers: getBrokers(),
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 30000,
    },
    logLevel: logLevel.ERROR,
});