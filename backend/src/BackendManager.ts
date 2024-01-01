import EventManager from "./EventManager";
import { HarmonyMessageFromBackend, HarmonyMessageFromFrontend } from "./types";

class BackendManager {
    constructor(
        private onMessage: (msg: HarmonyMessageFromBackend) => void,
        private eventManager: EventManager
    ) { }
    handleMessageFromFrontend(message: HarmonyMessageFromFrontend) {
        if (message.type === "frontend:getAllEvents") {
            this.handleGetAllEvents();
        }
        else if (message.type === "frontend:addEvents") {
            this.handleAddEvents(message);
        }
        else {
            console.warn(message);
            throw new Error(`Unexpected message from frontend`);
        }
    }
    async handleGetAllEvents() {
        const events = await this.eventManager.getAllEvents();
        const message: HarmonyMessageFromBackend = {
            type: "backend:reportEvents",
            events
        };
        this.onMessage(message);
    }
    async handleAddEvents(message: HarmonyMessageFromFrontend) {
        if (message.type !== "frontend:addEvents") {
            throw new Error(`Expected message type frontend:addEvent`);
        }
        const events = message.events;
        await this.eventManager.addEvents(events);
    }
}

export default BackendManager;