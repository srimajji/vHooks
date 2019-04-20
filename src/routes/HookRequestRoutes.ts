import express = require("express");
import * as vm from "vm";
import { get } from "lodash";
import { wrapAsync } from "../utils/Helpers";
import { Hook } from "../models/Hook";
import { HookRequest } from "../models/HookRequest";
import { logger } from "../utils/Logger";
import events from "../services/EventService";
import { HookResponse } from "../models/HookResponse";

export const newHookRequest = wrapAsync(async (req: any, res: express.Response, next: express.NextFunction) => {
	const hook = await Hook.findOne({ permalink: req.params.hookPermalink });
	if (!hook) {
		const error = new Error("Hook not found");
		next(error);
		return;
	}

	const hookRequest = HookRequest.create(req);
	hookRequest.requestId = req.id;
	hookRequest.hook = hook;

	// set eval for custom request
	const request = {
		body: req.body,
		method: req.method,
		headers: req.headers,
		params: req.params,
		id: req.id,
	};

	const response = {
		status: 200,
		headers: { "Content-Type": "application/text" },
		body: {},
	};

	const sandbox = { request, response };
	const { responseEvalCode } = hook;

	try {
		// use node vm to eval code by passing the above context
		vm.createContext(sandbox);
		vm.runInContext(hook.responseEvalCode, sandbox);
		const { response } = sandbox;
		logger.info("Evaluated code for hook", { hookId: hook.id, sandbox });

		const hookResponse: HookResponse = HookResponse.create({ ...response, responseEvalCode });
		hookRequest.hookResponse = hookResponse;

		await hookRequest.save().catch(e => {
			logger.error("Error saving hookRequest for hook", { e, hookRequest, hook });
			const error = new Error("Error saving hookRequest");
			next(error);
			return;
		});

		const { status, headers, body } = hookResponse;
		res.statusCode = status;
		for (const header in headers) {
			res.append(header, get(headers, header, ""));
		}

		if (!body && (body.constructor === Object && !Object.keys(body).length)) {
			res.send();
		} else {
			res.send(body.toString());
		}
		logger.info("Created a new hookRequest", { hook, hookRequest });
		events.emit("newHookRequest", hook.id, hookRequest);
		return;
	} catch (e) {
		logger.error("Evaluating request body", { e, requestId: req.id });
		throw new Error("Error evaluating code");
	}
});
