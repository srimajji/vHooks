import "reflect-metadata";
import app from "./App";
import * as http from "http";
import { Socket } from "socket.io";
import { logger } from "./utils/Logger";
import events from "./services/EventService";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare()
	.then(() => {
		app.get("*", (req, res) => {
			return handle(req, res);
		});

		app.get("/test", (req, res) => {
			return nextApp.render(req, res, "/index", req.query);
		});

		const server = http.createServer(app);
		const io = require("socket.io")(server);

		io.on("connection", (socket: Socket) => {
			logger.info("Websocket connection established", { id: socket.id });
			events.on("newHookRequest", (id, hookRequest) => {
				socket.emit("events", hookRequest);
			});

			socket.on("disconnect", () => {
				logger.info("Websocker connection disconnected", { id: socket.id });
			});
		});

		const gracefullyShutdown = () => {
			server.close(() => {
				// gracefully shutdown third party services;
				events.removeAllListeners();
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
	}).catch((ex) => {
		logger.error(ex.stack);
		process.exit(1);
	});

process.on("uncaughtException", exception => {
	logger.error("Uncaugh exception", { exception });
});

process.on("unhandledRejection", (reason, p) => {
	logger.error("Unhandled promise rejection", { p, reason });
});
