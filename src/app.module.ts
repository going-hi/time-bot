import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigOptions } from '@/configs';
import { BotModule } from './bot/bot.module';
import { GeminiModule } from './gemini';
import { TimezoneApiModule } from './timezone-api';
import { CacheSqliteModule } from './core/cache';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfigOptions),
    BotModule,
    GeminiModule,
    TimezoneApiModule,
    CacheSqliteModule,
    CitiesModule
  ],
})
export class AppModule {}

// time now
// time chat
// time 17:00 Москва
// time Москва Вьетнам
