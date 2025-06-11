import { z } from "zod/v4"
import { MongoID } from "../types"
import { isMongoID } from "../typeGuards"
export const MongoIdSchema = z.custom<MongoID>((id) => {
  return isMongoID(id)
}, "Expected a valid Id")