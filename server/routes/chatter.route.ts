import { Response, Router } from "express";
import { NewChatterSchema } from "../validators/ChatterValidator";
import { chatterServices } from "../services/chatter.services";
import { ChatterType } from "../types";
import { Chatter } from "../models/chatter.model";

const ChatterRouter = Router();

ChatterRouter.post(
	"/",
	async (_req, res: Response<ChatterType>, next) => {
		try {
			let chatterDetails = NewChatterSchema.parse(_req.body);
			const newChatter = await chatterServices.addChatter(chatterDetails);
			res.json(newChatter);
		} catch (e) {
			next(e);
		}
	}
);

ChatterRouter.get(
	"/id/:id",
	async (_req, res: Response<ChatterType>, next) => {
		try {
			let id = _req.params.id;
			const chatter = await chatterServices.getById(id);
			res.json(chatter);
		} catch (e) {
			next(e);
		}
	}
);

ChatterRouter.post("/login",(_req,res:Response<ChatterType>,next)=>{
	try{
		
	}
})

export default ChatterRouter;
