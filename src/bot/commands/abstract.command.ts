import { GeminiService } from "@/gemini";
import { Context, CommandContext } from "grammy";

export abstract class AbstractCommand {
    public commandName: string
    public commandDescription: string
    public isMenuCommand = false
    protected geminiService: GeminiService

    constructor(geminiService: GeminiService) {
        this.geminiService = geminiService
    }

    abstract execute(ctx:  CommandContext<Context>): Promise<void>;

    protected parseArgs(text: string): string[] {
        return text.split(" ").slice(1);
    }
}