import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { GeminiModule } from "@/gemini";
import { TimezoneApiModule } from "@/timezone-api";

@Module({
    imports: [GeminiModule, TimezoneApiModule],
    providers: [BotService]
})
export class BotModule {}
