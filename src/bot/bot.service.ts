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
import { CALLBACK_QUERIES } from './callback-queries'
import { ContextBotType } from './types'
import { CONVERSATIONS } from './conversations'
import { estimateCallbackQueryName } from './callback-queries/estimate.callback-query'
import { limitParams } from './params'
import { AbstractCronCommand } from './cron-commands/abstract.cron-command'
import { CRON_COMMANDS } from './cron-commands'
import { ImageCommonRepository } from '@/image-common'

const BOT_DEVELOPER = 2332
const paul = 6139896342

const chatPodId = -1003170352623

@Injectable()
export class BotService {
	private bot: Bot<ContextBotType>
	private menuCommands: AbstractCommand[] = []
	private crons: AbstractCronCommand[] = []

	constructor(
		private readonly configService: ConfigService,
		private readonly geminiService: GeminiService,
		private readonly timezoneApiService: TimezoneApiService,
		private readonly citiesRepository: CitiesRepository,
		private readonly imageHistoryRepository: ImageHistoryRepository,
		private readonly imageTimeUserRepository: ImageTimeUsersRepository,
		private readonly imageCommonRepository: ImageCommonRepository
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
		this.handleCronCommands()
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
				this.imageTimeUserRepository,
				this.imageCommonRepository
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

	private handleCronCommands() {
		for (const CronCommand of CRON_COMMANDS) {
			const instance = new CronCommand(
				this.imageHistoryRepository,
				this.imageTimeUserRepository,
				this.imageCommonRepository
			)
			this.crons.push(instance)
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

	private getTime() {
		const now = new Date()

		const minutes = now.getMinutes().toString().padStart(2, '0')
		const seconds = now.getSeconds().toString().padStart(2, '0')

		const time = `${minutes}:${seconds}`
		return time
	}

	private isWithinFiveMinutes(now: string, target: string): boolean {
		const toMinutes = (t: string) => {
			const [h, m] = t.split(':').map(Number)
			return h * 60 + m
		}

		const diff = toMinutes(target) - toMinutes(now)
		return diff <= 5 && diff > 0
	}

	// НУЖНО добавить изображение
	// @Cron(CronExpression.EVERY_MINUTE)
	async handleCron() {
		console.log('HUIII')
		const time = this.getTime()

		// const timePaul = await this.imageTimeUserRepository.getTime(paul)
		const timePaul = '23:01'

		if (!timePaul) {
			return
		}

		const images = await this.imageCommonRepository.getImages()

		if (this.isWithinFiveMinutes(time, timePaul) && !images) {
			await this.bot.api.sendMessage(
				chatPodId,
				'Добавьте изображение! Осталось около 5 минут до публикации'
			)
			return
		}

		if (!images.length) {
			await this.bot.api.sendMessage(
				chatPodId,
				'Добавьте изображение! Сообщение не оправилось('
			)
		}


		if(time !== timePaul) {
			return
		}
		

		const keyboard = new InlineKeyboard().text('Оценить пига🐷', estimateCallbackQueryName)

		const image = images.shift()!

		await this.bot.api.sendPhoto(paul, image, {
			caption: 'Вот твой новый пиг!!! Добрае утра!',
			reply_markup: keyboard
		})

		await this.bot.api.sendPhoto(chatPodId, image, {
			caption: 'Вот твой новый пиг!!! Добрае утра!',
			reply_markup: keyboard
		})
		await this.imageCommonRepository.saveImages(images)
	}
}
