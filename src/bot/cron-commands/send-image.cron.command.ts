import { AbstractCronCommand } from './abstract.cron-command'
import { Bot, InlineKeyboard } from 'grammy'
import { ContextBotType } from '../types'
import { estimateCallbackQueryName } from '../callback-queries/estimate.callback-query'

const chatPodId = -1003170352623

export class SendImageCronCommand extends AbstractCronCommand {
	public async execute(bot: Bot<ContextBotType>, chatId: number): Promise<void> {
		const keyboard = new InlineKeyboard().text('Оценить пига🐷', estimateCallbackQueryName)

		this.imageTimeUserRepository.getTime(chatId)

		// if (!images.length) {
		// 	await bot.api.sendMessage(chatPodId, 'Добавьте изображение!')
		// 	return
		// }

		// await bot.api.sendPhoto(chatId, images[0], {
		// 	caption: 'Вот твой новый пиг!!! Добрае утра!',
		// 	reply_markup: keyboard
		// })
	}
}
