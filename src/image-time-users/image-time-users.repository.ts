import { CacheSqliteService } from '@/core/cache'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ImageTimeUsersRepository {
	constructor(private readonly cacheSqliteService: CacheSqliteService) {}

	private getKey(chatId: number) {
		return `chatik:${chatId}:image-time`
	}

	public async save(chatId: number, time: string) {
		const key = this.getKey(chatId)
		await this.cacheSqliteService.set(key, time)
	}

	public async getTime(chatId: number): Promise<string | null> {
		const key = this.getKey(chatId)
		const time = await this.cacheSqliteService.get(key)

		if (!time) {
			return null
		}

		return time
	}
}
