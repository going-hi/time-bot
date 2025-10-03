import { Context, CommandContext } from "grammy";

export abstract class AbstractCommand {
    public commandName: string
    public commandDescription: string

    public isMenuCommand = false

    abstract execute(ctx:  CommandContext<Context>): Promise<void>;
}