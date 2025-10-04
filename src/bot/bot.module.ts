import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { GeminiModule } from "@/gemini";
import { TimezoneApiModule } from "@/timezone-api";
import { CacheSqliteModule } from "@/core/cache";

@Module({
    imports: [GeminiModule, TimezoneApiModule, CacheSqliteModule],
    providers: [BotService]
})
export class BotModule {}
