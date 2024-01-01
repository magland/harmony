import { FunctionComponent } from "react";
import { useRoute } from "../Route";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

type TopBarProps = {
    width: number;
    height: number;
    onToggleDrawer: () => void;
    showButton: boolean;
}

const TopBar: FunctionComponent<TopBarProps> = ({onToggleDrawer, showButton}) => {
    const {route} = useRoute();
    return (
        <div>
            {showButton && <IconButton onClick={() => {console.log('123'); onToggleDrawer()}} style={{zIndex: 999}}>
                <Menu />
            </IconButton>}
            &nbsp;&nbsp;
            {route.page}
        </div>
    )
}

export default TopBar;