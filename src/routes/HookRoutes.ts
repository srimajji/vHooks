import * as express from "express";
import { get } from "lodash";
import { Hook } from "../models/Hook";
import { wrapAsync } from "../utils/Helpers";
import { logger } from "../utils/Logger";
import { Raw, Like } from "typeorm";

export const getHooks = wrapAsync(async (req: express.Request, res: express.Response) => {
	const take = get(req, "query.max", 10);
	const skip = get(req, "query.skip", 0);
	const search = get(req, "query.q", "");
	const hooks: [Hook[], number] = await Hook.findAndCount({ where: { permalink: Like(`%${search}%`) }, take, skip });
	res.json({ hooks: hooks[0], totalCount: hooks[1], max: take, skip });
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
	const hook = Hook.create(req.body);
	hook.responseEvalCode = "response.status=200;\n\n\nresponse.headers = {'content-type': 'application/json'};\n\n\nresponse.body={'message': 'Hello world'};\n\n\n";
	await hook.save();

	logger.info("Create a new hook", { hook });
	res.status(201).json({ ...hook });
});
