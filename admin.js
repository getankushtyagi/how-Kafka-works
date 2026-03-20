import { kafka } from "./client.js";

// Suppress timeout warnings remove warnibg from terminal ignore it 
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning);
    }
});

async function init() {
    const admin = kafka.admin();
    console.log('admin connecting ....');
    await admin.connect();
    console.log('admin connected successfully......');

    // List existing topics
    const existingTopics = await admin.listTopics();
    console.log('Existing topics:', existingTopics);

    const topicName = "rider-updates";
    
    if (existingTopics.includes(topicName)) {
        console.log(`Topic "${topicName}" already exists`);
    } else {
        try {
            await admin.createTopics({
                topics: [
                    {
                        topic: topicName,
                        numPartitions: 2
                    },
                ]
            });

            console.log(`Topic "${topicName}" created successfully`);
        } catch (error) {
            console.log("Error creating topic:", error.message);
        }
    }

    await admin.disconnect();

    console.log("disconnecting admin");
}


init();