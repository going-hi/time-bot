import { AbstractCommand } from './abstract.command'
import { ContextBotType } from '../types'

export class SetNotificationCommand extends AbstractCommand {
	public commandName = 'setnot'
	public commandDescription = `Секрет команда /${this.commandName} <hh:mm> (example 10:00) !Укажите время в МСК`

	public isMenuCommand = false

	public async execute(ctx: ContextBotType): Promise<void> {
		const text = ctx.message?.text || ''
		const chatId = ctx.message?.chat.id!
		const [time = ""] = this.parseArgs(text)

		if (!this.isTimeFormat(time)) {
			await ctx.reply('Укажите time в формате hh:mm')
			return
		}

		await this.imageTimeUserRepository.save(chatId, time)
		await ctx.reply(`Ваше время установлено! Вам придет уведомление в ${time} по МСК`)
	}

	private isTimeFormat(param: string): boolean {
		return param.length === 5 && param[2] === ':'
	}
}
