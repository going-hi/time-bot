import { CacheSqliteService } from "@/core/cache";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageHistoryRepository {
    constructor(private readonly cacheSqliteService: CacheSqliteService) {}

    private getKey(chatId: number) {
        return `chatik:${chatId}:image-histories`;
    }


    public async save(chatId: number, images: string[]) {
        const key = this.getKey(chatId)
        await this.cacheSqliteService.set(key, images.join(','))
    }


   public async getCitiesByChatId(chatId: number): Promise<string[]> {
    const key = this.getKey(chatId);
    const imagesRaw = await this.cacheSqliteService.get(key);
    if (!imagesRaw) {
      return [];
    }

    return imagesRaw.split(',');
  }
}