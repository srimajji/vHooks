import "reflect-metadata";
import app from "./App";

import * as http from "http";

import { logger } from "./utils/Logger";

export const server = http.createServer(app);

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
