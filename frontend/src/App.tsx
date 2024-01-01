import { useCallback, useEffect, useReducer, useState } from "react";
import PubNub from "pubnub";
import {
  HarmonyEvent,
  HarmonyMessageFromFrontend,
  isHarmonyMessageFromBackend,
} from "./types";
import MainWindow from "./MainWindow/MainWindow";
import {
  defaultHarmonyState,
  harmonyStateReducer,
} from "./HarmonyState/HarmonyState";
import { HarmonyContext } from "./HarmonyState/HarmonyContext";
import { RouteContext, defaultRoute } from "./Route";

const BACKEND_PUBNUB_SUBSCRIBE_KEY = import.meta.env
  .VITE_BACKEND_PUBNUB_SUBSCRIBE_KEY as string;

const pubnubBackend = new PubNub({
  userId: "harmony-frontend",
  subscribeKey: BACKEND_PUBNUB_SUBSCRIBE_KEY,
});

function App() {
  const [password, setPassword] = useState<string>('');
  const [harmonyState, harmonyStateDispatch] = useReducer(
    harmonyStateReducer,
    defaultHarmonyState
  );
  const [initializedListener, setInitializedListener] = useState(false);

  useEffect(() => {
    if (!password) {
      return;
    }
    if (!initializedListener) {
      return;
    }
    const msg: HarmonyMessageFromFrontend = {
      type: "frontend:getAllEvents",
    };
    publishMessage(msg, password);
  }, [password, initializedListener]);

  useEffect(() => {
    let canceled = false;
    pubnubBackend.addListener({
      message: (msg) => {
        if (canceled) {
          return;
        }
        const { message } = msg;
        if (!isHarmonyMessageFromBackend(message)) {
          console.warn(message);
          console.warn(
            "Received message from backend, but it was not a HarmonyMessageFromBackend"
          );
          return;
        }
        if (message.type === "backend:reportEvents") {
          harmonyStateDispatch({
            type: "applyEvents",
            events: message.events,
          });
        }
      },
    });
    pubnubBackend.subscribe({
      channels: ["harmony-backend"],
    });
    setInitializedListener(true);
    return () => {
      canceled = true;
      pubnubBackend.unsubscribe({
        channels: ["harmony-backend"],
      });
    };
  }, []);

  const handleAddEvents = useCallback(
    (events: HarmonyEvent[]) => {
      if (!password) {
        return;
      }
      const msg: HarmonyMessageFromFrontend = {
        type: "frontend:addEvents",
        events,
      };
      publishMessage(msg, password);
    },
    [password]
  );

  useEffect(() => {
    if (password) {
      localStorage.setItem("harmony-password", password);
    }
  }, [password]);

  useEffect(() => {
    const pw = localStorage.getItem("harmony-password");
    if (pw) {
      setPassword(pw);
    }
  }, []);

  const [route, setRoute] = useState(defaultRoute);

  return (
    <HarmonyContext.Provider
      value={{ state: harmonyState, addEvents: handleAddEvents, password, setPassword }}
    >
      <RouteContext.Provider value={{ route, setRoute }}>
        <MainWindow />
      </RouteContext.Provider>
    </HarmonyContext.Provider>
  );
}

const publishMessage = (msg: HarmonyMessageFromFrontend, password: string) => {
  const url = `/api/publishMessage`;
  const req = {
    type: "publishMessage",
    password: password,
    message: msg,
  };
  // post
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
};

export default App;
