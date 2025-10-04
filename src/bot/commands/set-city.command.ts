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

    const cities = await this.getSaveCities(chatId);

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

    await this.saveCities(chatId, filterCities)
    await ctx.reply(`Города для отслеживания времени: ${filterCities.join(', ')}`);
  }

  private async saveCities(chatId: number, cities: string[]) {
    const key = `chatik:${chatId}:cities`;
    await this.cacheSqliteService.set(key, cities.join(','));
  }

  private async getSaveCities(chatId: number): Promise<string[]> {
    const citiesRaw = await this.cacheSqliteService.get(
      `chatik:${chatId}:cities`,
    );
    if (!citiesRaw) {
      return [];
    }

    return citiesRaw.split(',');
  }
}
