/* eslint-disable @typescript-eslint/no-explicit-any */
export type HarmonyItem = {
    itemType: 'announcement' | 'image',
    itemId: string,
    userName: string,
    timestampCreated: number,
    title: string,
    meta: any
}

export const isHarmonyItem = (item: any): item is HarmonyItem => {
    if (!item) return false;
    if (typeof item !== 'object') return false;
    if (typeof item.timestampCreated !== 'number') return false;
    if (typeof item.itemId !== 'string') return false;
    if (typeof item.userName !== 'string') return false;
    if (typeof item.title !== 'string') return false;
    if (typeof item.itemType !== 'string') return false;
    if (!['announcement', 'image'].includes(item.itemType)) return false;
    if (typeof item.meta !== 'object') return false;
    return true;
}

export type HarmonyEventPayload = {
    type: 'addItem',
    item: HarmonyItem
} | {
    type: 'removeItem',
    itemId: string
} | {
    type: 'editItem',
    itemId: string,
    title?: string,
    meta?: any
}

export const isHarmonyEventPayload = (payload: any): payload is HarmonyEventPayload => {
    if (!payload) return false;
    if (typeof payload !== 'object') return false;
    if (typeof payload.type !== 'string') return false;
    if (payload.type === 'addItem') {
        if (!isHarmonyItem(payload.item)) return false;
    } else if (payload.type === 'removeItem') {
        if (typeof payload.itemId !== 'string') return false;
    } else if (payload.type === 'editItem') {
        if (typeof payload.itemId !== 'string') return false;
        if (payload.title !== undefined && typeof payload.title !== 'string') return false;
        if (payload.meta !== undefined && typeof payload.meta !== 'object') return false;
    } else {
        return false;
    }
    return true;
}

export type HarmonyEvent = {
    eventId: string,
    timestamp: number,
    userName: string,
    eventPayload: HarmonyEventPayload
}

export const isHarmonyEvent = (event: any): event is HarmonyEvent => {
    if (!event) return false;
    if (typeof event !== 'object') return false;
    if (typeof event.eventId !== 'string') return false;
    if (typeof event.timestamp !== 'number') return false;
    if (typeof event.userName !== 'string') return false;
    if (!isHarmonyEventPayload(event.eventPayload)) return false;
    return true;
}

export type HarmonyMessageFromFrontend = {
    type: 'frontend:getAllEvents'
} | {
    type: 'frontend:addEvents'
    events: HarmonyEvent[]
}

export const isHarmonyMessageFromFrontend = (message: any): message is HarmonyMessageFromFrontend => {
    if (!message) return false;
    if (typeof message !== 'object') return false;
    if (message.type === 'frontend:getAllEvents') {
        return true;
    }
    if (message.type === 'frontend:addEvents') {
        if (!Array.isArray(message.events)) return false;
        if (!message.events.every(isHarmonyEvent)) return false;
        return true;
    }
    return false;
}

export type HarmonyMessageFromBackend = {
    type: 'backend:reportEvents',
    events: HarmonyEvent[]
}

export const isHarmonyMessageFromBackend = (message: any): message is HarmonyMessageFromBackend => {
    if (!message) return false;
    if (typeof message !== 'object') return false;
    if (message.type !== 'backend:reportEvents') return false;
    if (!Array.isArray(message.events)) return false;
    if (!message.events.every(isHarmonyEvent)) return false;
    return true;
}