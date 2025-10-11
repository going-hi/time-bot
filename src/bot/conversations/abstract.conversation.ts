import { Conversation } from "@grammyjs/conversations";
import { ContextBotType } from "../types";

export abstract class AbstractConversation {
	public name: string

	abstract execute(conversation: Conversation, ctx: ContextBotType): Promise<void>
}
