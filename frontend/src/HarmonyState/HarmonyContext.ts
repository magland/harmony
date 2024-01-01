/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useMemo } from "react"
import { HarmonyState } from "./HarmonyState"
import { HarmonyEvent, HarmonyItem } from "../types"

type HarmonyContextType = {
    state: HarmonyState
    addEvents: (events: HarmonyEvent[]) => void
    password: string
    setPassword: (password: string) => void
}

export const HarmonyContext = createContext<HarmonyContextType>({
    state: {
        items: []
    },
    addEvents: () => {},
    password: '',
    setPassword: () => {}
})

export const useHarmony = () => {
    const { state, addEvents } = useContext(HarmonyContext);
    const addItem = useCallback((item: HarmonyItem) => {
        addEvents([{
            eventId: randomEventId(),
            timestamp: Date.now(),
            userName: item.userName,
            eventPayload: {
                type: 'addItem',
                item
            }
        }]);
    }, [addEvents]);
    const removeItem = useCallback((itemId: string) => {
        addEvents([{
            eventId: randomEventId(),
            timestamp: Date.now(),
            userName: 'anonymous',
            eventPayload: {
                type: 'removeItem',
                itemId
            }
        }]);
    }, [addEvents]);
    const editItem = useCallback((itemId: string, x: {title?: string, meta?: any}) => {
        addEvents([{
            eventId: randomEventId(),
            timestamp: Date.now(),
            userName: 'anonymous',
            eventPayload: {
                type: 'editItem',
                itemId,
                ...x
            }
        }]);
    }, [addEvents]);
    const sortedItems = useMemo(() => {
        return state.items.sort((a, b) => b.timestampCreated - a.timestampCreated);
    }, [state.items]);
    return {items: sortedItems, addEvents, addItem, removeItem, editItem};
}

export const usePassword = () => {
    const { password, setPassword } = useContext(HarmonyContext);
    return {password, setPassword};
}

const randomEventId = () => {
    const choices = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = 12;
    return Array.from({length}, () => choices[Math.floor(Math.random() * choices.length)]).join('');
}