export class ServerError extends Error {
	public statusCode: number;
	public options: object;
	constructor(
		message: string,
		statusCode: number,
		name: string = "ERROR",
		options: object = {}
	) {
		super(message);
		this.statusCode = statusCode;
		this.name = name;
		this.options = options;
	}
}
