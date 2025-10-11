import { ImageHistoryRepository } from '@/image-histories'
import { ImageTimeUsersRepository } from '@/image-time-users'
import { Bot } from 'grammy'
import { ContextBotType } from '../types'
import { ImageCommonRepository } from '@/image-common'

export abstract class AbstractCronCommand {
	public cronTime: string

	protected imageHistoryRepository: ImageHistoryRepository
	protected imageTimeUserRepository: ImageTimeUsersRepository
	protected imageCommonRepository: ImageCommonRepository

	constructor(
		imageHistoryRepository: ImageHistoryRepository,
		imageTimeUserRepository: ImageTimeUsersRepository,
		imageCommonRepository: ImageCommonRepository
	) {
		this.imageHistoryRepository = imageHistoryRepository
		this.imageTimeUserRepository = imageTimeUserRepository
		this.imageCommonRepository = imageCommonRepository
	}

	public execute(bot: Bot<ContextBotType>, chatId: number) {
    }
}
