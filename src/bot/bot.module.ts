import { Module } from '@nestjs/common'
import { BotService } from './bot.service'
import { GeminiModule } from '@/gemini'
import { TimezoneApiModule } from '@/timezone-api'
import { CitiesModule } from '@/cities/cities.module'
import { ImageHistoryModule } from '@/image-histories'
import { ImageTimeUsersModule } from '@/image-time-users'
import { ImageCommonModule } from '@/image-common'

@Module({
	imports: [
		GeminiModule,
		TimezoneApiModule,
		CitiesModule,
		ImageHistoryModule,
		ImageTimeUsersModule,
		ImageCommonModule
	],
	providers: [BotService]
})
export class BotModule {}
