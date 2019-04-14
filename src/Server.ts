import "reflect-metadata";
import app from "./App";
import * as http from "http";
import { Socket } from "socket.io";
import { logger } from "./utils/Logger";

export const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket: Socket) => {
	logger.info("Websocket connection established", { id: socket.id });
	socket.emit("news", { hello: "world" });
	socket.on("my other event", function (data) {
		logger.info("event received", data);
	});
});

export const gracefullyShutdown = () => {
	server.close(() => {
		// gracefully shutdown third party services;
		app.get("mysql").close();
		logger.info("Server shutting down");
		process.exit();
	});
};

["SIGTERM", "SIGINT"].forEach((event: any) => {
	process.on(event, gracefullyShutdown);
});

const port = app.get("port");
const env = app.get("env");

server.listen(port, () => {
	logger.info(`App env: ${env}}`);
	logger.info(`App is running at http://localhost:${port}`);
	logger.info("Press CTRL-C to stop");
});

process.on("uncaughtException", exception => {
	logger.error("Uncaugh exception", { exception });
});

process.on("unhandledRejection", (reason, p) => {
	logger.error("Unhandled promise rejection", { p, reason });
});
