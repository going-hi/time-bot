import { CacheSqliteService } from '@/core/cache';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CitiesRepository {
  constructor(private readonly cacheSqliteService: CacheSqliteService) {}

  private getKey(chatId: number) {
    return `chatik:${chatId}:cities`;
  }

  public async save(chatId: number, cities: string[]) {
    const key = this.getKey(chatId);
    await this.cacheSqliteService.set(key, cities.join(','));
  }

  public async getCitiesByChatId(chatId: number): Promise<string[]> {
    const key = this.getKey(chatId);
    const citiesRaw = await this.cacheSqliteService.get(key);
    if (!citiesRaw || !citiesRaw.length) {
      return [];
    }

    return citiesRaw.split(',');
  }
}
