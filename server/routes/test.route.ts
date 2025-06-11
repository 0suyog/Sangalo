import { Router } from "express";
import { chatterServices } from "../services/chatter.services";
import messageServices from "../services/message.services";
import chatServices from "../services/chat.services";
import Chat from "../models/chat.model";

const TestRouter = Router();

TestRouter.post("/resetChatter", async (_req, res, next) => {
	try {
		await chatterServices.resetChatterDb();
		res.sendStatus(200);
	} catch (e) {
		next(e);
	}
});

TestRouter.post("/resetMessages", async (_req, res, next) => {
	try {
		await messageServices.resetMessages()
		res.sendStatus(200)
	}
	catch (e) {
		next(e)
	}
})

TestRouter.post("/resetChat", async (_req, res, next) => {
	try {

		await Chat.deleteMany({})
		res.sendStatus(200)
	}
	catch (e) {
		next(e)
	}
})

TestRouter.post("/resetDb", async (_req, res, next) => {
	try {
		await messageServices.resetMessages()
		await chatterServices.resetChatterDb()
		await chatServices.resetChatDb()
		res.sendStatus(200)
	} catch (e) {
		next(e)
	}
})

export default TestRouter;
