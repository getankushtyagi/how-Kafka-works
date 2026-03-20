import { kafka } from "./client.js";

// Suppress timeout warnings ignore it 
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning);
    }
});


async function init() {
    const producer = kafka.producer();
    console.log("connecting producer");
    await producer.connect();
    console.log("producer is connected");

    await producer.send({
        topic: 'rider-updates',
        messages: [{
            partition: 0,
            key: 'location-update',
            value: JSON.stringify({
                riderId: 'rider-123',
                location: {
                    lat: 37.7749,
                    lng: -122.4194
                },
                timestamp: Date.now()
            })
        }]
    });

    console.log("message sent successfully");

    await producer.disconnect();
    console.log("producer disconnected");
}

init();