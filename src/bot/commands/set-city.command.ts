import { AbstractCommand } from './abstract.command';
import { Context, CommandContext } from 'grammy';

export class SetCityCommand extends AbstractCommand {
  public commandName = 'setcity';
  public commandDescription = `Добавляет город для отслеживания времени ex: ${this.commandName} Москва`;

  public isMenuCommand = true;

  async execute(ctx: CommandContext<Context>): Promise<void> {
    const text = ctx.message?.text || '';
    const params = this.parseArgs(text);
    const chatId = ctx.message?.chat.id!;

    const cities = await this.citiesRepository.getCitiesByChatId(chatId);

    const messageCities = cities.length
      ? `Города доступные сейчас ${cities.join(', ')}`
      : 'У вас пока не добавлены города и страны для отслеживания';

    if (!params.length) {
      await ctx.reply(
        `Укажите города для добавления отслеживания, ${messageCities}`,
      );
      return;
    }
    cities.push(...params);

    const filterCities = Array.from(new Set(cities))

    await this.citiesRepository.save(chatId, filterCities)
    await ctx.reply(`Города для отслеживания времени: ${filterCities.join(', ')}`);
  }
}
