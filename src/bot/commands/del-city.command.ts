import { CommandContext, Context } from 'grammy';
import { AbstractCommand } from './abstract.command';

export class DelCityCommand extends AbstractCommand {
  public commandName = 'delcity';
  public commandDescription = `Удаляет город для отслеживания времени ex: /${this.commandName} Москва`;

  public isMenuCommand = true


  public async execute(ctx: CommandContext<Context>): Promise<void> {
    const text = ctx.message?.text || ''
    const chatId = ctx.message?.chat.id!
    const params = this.parseArgs(text)

    if(!params.length) {
        await ctx.reply(`Укажите в формете /${this.commandName} Город`)
        return
    }

    const cities = await this.citiesRepository.getCitiesByChatId(chatId)

    if(!cities.length) {
        await ctx.reply(`У вас пустой список городов и мест`)
        return
    }

    const filteredCities = cities.filter(city => !params.includes(city))

    await this.citiesRepository.save(chatId, filteredCities)

    const message = filteredCities.length ? `Ваш текущий список: ${filteredCities.join(', ')}` : "Ваш текущий список сейчас пуст"

    await ctx.reply(`Вы удалили из списка! ${message}`)
  } 
}
