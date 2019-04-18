import express = require("express");
import { wrapAsync } from "../utils/Helpers";
import { Hook } from "../models/Hook";
import { HookRequest } from "../models/HookRequest";
import { logger } from "../utils/Logger";
import events from "../services/EventService";

export const newHookRequest = wrapAsync(async (req: any, res: express.Response, next: express.NextFunction) => {
	const hook = await Hook.findOne({ permalink: req.params.hookPermalink });
	if (!hook) {
		const error = new Error("Hook not found");
		next(error);
		return;
	}

	const hookRequest = HookRequest.create(req);
	hookRequest.requestId = req.id;

	await hookRequest.save().catch(e => {
		logger.error("Error saving hookRequest for hook", { e, hookRequest, hook });
		const error = new Error("Error saving hookRequest");
		next(error);
		return;
	});

	events.emit("newHookRequest", hook.id, hookRequest);

	logger.info("Created a new hookRequest", { hook, hookRequest });
	return res.json(hookRequest);
});
