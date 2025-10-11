import { Conversation } from '@grammyjs/conversations'
import { ContextBotType } from '../types'
import { AbstractConversation } from './abstract.conversation'
import { isNumber } from 'class-validator'

export const estimateConversationName = 'estimate-conversation'

export class EstimateConversation extends AbstractConversation {
	public name = estimateConversationName

	public async execute(conversation: Conversation, ctx: ContextBotType): Promise<void> {
		await ctx.reply('Оцени картинку от 0 до 10. Чтобы улучшить подбор картинок!')

		const msg = await conversation.wait()

		const text = msg.message?.text || ''

		if (!text || !isNumber(+text)) {
			await ctx.reply('Не валидная оценка(( до следующего поста(')
			return
		}

        await ctx.reply("Спасибо за оценку! До следующего поста!")
	}
}
