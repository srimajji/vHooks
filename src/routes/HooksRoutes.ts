import * as express from "express";
import { HookRequest } from "../models/HookRequest";
import { Hook } from "../models/Hook";
import { ResourceNotFoundError } from "../utils/Errors";
import { wrapAsync } from "../utils/Helpers";
import { logger } from "../utils/Logger";
import events from "../services/EventService";

const hooksRouter = express.Router();

hooksRouter.get(
	"/:permalink",
	wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const { permalink } = req.params;
		const hook = await Hook.findOne({ permalink }, { relations: ["hookRequests"] });
		if (!hook) {
			const error = new ResourceNotFoundError("Hook not found");
			next(error);
			return;
		}

		res.json({ hook });
	})
);

hooksRouter.get("/all", wrapAsync(async (req: express.Request, res: express.Response) => {
	const hooks: Hook[] = await Hook.find();
	res.json(hooks);
}));

hooksRouter.post(
	"/",
	wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const hook = new Hook();
		hook.permalink = req.body.name;
		await hook.save().catch(e => {
			const errorMsg = "Error saving hook";
			const error = new Error(errorMsg);
			logger.error(errorMsg, { hook, e });
			next(error);
			return;
		});

		logger.info("Create a new hook", { hook });
		res.json({ ...hook });
	})
);

hooksRouter.all(
	"/new/:permalink",
	wrapAsync(async (req: any, res: express.Response, next: express.NextFunction) => {
		const hook = await Hook.findOne({ permalink: req.params.permalink });
		if (!hook) {
			const error = new Error("Hook not found");
			next(error);
			return;
		}

		const hookRequest = new HookRequest();

		hookRequest.requestId = req.id;
		hookRequest.headers = req.headers;
		hookRequest.host = req.host;
		hookRequest.ip = req.ip;
		hookRequest.method = req.method;
		hookRequest.body = req.body;
		hookRequest.query = req.query;
		hookRequest.httpVersion = req.httpVersion;
		hookRequest.hook = hook;

		await hookRequest.save().catch(e => {
			logger.error("Error saving hookRequest for hook", { e, hookRequest, hook });
			const error = new Error("Error saving hookRequest");
			next(error);
			return;
		});

		events.emit("newHookRequest", hook.id, hookRequest);

		logger.info("Created a new hookRequest", { hook, hookRequest });
		return res.json(hookRequest);
	})
);

export default hooksRouter;
