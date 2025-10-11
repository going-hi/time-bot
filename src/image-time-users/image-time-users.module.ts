import { Module } from '@nestjs/common'
import { ImageTimeUsersRepository } from './image-time-users.repository'
import { CacheSqliteModule } from '@/core/cache'

@Module({
	imports: [CacheSqliteModule],
	providers: [ImageTimeUsersRepository],
	exports: [ImageTimeUsersRepository]
})
export class ImageTimeUsersModule {}
