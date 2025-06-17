import { Types } from "mongoose";
import type { MongoID } from "./types";

export const isMongoID = (id: unknown): id is MongoID => {
  return typeof id === "string" && Types.ObjectId.isValid(id);
};

export const isDate = (date: unknown): date is Date => {
  return Boolean(typeof date === 'string' && Date.parse(date));
}
