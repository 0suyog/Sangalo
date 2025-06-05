import { Router } from "express";
import { chatterServices } from "../services/chatter.services";

const TestRouter = Router();

TestRouter.post("/resetChatter", async (_reqq, res, next) => {
	try {
		await chatterServices.resetChatterDb();
		res.sendStatus(200);
	} catch (e) {
		next(e);
	}
});

// TestRouter.post("/")

export default TestRouter;
