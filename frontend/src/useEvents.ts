import { useCallback, useReducer } from "react";
import { HarmonyEvent } from "./types";

type EventsState = {
    allEvents: HarmonyEvent[]
}

type EventsAction = {
    type: 'addEvents'
    events: HarmonyEvent[]
}

const eventsReducer = (state: EventsState, action: EventsAction): EventsState => {
    switch (action.type) {
        case 'addEvents': {
            const allEventIds = new Set(state.allEvents.map(event => event.eventId));
            const eventsToAdd = action.events.filter(event => !allEventIds.has(event.eventId));
            if (!eventsToAdd.length) return state;
            return {
                ...state,
                allEvents: [...state.allEvents, ...eventsToAdd]
            }
        }
    }
}

const useEvents = () => {
    const [eventsState, dispatchEvents] = useReducer(eventsReducer, { allEvents: [] });
    const addEvents = useCallback((events: HarmonyEvent[]) => {
        dispatchEvents({
            type: 'addEvents',
            events
        });
    }, []);
    return {
        events: eventsState.allEvents,
        addEvents
    }
}

export default useEvents;