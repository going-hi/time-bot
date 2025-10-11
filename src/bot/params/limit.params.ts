import { ContextBotType } from "../types"

export const limitParams = {
	timeFrame: 2000,
	limit: 3,
	onLimitExceeded: async (ctx: ContextBotType) => {
		if (ctx.config.isPaul) {
			await ctx.reply('Павел, хватит хуярить меня запросами, успокойся пожалуйста')
			return
		}

		await ctx.reply('Rate limit ошибка, успокойся')
	},
	keyGenerator: (ctx: ContextBotType) => {
		return ctx.from?.id.toString()
	}
}
