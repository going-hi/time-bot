import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvConfigOptions } from '@/configs'
import { BotModule } from './bot/bot.module'
import { GeminiModule } from './gemini'
import { TimezoneApiModule } from './timezone-api'
import { CacheSqliteModule } from './core/cache'
import { CitiesModule } from './cities/cities.module'
import { ImageHistoryModule } from './image-histories'
import { ImageTimeUsersModule } from './image-time-users'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
	imports: [
		ConfigModule.forRoot(EnvConfigOptions),
		ScheduleModule.forRoot(),
		BotModule,
		GeminiModule,
		TimezoneApiModule,
		CacheSqliteModule,
		CitiesModule,
		ImageHistoryModule,
		ImageTimeUsersModule
	]
})
export class AppModule {}

// time now
// time chat
// time 17:00 Москва
// time Москва Вьетнам
