import { AbstractCommand } from "./abstract.command";
import { Context, CommandContext } from "grammy";

export class SetCityCommand extends AbstractCommand {
    public commandName = "setcity"
    public commandDescription = `Добавляет город для отслеживания времени ex: ${this.commandName} Москва`

    public isMenuCommand = true

    async execute(ctx: CommandContext<Context>): Promise<void> {
        await ctx.reply("pong!!!")
        const text = ctx.message?.text || ""
        const params = this.parseArgs(text)
        
    }
}
