/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  HarmonyMessageFromFrontend,
  isHarmonyMessageFromFrontend,
} from "../src/types.js";
import PubNub from "pubnub";

type PublishMessageRequest = {
  type: "publishMessage";
  message: HarmonyMessageFromFrontend;
  password: string;
};

const isPublishMessageRequest = (req: any): req is PublishMessageRequest => {
  if (!req) return false;
  if (typeof req !== "object") return false;
  if (req.type !== "publishMessage") return false;
  if (typeof req.password !== "string") return false;
  if (!isHarmonyMessageFromFrontend(req.message)) return false;
  return true;
};

const FRONTEND_PUBNUB_PUBLISH_KEY = process.env.FRONTEND_PUBNUB_PUBLISH_KEY;
const FRONTEND_PUBNUB_SUBSCRIBE_KEY = process.env.FRONTEND_PUBNUB_SUBSCRIBE_KEY;
const HARMONY_PASSWORD = process.env.HARMONY_PASSWORD;

if (!FRONTEND_PUBNUB_PUBLISH_KEY) {
  throw new Error("Missing FRONTEND_PUBNUB_PUBLISH_KEY");
}
if (!FRONTEND_PUBNUB_SUBSCRIBE_KEY) {
  throw new Error("Missing FRONTEND_PUBNUB_SUBSCRIBE_KEY");
}
if (!HARMONY_PASSWORD) {
  throw new Error("Missing HARMONY_PASSWORD");
}

let globalPubnubClient: PubNub | undefined = undefined;
const getPubnubClient = () => {
  if (globalPubnubClient) return globalPubnubClient;
  const client = new PubNub({
    userId: "harmony-frontend",
    publishKey: FRONTEND_PUBNUB_PUBLISH_KEY,
    subscribeKey: FRONTEND_PUBNUB_SUBSCRIBE_KEY,
  });
  globalPubnubClient = client;
  return client;
};

function handlePublishMessage(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(400).send("Bad request");
    return;
  }

  const request = req.body;
  if (!isPublishMessageRequest(request)) {
    console.warn(request);
    res.status(400).send("Not a valid publish message request");
    return;
  }
  if (request.password !== HARMONY_PASSWORD) {
    res.status(400).send("Incorrect password");
    return;
  }
  const { message: harmonyMessage } = request;
  const pubnubClient = getPubnubClient();
  pubnubClient.publish({
    channel: "harmony-frontend",
    message: harmonyMessage,
  });
}

export default handlePublishMessage;
