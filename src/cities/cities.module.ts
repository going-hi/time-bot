import { CacheSqliteModule } from "@/core/cache";
import { Module } from "@nestjs/common";
import { CitiesRepository } from "./cities.repository";

@Module({
    imports: [CacheSqliteModule],
    providers: [CitiesRepository],
    exports: [CitiesRepository]
})
export class CitiesModule {}