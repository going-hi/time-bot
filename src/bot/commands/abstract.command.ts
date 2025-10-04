import { CitiesRepository } from "@/cities";
import { CacheSqliteService } from "@/core/cache";
import { GeminiService } from "@/gemini";
import { TimezoneApiService } from "@/timezone-api";
import { Context, CommandContext } from "grammy";

export abstract class AbstractCommand {
    public commandName: string
    public commandDescription: string
    public isMenuCommand = false
    protected geminiService: GeminiService
    protected timezoneApiService: TimezoneApiService
    protected citiesRepository: CitiesRepository

    constructor(geminiService: GeminiService, timezoneApiService: TimezoneApiService, citiesRepository: CitiesRepository) {
        this.geminiService = geminiService
        this.timezoneApiService = timezoneApiService
        this.citiesRepository = citiesRepository
    }

    abstract execute(ctx: CommandContext<Context>): Promise<void>;

    protected parseArgs(text: string): string[] {
        return text.split(" ").slice(1);
    }
}