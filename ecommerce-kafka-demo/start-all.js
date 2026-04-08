import { spawn } from 'node:child_process';
import { once } from 'node:events';

import { kafka } from './config/kafka-client.js';

const services = [
    { name: 'order-service', script: 'services/order-service/index.js' },
    { name: 'payment-service', script: 'services/payment-service/index.js' },
    { name: 'inventory-service', script: 'services/inventory-service/index.js' },
    { name: 'notification-service', script: 'services/notification-service/index.js' },
    { name: 'analytics-service', script: 'services/analytics-service/index.js' },
];

const childProcesses = [];
let shuttingDown = false;

function prefixStream(stream, label, writer) {
    let buffered = '';

    stream.on('data', (chunk) => {
        buffered += chunk.toString();
        const lines = buffered.split('\n');
        buffered = lines.pop() ?? '';

        for (const line of lines) {
            if (!line.trim()) {
                continue;
            }

            writer(`[${label}] ${line}\n`);
        }
    });

    stream.on('end', () => {
        if (buffered.trim()) {
            writer(`[${label}] ${buffered}\n`);
        }
    });
}

async function waitForKafka() {
    const attempts = 30;
    const delayMs = 2000;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const admin = kafka.admin();

        try {
            console.log(`[bootstrap] Waiting for Kafka (${attempt}/${attempts})`);
            await admin.connect();
            await admin.listTopics();
            await admin.disconnect();
            console.log('[bootstrap] Kafka is reachable');
            return;
        } catch (error) {
            try {
                await admin.disconnect();
            } catch {
                // Ignore disconnect errors while broker is still coming up.
            }

            if (attempt === attempts) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

function spawnProcess(name, script) {
    const child = spawn('node', [script], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    childProcesses.push(child);
    prefixStream(child.stdout, name, process.stdout.write.bind(process.stdout));
    prefixStream(child.stderr, name, process.stderr.write.bind(process.stderr));

    child.on('exit', (code, signal) => {
        if (shuttingDown) {
            return;
        }

        const exitReason = signal ? `signal ${signal}` : `code ${code}`;
        console.error(`[bootstrap] ${name} exited unexpectedly with ${exitReason}`);
        shutdown(code && code !== 0 ? code : 1);
    });

    return child;
}

async function runSetup() {
    const setup = spawn('node', ['ecommerce-kafka-demo/setup/create-topics.js'], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    prefixStream(setup.stdout, 'topic-setup', process.stdout.write.bind(process.stdout));
    prefixStream(setup.stderr, 'topic-setup', process.stderr.write.bind(process.stderr));

    const [code, signal] = await once(setup, 'exit');

    if (signal || code !== 0) {
        throw new Error(`Topic setup failed with ${signal ? `signal ${signal}` : `code ${code}`}`);
    }
}

function shutdown(exitCode = 0) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    console.log('[bootstrap] Shutting down services');

    for (const child of childProcesses) {
        if (!child.killed) {
            child.kill('SIGINT');
        }
    }

    setTimeout(() => {
        process.exit(exitCode);
    }, 1500).unref();
}

async function main() {
    try {
        await waitForKafka();
        await runSetup();

        console.log('[bootstrap] Starting e-commerce services');
        for (const service of services) {
            spawnProcess(service.name, `ecommerce-kafka-demo/${service.script}`);
        }
    } catch (error) {
        console.error(`[bootstrap] Startup failed: ${error.message}`);
        shutdown(1);
        return;
    }

    process.on('SIGINT', () => shutdown(0));
    process.on('SIGTERM', () => shutdown(0));
}

main();