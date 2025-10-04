import { GeminiService } from "@/gemini";
import { TimezoneApiService } from "@/timezone-api";
import { Context, CommandContext } from "grammy";

export abstract class AbstractCommand {
    public commandName: string
    public commandDescription: string
    public isMenuCommand = false
    protected geminiService: GeminiService
    protected timezoneApiService: TimezoneApiService

    constructor(geminiService: GeminiService, timezoneApiService: TimezoneApiService) {
        this.geminiService = geminiService
        this.timezoneApiService = timezoneApiService
    }

    abstract execute(ctx:  CommandContext<Context>): Promise<void>;

    protected parseArgs(text: string): string[] {
        return text.split(" ").slice(1);
    }
}