import { ChatterType } from "../types";

declare global {
	namespace Express {
		export interface Request {
			chatter?: ChatterType;
		}
	}
}
