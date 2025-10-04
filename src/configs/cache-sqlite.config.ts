
import KeyvSqlite from '@keyv/sqlite';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const getCacheSqliteConfig = (
  configService: ConfigService,
): CacheModuleOptions => {
  const sqlitePath = configService.get<string>('SQLITE_PATH');

  const newStore = new KeyvSqlite(sqlitePath);
  return {
    stores: [newStore],
  };
};
