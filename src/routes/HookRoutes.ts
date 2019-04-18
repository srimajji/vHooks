import * as express from "express";
import { Hook } from "../models/Hook";
import { wrapAsync } from "../utils/Helpers";
import { logger } from "../utils/Logger";
import * as vm from "vm";

export const getHooks = wrapAsync(async (req: express.Request, res: express.Response) => {
	const hooks: Hook[] = await Hook.find();
	res.json(hooks);
});

export const updateHook = wrapAsync(async (req: any, res: express.Response) => {
	const hook: Hook = await Hook.findOne({ id: req.params.id });
	if (!hook) {
		throw new Error("Not found");
	}

	const { permalink, requestBody } = req.body;
	hook.permalink = permalink;

	// set eval for custom request
	const request = {
		body: req.body,
		method: req.method,
		headers: req.headers,
		params: req.params,
	};

	const response = {
		status: 200,
		headers: {},
		body: {},
	};

	const sandbox = { request, response };

	try {
		// const evluatedCode = safeEval(requestBody, { request, response });
		vm.createContext(sandbox);
		vm.runInContext(requestBody, sandbox);
		const { request, response } = sandbox;
		logger.info(sandbox);
		res.statusCode = response.status;
		res.send(response.body.toString());
		return;
	} catch (e) {
		logger.error("Evaluating request body", { e, requestId: req.id });
		throw new Error("Error evaluating code");
	}
});

export const newHook = wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
});
