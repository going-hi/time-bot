import { ConversationFlavor } from "@grammyjs/conversations"
import { Context } from "grammy"
import { BotConfigType } from "./bot-config.type"

export type ContextBotType = ConversationFlavor<Context> & {
	config: BotConfigType
}
