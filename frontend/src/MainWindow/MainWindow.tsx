import { useWindowDimensions } from "@fi-sci/misc";
import { SwipeableDrawer } from "@mui/material";
import { FunctionComponent, useCallback, useState } from "react";
import AnnouncementsView from "../Announcements/AnnouncementsView";
import { Route, useRoute } from "../Route";
import SettingsView from "../Settings/SettingsView";
import TopBar from "./TopBar";
import Drawer from "./Drawer";

type MainWindowProps = {
    // none
}

const MainWindow: FunctionComponent<MainWindowProps> = () => {
    const {width, height} = useWindowDimensions();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {route, setRoute} = useRoute();
    const topBarHeight = 20;
    const handleNavigateTo = useCallback((route: Route) => {
        setRoute(route);
        setDrawerOpen(false);
    }, [setRoute]);
    const drawerWidth = Math.min(width * 2 / 3, 250);
    const permanentDrawer = width >= 600;
    const permanentDrawerWidth = permanentDrawer ? drawerWidth : 0;
    return (
        <div>
            <TopBar showButton={!permanentDrawer} width={width} height={topBarHeight} onToggleDrawer={() => {setDrawerOpen(open => !open)}} />
            <div style={{position: 'absolute', width: width, height: height - topBarHeight, top: topBarHeight}}>
                <div style={{position: 'absolute', left: permanentDrawerWidth, width: width - permanentDrawerWidth, height: height - topBarHeight, top: topBarHeight}}>
                    {
                        route.page === 'announcements' ? (
                            <AnnouncementsView width={width - permanentDrawerWidth} height={height - topBarHeight} />
                        ) : route.page === 'settings' ? (
                            <SettingsView width={width - permanentDrawerWidth} height={height - topBarHeight} />
                        ) : (
                            <div>Unknown page</div>
                        )
                    }
                </div>
                <SwipeableDrawer
                    anchor="left"
                    variant={permanentDrawer ? 'permanent' : 'temporary'}
                    onClose={() => {setDrawerOpen(false)}}
                    onOpen={() => {setDrawerOpen(true)}}
                    open={drawerOpen}
                >
                    <div style={{position: 'relative', width: drawerWidth, height, backgroundColor: 'white'}}>
                        <Drawer onNavigateTo={handleNavigateTo} />
                    </div>
                </SwipeableDrawer>
            </div>
        </div>
    )
}

export default MainWindow;