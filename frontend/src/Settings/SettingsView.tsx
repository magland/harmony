import { FunctionComponent, useCallback, useContext } from "react";
import { HarmonyContext } from "../HarmonyState/HarmonyContext";
import { Button, Typography } from "@mui/material";

type SettingsViewProps = {
    width: number;
    height: number;
}

const SettingsView: FunctionComponent<SettingsViewProps> = () => {
    const {password, setPassword, user, setUser} = useContext(HarmonyContext);
    const handleSetPassword = useCallback(() => {
        const password = prompt('Enter password');
        if (!password) {
            return;
        }
        setPassword(password);
    }, [setPassword]);
    const handleSetUser = useCallback(() => {
        const user = prompt('Enter user');
        if (!user) {
            return;
        }
        setUser(user);
    }, [setUser]);
    return (
        <div style={{padding: 20}}>
            <hr />
            <div>
                <Typography variant="h6">
                    User name: {user}
                </Typography>
            </div>
            <div>
                <Button variant="contained" onClick={handleSetUser}>Set user</Button>
            </div>
            <hr />
            {
                !password && (
                    <div style={{color: 'red'}}>Password not entered</div>
                )
            }
            <div>
                <Button variant="contained" onClick={handleSetPassword}>Set password</Button>
            </div>
            <hr />
        </div>
    );
}

export default SettingsView;