import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as expressRequestIdGenerator from "express-request-id";
import * as rateLimit from "express-rate-limit";
import { createConnection, QueryFailedError } from "typeorm";

import { logger, stream } from "./utils/Logger";
import { DB_DUPLICATE_ENTRY, DB_MISSING_FIELDS } from "./utils/Constants";
import { newHook, getHooks, updateHook } from "./routes/HookRoutes";
import { ResourceNotFoundError } from "./utils/Errors";
import { newHookRequest } from "./routes/HookRequestRoutes";

class App {
	public app: express.Application;

	constructor() {
		require("dotenv-extended").load();

		this.app = express();
		this.config();
		this.configureExternalServices();
		this.configDatabaseError();
		this.configGlobalErrors();
		this.configRoutes();
	}

	private config() {
		this.app.set("env", process.env.NODE_ENV || "development");
		this.app.set("port", Number.parseInt(process.env.NODE_PORT) || 8080);
		this.app.use(compression());
		this.app.use(morgan("combined", { stream: stream }));
		this.app.use(helmet());
		this.app.use(expressRequestIdGenerator());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(
			rateLimit({
				windowMs: 5 * 60 * 1000, // 15 minutes
				max: 1000, // limit each IP to 100 requests per windowMs,
				message: "Too many requests from this ip. Please try again in 5mins",
			})
		);
	}

	private configDatabaseError() {
		this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			const errorCode = error.code;
			if (error instanceof QueryFailedError && errorCode === DB_DUPLICATE_ENTRY) {
				res.status(403).json({ error: "Duplicate Entry" });
			} else if (error instanceof QueryFailedError && errorCode === DB_MISSING_FIELDS) {
				res.status(403).json({ error: "Missing fields" });
			} else if (error instanceof QueryFailedError) {
				res.status(500).json({ error: "Db error" });
			} else {
				next(error);
			}
		});
	}

	private configGlobalErrors() {
		this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (error instanceof ResourceNotFoundError) {
				res.status(404).json({ error: error.args });
			} else {
				res.status(404).json({ error: error.args });
			}
		});
	}

	private async configureExternalServices() {
		try {
			const mysqlConnection = await createConnection();
			logger.info("Configured mysql %s", mysqlConnection.options.database);
			this.app.set("mysql", mysqlConnection);
		} catch (e) {
			logger.error("Configuring external services %s", e.message);
			logger.error("Exiting app");
			process.exit();
		}
	}

	private configRoutes() {
		// this.app.get("/", (req, res) => {
		// 	res.json({ message: "Hello world" });
		// });

		this.app.get("/api/hooks", getHooks);
		this.app.post("/api/hooks", newHook);
		this.app.put("/api/hooks/:id", updateHook);
		this.app.use("/api/newHookRequest/:hookPermalink", newHookRequest);
	}
}

export default new App().app;
