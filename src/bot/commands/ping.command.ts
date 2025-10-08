import { AbstractCommand } from "./abstract.command";
import { Context, CommandContext } from "grammy";

export class PingCommand extends AbstractCommand {
    public commandName = "ping"
    public commandDescription = "Ping the bot"

    public isMenuCommand = true

    async execute(ctx: CommandContext<Context>): Promise<void> {
        console.log(ctx.message?.chat, "HUI")

        await ctx.reply("pong pong pong pong!!!", {
            reply_parameters: { message_id: ctx.msg.message_id },
        })
    }

   
 }