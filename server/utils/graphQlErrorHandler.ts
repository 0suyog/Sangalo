import { gqError, ServerError } from "./errors"
import { MongoServerError } from "mongodb"
import { logger } from "./helpers"
import { ZodError } from "zod/v4"

export const gqErrorHandler = (error: unknown) => {
  // ! Remove this after DDebugging
  console.log('######################');
  console.log('|');
  console.log(error);
  console.log('|');
  console.log('######################');
  // ! Remove this after DDebugging

  if (error instanceof ServerError) {
    return gqError(error.message, error.name, error.options)
  }
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      return gqError("The resource that you are trying to create already exists", "DUPLICATE_RESOURCE", error.errorResponse.keyValue);
    }
    // ! Remove this after DDebugging
    logger.log("######################");
    logger.log("|");
    logger.log(error);
    logger.log("|");
    logger.log("######################");
    // ! Remove this after DDebugging
    return gqError("Something bad happened in db. Tell the developer what you were doing when this happened")
  }
  if (error instanceof ZodError) {
    return gqError("Input Validation Failed", error.name, error.issues)
  }
  if (error instanceof Error) {
    console.log(error)
    return gqError("You did something that the developer didnt anticipate for, You are to be blamed not me.")
  }
  return gqError("You arent supposed to see this")
}