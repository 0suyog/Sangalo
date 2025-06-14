import type { ChatterDoc, ChatterType, populatedChatterDoc, PopulatedChatterType } from "chatterTypes";
import { Types } from "mongoose";
import type { MongoID } from "types";

export const returnableChatter = (chatter: ChatterDoc): ChatterType => {
  return {
    status: chatter.status,
    displayName: chatter.displayName,
    id: chatter._id.toString() as MongoID,
    username: chatter.username
  }
}

export const returnablePopulatedChatter = (chatter: populatedChatterDoc): PopulatedChatterType => {
  let friends = chatter.friends.map(friend => returnableChatter(friend))
  chatter.friends = []
  let returnValue = { ...returnableChatter(chatter as unknown as ChatterDoc), friends }
  return returnValue
}