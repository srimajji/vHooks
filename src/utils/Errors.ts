export class ResourceNotFoundError extends Error {
	args: object | string;

	constructor(args: object | string) {
		super();
		this.name = "ResourceNotFound";
		this.args = args;
	}
}
