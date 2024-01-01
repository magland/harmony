import { HarmonyEvent, isHarmonyEvent } from "./types";
import fs from 'fs';

class EventManager {
    #events: HarmonyEvent[] = [];
    #allEventIds: Set<string> = new Set();
    constructor(private harmonyDataDir: string, private onNewEvents: (events: HarmonyEvent[]) => void, initialEvents: HarmonyEvent[]) {
        for (const event of initialEvents) {
            this.#events.push(event);
            this.#allEventIds.add(event.eventId);
        }
    }
    static async create(harmonyDataDir: string, onNewEvents: (events: HarmonyEvent[]) => void) {
        const fname = `${harmonyDataDir}/events.jsonl`;
        const initialEvents: HarmonyEvent[] = [];
        const fileExists = await fs.promises.access(fname).then(() => true, () => false);
        const lines: string[] = fileExists ? await readLines(fname) : [];
        lines.forEach((line, i) => {
            if (!line.trim()) return;
            const event = JSON.parse(line);
            if (!isHarmonyEvent(event)) {
                console.warn(line);
                throw new Error(`Invalid event in ${fname}: line ${i + 1}`);
            }
            initialEvents.push(event);
        })
        return new EventManager(harmonyDataDir, onNewEvents, initialEvents);
    }
    async addEvents(events: HarmonyEvent[]) {
        const fname = `${this.harmonyDataDir}/events.jsonl`;
        const lines = events.map(event => JSON.stringify(event) + '\n').join('');
        for (const event of events) {
            if (this.#allEventIds.has(event.eventId)) {
                throw new Error(`Duplicate event ID: ${event.eventId}`);
            }
        }
        await lockFile(fname, async () => {
            await fs.promises.appendFile(fname, lines);
            this.#events.push(...events);
            events.forEach(event => {
                this.#allEventIds.add(event.eventId);
            });
        });
        this.onNewEvents(events);
    }
    async getAllEvents() {
        return [...this.#events];
    }
}

const readLines = async (fname: string) => {
    const lines: string[] = [];
    await lockFile(fname, async () => {
        const data = await fs.promises.readFile(fname);
        const text = data.toString();
        text.split('\n').forEach(line => {
            lines.push(line);
        });
    });
    return lines;
}

const lockFile = async (fname: string, callback: () => Promise<void>) => {
    const lockfname = fname + '.lock';
    while (true) {
        try {
            await fs.promises.mkdir(lockfname);
            break;
        } catch (err: any) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    try {
        await callback();
    } finally {
        await fs.promises.rmdir(lockfname);
    }
}


export default EventManager;