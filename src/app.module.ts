import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigOptions } from '@/configs';
import { BotModule } from './bot/bot.module';
import { GeminiModule } from './gemini';
import { TimezoneApiModule } from './timezone-api';

@Module({
  imports: [ConfigModule.forRoot(EnvConfigOptions), BotModule, GeminiModule, TimezoneApiModule],
})
export class AppModule {}

// time now
// time chat
// time 17:00 Москва
// time Москва Вьетнам