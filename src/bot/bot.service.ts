import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Bot } from "grammy"
import { COMMANDS } from "./commands";
import { AbstractCommand } from "./commands";

@Injectable()
export class BotService {
    private bot: Bot
    private menuCommands: AbstractCommand[] = []
    

    constructor(configService: ConfigService) {
        const token = configService.get("BOT_TOKEN");
        this.bot = new Bot(token);

        this.handleCommands()
        this.handleMenuCommands()

        this.start()
    } 


    private handleCommands() {
        for (const Command of COMMANDS) { 
            const instance = new Command()

            if (instance.isMenuCommand) {
                this.menuCommands.push(instance)
            }

            this.bot.command(instance.commandName, (ctx) => instance.execute(ctx))
        }
    }

    public async start() {
        await this.bot.start();
        console.log("Bot started")
    }

    public async handleMenuCommands() {
        const infoList = this.menuCommands.map(cmd => ({
            command: cmd.commandName,
            description: cmd.commandDescription
        }))

        await this.bot.api.setMyCommands(infoList)
    }

}