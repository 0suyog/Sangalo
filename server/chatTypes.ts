import { z } from "zod/v4"
import { ChatValidationSchema, NewChatSchema } from "./typeValidators/chatValidator"
export type NewChatType = z.infer<typeof NewChatSchema>
export type ChatType = z.infer<typeof ChatValidationSchema>