import * as express from "express";
import { Hook } from "../models/Hook";
import { wrapAsync } from "../utils/Helpers";
import { logger } from "../utils/Logger";
import * as vm from "vm";
import { HookResponse } from "../models/HookResponse";

export const getHooks = wrapAsync(async (req: express.Request, res: express.Response) => {
	const hooks: Hook[] = await Hook.find({ relations: ["hookResponse"] });
	res.json(hooks);
});

export const updateHook = wrapAsync(async (req: any, res: express.Response) => {
	const hook: Hook = await Hook.findOne({ id: req.params.id });
	if (!hook) {
		throw new Error("Not found");
	}

	Object.assign(hook, req.body);
	await hook.save();

	logger.info("Updated hook", { hookId: hook.id });
	res.status(200).json({ ...hook });
});

export const newHook = wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const hook = new Hook();
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
