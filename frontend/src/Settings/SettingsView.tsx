import { FunctionComponent, useCallback, useContext } from "react";
import { HarmonyContext } from "../HarmonyState/HarmonyContext";

type SettingsViewProps = {
    width: number;
    height: number;
}

const SettingsView: FunctionComponent<SettingsViewProps> = () => {
    const {password, setPassword} = useContext(HarmonyContext);
    const handleSetPassword = useCallback(() => {
        const password = prompt('Enter password');
        if (!password) {
            return;
        }
        setPassword(password);
    }, [setPassword]);
    return (
        <div style={{padding: 20}}>
            {
                !password && (
                    <div style={{color: 'red'}}>Password not entered</div>
                )
            }
            <div>
                <button onClick={handleSetPassword}>Enter password</button>
            </div>
        </div>
    );
}

export default SettingsView;