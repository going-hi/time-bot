import { Module } from "@nestjs/common";
import { ImageHistoryRepository } from "./image-history.repository";
import { CacheSqliteModule } from "@/core/cache";

@Module({
    imports: [CacheSqliteModule],
    providers: [ImageHistoryRepository],
    exports: [ImageHistoryRepository]
})
export class ImageHistoryModule {

}