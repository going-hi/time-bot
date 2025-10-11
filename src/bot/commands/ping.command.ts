import { ContextBotType } from "../types";
import { AbstractCommand } from "./abstract.command";

export class PingCommand extends AbstractCommand {
    public commandName = "ping"
    public commandDescription = "Ping the bot"

    public isMenuCommand = true

    async execute(ctx: ContextBotType): Promise<void> {
        console.log(ctx.message?.chat, "HUI")


        const msg = ctx.msg?.message_id!


        await ctx.reply("pong pong pong pong!!!", {
            reply_parameters: { message_id:  msg},
        })
    }

   
 }