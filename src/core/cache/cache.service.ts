import { CACHE_MANAGER , Cache} from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheSqliteService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async set(
    key: string,
    value: string | Buffer | number,
    seconds?: number,
  ): Promise<void> {
    await this.cacheManager.set(key, value, seconds)
  }

  public get(key: string): Promise<string | null | undefined> {
    return this.cacheManager.get(key);
  }

  public del(key: string): Promise<boolean> {
    return this.cacheManager.del(key);
  }
}
