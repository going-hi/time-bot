import { AbstractCallbackQuery } from './abstract.callback-query'
import { ContextBotType } from '../types'
import { estimateConversationName } from '../conversations/estimate.conversation'

export const estimateCallbackQueryName = 'estimate-callback'

export class EstimateCallbackQuery extends AbstractCallbackQuery {
	public name = estimateCallbackQueryName

	public async execute(ctx: ContextBotType): Promise<void> {
		await ctx.conversation.enter(estimateConversationName)
	}
}
