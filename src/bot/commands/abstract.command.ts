import { CitiesRepository } from '@/cities'
import { GeminiService } from '@/gemini'
import { ImageHistoryRepository } from '@/image-histories'
import { ImageTimeUsersRepository } from '@/image-time-users'
import { TimezoneApiService } from '@/timezone-api'
import { ContextBotType } from '../types'


export interface ICommand {
	commandName: string
	commandDescription: string
	isMenuCommand: boolean
	isPhoto: boolean

	execute(ctx: ContextBotType): Promise<void>
}
export abstract class AbstractCommand implements  ICommand{
	public commandName: string
	public commandDescription: string
	public isMenuCommand = false
	public isPhoto = false
	protected geminiService: GeminiService
	protected timezoneApiService: TimezoneApiService
	protected citiesRepository: CitiesRepository
	protected imageHistoryRepository: ImageHistoryRepository
    protected imageTimeUserRepository: ImageTimeUsersRepository

	constructor(
		geminiService: GeminiService,
		timezoneApiService: TimezoneApiService,
		citiesRepository: CitiesRepository,
		imageHistoryRepository: ImageHistoryRepository,
        imageTimeUserRepository: ImageTimeUsersRepository
	) {
		this.geminiService = geminiService
		this.timezoneApiService = timezoneApiService
		this.citiesRepository = citiesRepository
		this.imageHistoryRepository = imageHistoryRepository
        this.imageTimeUserRepository = imageTimeUserRepository
	}

	abstract execute(ctx: ContextBotType): Promise<void>

	protected parseArgs(text: string): string[] {
		return text.split(' ').slice(1)
	}
}
