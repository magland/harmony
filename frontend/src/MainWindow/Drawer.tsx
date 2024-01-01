/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from "react";
import { Route } from "../Route";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Inbox, Settings } from "@mui/icons-material";

type DrawerProps = {
    onNavigateTo: (route: Route) => void;
}

const Drawer: FunctionComponent<DrawerProps> = ({onNavigateTo}) => {
    return (
        <>
            <MenuItem
                label="Announcements"
                icon={<Inbox />}
                onClick={() => onNavigateTo({page: 'announcements'})}
            />
            <MenuItem
                label="Settings"
                icon={<Settings />}
                onClick={() => onNavigateTo({page: 'settings'})}
            />
        </>
    )
}

const MenuItem: FunctionComponent<{label: string, icon: any, onClick: () => void}> = ({label, icon, onClick}) => {
    return (
        <div style={{padding: 10}}>
            <ListItem onClick={onClick}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        </div>
    )
}

export default Drawer;