import { createContext, useContext } from "react"

export type Route = {
    page: 'announcements'
} | {
    page: 'settings'
}

export const defaultRoute: Route = { page: 'announcements' };

export type RouteContextType = {
    route: Route
    setRoute: (route: Route) => void
}

export const RouteContext = createContext<RouteContextType>({
    route: { page: 'announcements' },
    setRoute: () => {}
})

export const useRoute = () => {
    const { route, setRoute } = useContext(RouteContext);
    return { route, setRoute };
}