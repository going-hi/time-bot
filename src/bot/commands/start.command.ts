import { ContextBotType } from "../types";
import { AbstractCommand, ICommand } from "./abstract.command";

export class StartCommand extends AbstractCommand implements ICommand {
    public commandName = "start"
    public commandDescription = "Бот для удобной работы с часовыми поясами love from going йоу"

    public isMenuCommand = true

    private message = 'Бот для удобной работы с часовыми поясами love from going йоу'

    async execute(ctx: ContextBotType): Promise<void> {
        await ctx.reply(this.message)
    }
 }