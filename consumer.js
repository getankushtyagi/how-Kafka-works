import { kafka } from "./client.js";

// Suppress timeout warnings ignore it as well
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning);
    }
});



async function init() {
    const consumer = kafka.consumer(
        {
            groupId: 'rider-update-consumers',
        }
    );
    
    await consumer.connect();
    console.log("consumer connected successfully");

    await consumer.subscribe({ topic: 'rider-updates', fromBeginning: true });
    console.log("consumer subscribed to topic 'rider-updates'");
    console.log("waiting for messages...");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value: message.value.toString(),
            });
        },
    });

    // Note: consumer.run() is long-running, so this won't be reached
    // Use Ctrl+C to stop the consumer
}

init().catch(console.error);