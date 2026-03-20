/**
 * Kafka Client Configuration
 * 
 * This file creates a centralized Kafka client instance that all services import.
 * Benefits:
 * - Single source of truth for Kafka configuration
 * - Easy to update broker addresses and settings
 * - Consistent retry and timeout policies across all services
 */

import { Kafka, logLevel } from "kafkajs";

// Suppress timeout warnings (known kafkajs issue on some systems)
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning);
    }
});

/**
 * Create Kafka client instance
 * 
 * Configuration options:
 * - clientId: Identifies this application in Kafka logs
 * - brokers: Array of Kafka broker addresses (can add multiple for HA)
 * - connectionTimeout: Max time to establish connection (10 seconds)
 * - requestTimeout: Max time for request to complete (30 seconds)
 * - retry: Automatic retry configuration for failed requests
 * - logLevel: Set to ERROR to reduce console noise (change to INFO for debugging)
 */
export const kafka = new Kafka({
    clientId: 'ecommerce-app',
    brokers: ['172.24.0.246:9092'], // Update with your Kafka broker addresses
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        retries: 5,                // Retry up to 5 times
        initialRetryTime: 300,     // Wait 300ms before first retry
        maxRetryTime: 30000,       // Max wait time between retries
    },
    logLevel: logLevel.ERROR,      // Change to logLevel.INFO for detailed logs
});

console.log('✓ Kafka client configured');
