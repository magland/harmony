/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useMemo } from "react";
import { HarmonyContext, useHarmony } from "../HarmonyState/HarmonyContext"
import { HarmonyItem } from "../types";

const useAnnouncements = () => {
    const {user} = useContext(HarmonyContext);
    const {items, addItem, removeItem, editItem} = useHarmony();
    const announcements = useMemo(() => {
        return items.filter(item => item.itemType === 'announcement');
    }, [items]);
    const addAnnouncement = useCallback((title: string) => {
        const item: HarmonyItem = {
            itemType: 'announcement',
            itemId: randomItemId(),
            userName: user,
            timestampCreated: Date.now(),
            title,
            meta: {}
        };
        addItem(item);
    }, [addItem, user]);
    const removeAnnouncement = useCallback((itemId: string) => {
        removeItem(itemId);
    }, [removeItem]);
    const editAnnouncement = useCallback((itemId: string, x: {title?: string, meta?: any}) => {
        editItem(itemId, x);
    }, [editItem]);
    return {announcements, addAnnouncement, removeAnnouncement, editAnnouncement};
}

const randomItemId = () => {
    const choices = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = 12;
    return Array.from({length}, () => choices[Math.floor(Math.random() * choices.length)]).join('');
}

export default useAnnouncements