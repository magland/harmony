/* eslint-disable @typescript-eslint/no-explicit-any */
import { HarmonyEvent, HarmonyItem } from "../types"

export type HarmonyState = {
    items: HarmonyItem[]
}

export const defaultHarmonyState: HarmonyState = {
    items: []
}

export type HarmonyStateAction = {
    type: 'applyEvents'
    events: HarmonyEvent[]
}

const applyEvents = (items: HarmonyItem[], events: HarmonyEvent[]): HarmonyItem[] => {
    const currentItemIds = new Set(items.map(item => item.itemId));
    const itemsToAdd: HarmonyItem[] = [];
    const itemIdsToRemove = new Set<string>();
    for (const event of events) {
        switch (event.eventPayload.type) {
            case 'addItem':
                if (!currentItemIds.has(event.eventPayload.item.itemId)) {
                    itemsToAdd.push(event.eventPayload.item);
                    currentItemIds.add(event.eventPayload.item.itemId);
                }
                break;
            case 'removeItem':
                itemIdsToRemove.add(event.eventPayload.itemId);
                break;
            case 'editItem':
                // handle this separately
                break
        }
    }
    const editEvents = events.filter(event => event.eventPayload.type === 'editItem');
    if (itemsToAdd.length === 0 && itemIdsToRemove.size === 0 && editEvents.length === 0) {
        return items;
    }
    let newItems = items.filter(item => !itemIdsToRemove.has(item.itemId));
    for (const item of itemsToAdd) {
        if (!itemIdsToRemove.has(item.itemId)) {
            newItems.push(item);
        }
    }
    if (editEvents.length > 0) {
        const idsToEdit = new Set<string>();
        for (const event of editEvents) {
            if (event.eventPayload.type !== 'editItem') continue; // unexpected
            idsToEdit.add(event.eventPayload.itemId);
        }
        const eventPayloads = editEvents.map(event => event.eventPayload) as {type: 'editItem', itemId: string, title?: string, meta?: any}[];
        newItems = newItems.map(item => {
            if (idsToEdit.has(item.itemId)) {
                let ret = {...item} as HarmonyItem;
                for (const editEventPayload of eventPayloads) {
                    if (editEventPayload.itemId !== item.itemId) continue;
                    ret = {
                        ...ret,
                        title: editEventPayload.title ? editEventPayload.title : ret.title,
                        meta: editEventPayload.meta ? {...ret.meta, ...editEventPayload.meta} : ret.meta
                    }
                }
                return ret;
            } else {
                return item;
            }
        })
    }
    return newItems;
}

export const harmonyStateReducer = (state: HarmonyState, action: HarmonyStateAction): HarmonyState => {
    switch (action.type) {
        case 'applyEvents':
            return {
                ...state,
                items: applyEvents(state.items, action.events)
            }
        default:
            return state;
    }
}

