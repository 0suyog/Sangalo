import { gqError, ServerError } from "./errors"
import { MongoServerError } from "mongodb"
import { logger } from "./helpers"

export const gqErrorHandler = (error: unknown) => {
  if (error instanceof ServerError) {
    gqError(error.message, error.name, error.options)
    return;
  }
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      gqError("The resource that you are trying to create already exists", "DUPLICATE_RESOURCE", error.errorResponse.keyValue);
      return;
    }
    // ! Remove this after DDebugging
    logger.log("######################");
    logger.log("|");
    logger.log(error);
    logger.log("|");
    logger.log("######################");
    // ! Remove this after DDebugging
    gqError("Something bad happened in db. Tell the developer what you were doing when this happened")
  }
  

}