import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigOptions } from '@/configs';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot(EnvConfigOptions), BotModule],
})
export class AppModule {}
