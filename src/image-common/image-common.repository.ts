import { CacheSqliteService } from '@/core/cache'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ImageCommonRepository {
	constructor(private readonly cacheSqliteService: CacheSqliteService) {}

	private getKeyUsersList() {
		return `crons:globals`
	}

	private getKeyImageList() {
		return `images:lists`
	}

	public async saveUsersList(chatIds: number[]) {
		const key = this.getKeyUsersList()
		const value = chatIds.join(', ')
		await this.cacheSqliteService.set(key, value)
	}

	public async getImageUsersList(): Promise<string[]> {
		const key = this.getKeyUsersList()
		const list = await this.cacheSqliteService.get(key)

		if (!list) {
			return []
		}

		return list.split(', ')
	}

	public async saveImages(images: string[]) {
		const key = this.getKeyImageList()
		const value = images.join(', ')
		await this.cacheSqliteService.set(key, value)
	}

	public async getImages(): Promise<string[]> {
		const key = this.getKeyImageList()
		const list = await this.cacheSqliteService.get(key)

		if (!list) {
			return []
		}

		return list.split(', ')
	}
}
