import { getCacheSqliteConfig } from '@/configs/cache-sqlite.config';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheSqliteService } from './cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: getCacheSqliteConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [CacheSqliteService],
  exports: [CacheSqliteService]
})
export class CacheSqliteModule {}
