export function wrapAsync(fn: Function) {
	return function(req: any, res: any, next: any) {
		// https://thecodebarbarian.com/80-20-guide-to-express-error-handling
		fn(req, res, next).catch(next);
	};
}
