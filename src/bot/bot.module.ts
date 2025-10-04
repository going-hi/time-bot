import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { GeminiModule } from "@/gemini";
import { TimezoneApiModule } from "@/timezone-api";
import { CitiesModule } from "@/cities/cities.module";

@Module({
    imports: [GeminiModule, TimezoneApiModule, CitiesModule],
    providers: [BotService]
})
export class BotModule {}
