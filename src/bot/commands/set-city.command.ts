import { AbstractCommand } from "./abstract.command";
import { Context, CommandContext } from "grammy";

export const cities: string[] = ['Москва', 'Лондон', 'Нью-Йорк', 'Астана'];

export class SetCityCommand extends AbstractCommand {
    public commandName = "setcity"
    public commandDescription = `Добавляет город для отслеживания времени ex: ${this.commandName} Москва`

    public isMenuCommand = true

    async execute(ctx: CommandContext<Context>): Promise<void> {
        const text = ctx.message?.text || ""
        const params = this.parseArgs(text)
        cities.push(...params)
        await ctx.reply(`Города для отслеживания времени: ${cities.join(", ")}`)
    }
}
