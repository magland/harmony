import 'dotenv/config';
import fs from 'fs';
import PubNub from "pubnub";
import BackendManager from "./BackendManager";
import EventManager from './EventManager';
import { HarmonyEvent, HarmonyMessageFromBackend, isHarmonyMessageFromFrontend } from "./types";

const BACKEND_PUBNUB_PUBLISH_KEY = process.env.BACKEND_PUBNUB_PUBLISH_KEY;
const BACKEND_PUBNUB_SUBSCRIBE_KEY = process.env.BACKEND_PUBNUB_SUBSCRIBE_KEY;
const FRONTEND_PUBNUB_SUBSCRIBE_KEY = process.env.FRONTEND_PUBNUB_SUBSCRIBE_KEY;
const HARMONY_DATA_DIR = process.env.HARMONY_DATA_DIR;

if (!BACKEND_PUBNUB_PUBLISH_KEY) {
    throw new Error("Missing BACKEND_PUBNUB_PUBLISH_KEY");
}
if (!BACKEND_PUBNUB_SUBSCRIBE_KEY) {
    throw new Error("Missing BACKEND_PUBNUB_SUBSCRIBE_KEY");
}
if (!FRONTEND_PUBNUB_SUBSCRIBE_KEY) {
    throw new Error("Missing FRONTEND_PUBNUB_SUBSCRIBE_KEY");
}
if (!HARMONY_DATA_DIR) {
    throw new Error("Missing HARMONY_DATA_DIR");
}

const main = async () => {
    // create the data directory if it doesn't exist
    await fs.promises.mkdir(HARMONY_DATA_DIR, { recursive: true });

    // Initialize PubNub
    const pubnubBackend = new PubNub({
        userId: "harmony-backend",
        publishKey: BACKEND_PUBNUB_PUBLISH_KEY,
        subscribeKey: BACKEND_PUBNUB_SUBSCRIBE_KEY
    });

    const pubnubFrontend = new PubNub({
        userId: "harmony-backend",
        subscribeKey: FRONTEND_PUBNUB_SUBSCRIBE_KEY
    });

    // Subscribe to a channel
    pubnubFrontend.subscribe({
        channels: ["harmony-frontend"]
    });

    const onMessageFromBackend = (msg: HarmonyMessageFromBackend) => {
        console.info(`Publishing message to frontend: ${msg.type}`);
        pubnubBackend.publish({
            channel: 'harmony-backend',
            message: msg
        });
    }

    const onNewEvents = async (events: HarmonyEvent[]) => {
        const message: HarmonyMessageFromBackend = {
            type: "backend:reportEvents",
            events
        };
        onMessageFromBackend(message);
    }

    const eventManager = await EventManager.create(
        HARMONY_DATA_DIR,
        onNewEvents
    );

    const backendManager = new BackendManager(
        onMessageFromBackend,
        eventManager
    );

    // Listen for messages
    pubnubFrontend.addListener({
        message: function (event) {
            if (event.channel === 'harmony-frontend') {
                const message = event.message;
                if (!isHarmonyMessageFromFrontend(message)) {
                    console.warn(message);
                    throw new Error(`Invalid message from frontend`);
                }
                console.info(`Handling message from frontend: ${message.type}`);
                backendManager.handleMessageFromFrontend(message);
            }
        },
    });
}

main();