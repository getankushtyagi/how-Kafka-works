import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'Kafka-zomato',
    brokers: ['172.24.0.246:9092', 'kafka2:9092'],
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 30000,
    },
    logLevel: logLevel.ERROR,
});