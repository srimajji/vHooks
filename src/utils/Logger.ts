import { createLogger, stdSerializers } from "bunyan";
import * as path from "path";

const isProd = process.env.NODE_ENV === "production" ? true : false;
const packageJson = require(path.resolve(__dirname, "../../package.json"));
export const logger = createLogger({
	name: packageJson.name,
	src: !!isProd,
	serializers: stdSerializers,
	level: "debug",
});

export const stream = {
	write: (message: string) => {
		logger.info(message);
	},
};
