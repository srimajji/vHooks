import * as emitter from "events";
import { logger } from "../utils/Logger";

const events = new emitter();

events.on("uncaughtException", (err) => {
	logger.error("EventService uncaught exception", { err });
});

export default events;