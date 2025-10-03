import { AbstractCommand } from "./abstract.command";
import { Context, CommandContext } from "grammy";

export class StartCommand extends AbstractCommand {
    public commandName = "start"
    public commandDescription = "Бот для удобной работы с часовыми поясами love from going йоу"

    public isMenuCommand = true

    private message = 'Бот для удобной работы с часовыми поясами love from going йоу'

    async execute(ctx: CommandContext<Context>): Promise<void> {
        await ctx.reply(this.message)
    }
 }