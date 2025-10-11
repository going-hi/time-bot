import { Module } from '@nestjs/common'
import { ImageCommonRepository } from './image-common.repository'
import { CacheSqliteModule } from '@/core/cache'

@Module({
	imports: [CacheSqliteModule],
	providers: [ImageCommonRepository],
	exports: [ImageCommonRepository]
})
export class ImageCommonModule {}
