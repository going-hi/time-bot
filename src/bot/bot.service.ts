import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Bot, GrammyError, HttpError, InlineKeyboard } from 'grammy'
import { COMMANDS, AbstractCommand, ICommand } from './commands'
import { GeminiService } from '@/gemini'
import { TimezoneApiService } from '@/timezone-api'
import { limit } from '@grammyjs/ratelimiter'
import { CitiesRepository } from '@/cities'
import { conversations, createConversation } from '@grammyjs/conversations'
import { ImageHistoryRepository } from '@/image-histories'
import { ImageTimeUsersRepository } from '@/image-time-users'
import { Cron, CronExpression } from '@nestjs/schedule'
import { images } from './commands/add-image.command'
import { CALLBACK_QUERIES } from './callback-queries'
import { ContextBotType } from './types'
import { CONVERSATIONS } from './conversations'
import { estimateCallbackQueryName } from './callback-queries/estimate.callback-query'
import { limitParams } from './params'

const BOT_DEVELOPER = 2332
const paul = 6139896342

@Injectable()
export class BotService {
	private bot: Bot<ContextBotType>
	private menuCommands: AbstractCommand[] = []

	constructor(
		private readonly configService: ConfigService,
		private readonly geminiService: GeminiService,
		private readonly timezoneApiService: TimezoneApiService,
		private readonly citiesRepository: CitiesRepository,
		private readonly imageHistoryRepository: ImageHistoryRepository,
		private readonly imageTimeUserRepository: ImageTimeUsersRepository
	) {
		const token = configService.get('BOT_TOKEN')
		this.bot = new Bot<ContextBotType>(token)

		this.bot.use(async (ctx, next) => {
			ctx.config = {
				botDeveloper: BOT_DEVELOPER,
				paulId: paul,
				isDeveloper: ctx.from?.id === BOT_DEVELOPER,
				isPaul: ctx.from?.id === paul
			}

			await next()
		})

		this.bot.use(limit(limitParams))
		this.handleCommands()
		this.handleMenuCommands()
		this.bot.use(conversations())
		this.handleConversations()
		this.handleCallbackQueries()
		this.start()
		this.errorHandler()
	}

	private handleCommands() {
		const photoCommands: ICommand[] = []
		for (const Command of COMMANDS) {
			const instance = new Command(
				this.geminiService,
				this.timezoneApiService,
				this.citiesRepository,
				this.imageHistoryRepository,
				this.imageTimeUserRepository
			)
			if (instance.isMenuCommand) {
				this.menuCommands.push(instance)
			}

			const isPhoto = instance.isPhoto

			if (isPhoto) {
				photoCommands.push(instance)
			} else {
				this.bot.command(instance.commandName, ctx => instance.execute(ctx))
			}
		}

		this.photoHandlers(photoCommands)
	}

	private handleCallbackQueries() {
		for (const Callback of CALLBACK_QUERIES) {
			const instance = new Callback()
			this.bot.callbackQuery(instance.name, ctx => instance.execute(ctx))
		}
	}

	private handleConversations() {
		for (const Conversation of CONVERSATIONS) {
			const instance = new Conversation()

			const fn = instance.execute
			Object.defineProperty(fn, 'name', { value: instance.name })
			this.bot.use(createConversation(fn))
		}
	}

	public async start() {
		await this.bot.start()
		console.log('Bot started')
	}

	private async handleMenuCommands() {
		const infoList = this.menuCommands.map(cmd => ({
			command: cmd.commandName,
			description: cmd.commandDescription
		}))

		await this.bot.api.setMyCommands(infoList)
	}

	private errorHandler() {
		this.bot.catch(err => {
			const ctx = err.ctx
			console.error(`Error while handling update ${ctx.update.update_id}:`)
			const e = err.error
			if (e instanceof GrammyError) {
				console.error('Error in request:', e.description)
			} else if (e instanceof HttpError) {
				console.error('Could not contact Telegram:', e)
			} else {
				console.error('Unknown error:', e)
			}
			ctx.reply(`Ошибка повторите попозже! ${err.message}`)
		})
	}

	private photoHandlers(commands: ICommand[]) {
		const commandMap = commands.reduce<Record<string, ICommand>>((acc, current) => {
			const commandName = `/${current.commandName}`
			acc[commandName] = current
			return acc
		}, {})

		this.bot.on('message:photo', async ctx => {
			const commandLine = ctx.message.caption || ''
			const command = commandMap[commandLine]
			if (!command) {
				return
			}
			await command.execute(ctx as any)
		})
	}

	@Cron(CronExpression.EVERY_MINUTE)
	async handleCron() {
		console.log('HUIII')
		const chatId = -1003170352623

		const keyboard = new InlineKeyboard().text('Оценить пига🐷', estimateCallbackQueryName)

		if (!images.length) {
			return
		}

		await this.bot.api.sendPhoto(chatId, images[0], {
			caption: 'Вот твой новый пиг!!! Добрае утра!',
			reply_markup: keyboard
		})

	}
}
