import { Router, type NextFunction, type Request, type Response } from "express";
import {
	LoginSchema,
	NewChatterSchema,
	SearchSchema,
} from "../typeValidators/chatterValidator";
import { chatterServices } from "../services/chatter.services";
import type { ChatterSearchResponse, ChatterType, PopulatedChatterType, TokenType } from "../chatterTypes";
import { chatterAuthentication } from "../utils/middleWares";
import type { MongoID } from "../types";
import { MongoIdSchema } from "../typeValidators/commonValidators";

const ChatterRouter = Router();

// No Auth Routes
// register route
ChatterRouter.post(
	"/register",
	async (_req, res, next) => {
		try {
			let chatterDetails = NewChatterSchema.parse(_req.body);
			await chatterServices.addChatter(chatterDetails);
			res.status(201).send("created")
			return;
		} catch (e) {
			next(e);
		}
	}
);
// route to get user by id
ChatterRouter.get("/id/:id", async (_req, res: Response<ChatterType>, next) => {
	try {
		let id = _req.params.id;
		const chatter = await chatterServices.getById(id);
		res.json(chatter);
		return;
	} catch (e) {
		next(e);
	}
});

//route to get user by username
ChatterRouter.get(
	"/username/:username",
	async (_req, res: Response<ChatterType>, next) => {
		try {
			let username = _req.params.username;
			const chatter = await chatterServices.getByUsername(username);
			res.json(chatter);
		} catch (e) {
			next(e);
		}
	}
);

// login route
ChatterRouter.post("/login", async (_req, res: Response<TokenType>, next) => {
	try {
		const loginDetails = LoginSchema.parse(_req.body);
		const token = await chatterServices.loginChatter(loginDetails);
		res.json(token);
	} catch (e) {
		next(e);
	}
});

// check if a username is taken
ChatterRouter.get("/exists/:username", async (_req, res, next) => {
	try {
		const username: string = _req.params.username;
		const exists = await chatterServices.checkUserAvailability(username);
		res.json({ exists: exists });
		return;
	} catch (e) {
		next(e);
	}
});

// Authorized Routes
ChatterRouter.post("/addFriend/:id", chatterAuthentication, async (_req, res, next) => {
	try {
		const friendId = MongoIdSchema.parse(_req.params.id);
		const chatterId = _req.chatter?.id as MongoID;
		await chatterServices.addFriend(chatterId, friendId);
		res.sendStatus(200);
		return;
	} catch (e) {
		next(e);
	}
});

ChatterRouter.get("/me", chatterAuthentication, async (_req: Request, res: Response<PopulatedChatterType>, next: NextFunction) => {
	try {
		const chatterId = _req.chatter?.id as MongoID
		let chatterDetails = await chatterServices.me(chatterId)
		res.json(chatterDetails);
	} catch (e) {
		next(e)
	}
})

ChatterRouter.post(
	"/search",
	chatterAuthentication,
	async (
		_req: Request,
		res: Response<ChatterSearchResponse>,
		next: NextFunction
	) => {
		try {
			const searchFilter = SearchSchema.parse(_req.body);
			const results = await chatterServices.searchChatter(searchFilter);
			res.json({ chatters: results });
			return;
		} catch (e) {
			next(e);
		}
	}
);

ChatterRouter.get(
	"/friends",
	chatterAuthentication,
	async (_req: Request, res: Response<ChatterType[]>, next: NextFunction) => {
		try {
			const id = _req.chatter?.id as string;
			const friends = await chatterServices.getFriends(id);
			res.json(friends);
			return;
		} catch (e) {
			next(e);
		}
	}
);

ChatterRouter.delete("/delete", chatterAuthentication, async (_req, res, next) => {
	try {
		let userId: string = _req.chatter?.id as string;

		await chatterServices.deleteChatter(userId);
		res.sendStatus(204);
	} catch (e) {
		next(e);
	}
});

export default ChatterRouter;
