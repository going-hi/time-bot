import { writeFile, writeFileSync } from 'fs';
import { AbstractCommand } from './abstract.command';
import { Context, CommandContext } from 'grammy';
import { cities } from './set-city.command';
import { getPromptTimezone } from '../prompts';
import { DateTime } from 'luxon';

export class TimeCommand extends AbstractCommand {
  public commandName = 'time';
  public commandDescription = 'Бот для удобной работы с часовыми поясами.';
  public isMenuCommand = true;

  async execute(ctx: CommandContext<Context>): Promise<void> {
    const text = ctx.message?.text || '';

    const params = this.parseArgs(text);
    const result = await this.handleParams(params);

    await ctx.reply(result);
    return;
  }

  private async handleParams(params: string[]): Promise<string> {
    const { isAllCitiesNow, isWillTime } = this.isCommandByParams(params);

    let result = 'Не удалось распознать команду';;

    if (isAllCitiesNow) {
      result = await this.handleAllCities(params);
    } else if (isWillTime) {
      result = await this.handleWillTime(params);
    }

    return result
  }

  private async getTimesZones(cities: string[]): Promise<string[]> {
    const prompt = getPromptTimezone(cities.join(' '));
    const rawData = await this.geminiService.generate(prompt);
    return rawData.trim().split(' ');
  }

  private async handleWillTime(params: string[]): Promise<string> {
    let [time, firstCity, ...citiesParams] = params;

    console.log({ time, firstCity, citiesParams });
    if (!citiesParams.length) {
      citiesParams = cities;
    }

    const [timezoneFirstCity, ...timezones] = await this.getTimesZones([
      firstCity,
      ...citiesParams,
    ]);

    const now = DateTime.now().setZone(timezoneFirstCity);

    const [hour, minute] = time.split(':').map(Number);

    const localTime = now.set({ hour, minute });

    const map = timezones.reduce<Record<string, string>>(
      (acc, timezone, index) => {
        const city = citiesParams[index];
        const timeInCity = localTime.setZone(timezone).toFormat('HH:mm');
        acc[city] = timeInCity;
        return acc;
      },
      {},
    );


    const citiesString = this.mapCities(map);

    const result = `Когда в ${firstCity} будет ${time}, в других городах будет:\n${citiesString}`;
    return result;
  }

  private mapCities(map: Record<string, string>): string {
    const result = Object.keys(map)
      .map((key) => `${key}: ${map[key]}`)
      .join('\n');

      return result
  }

  private async handleAllCities(params: string[]): Promise<string> {
    let citiesParams = params;

    if (!citiesParams.length) {
      citiesParams = cities;
    }

    const timezones = await this.getTimesZones(citiesParams);

    const results = timezones.map((timezone) =>
      this.getTimeByTimezone(timezone),
    );

    const res = results.reduce<Record<string, string>>(
      (acc, current, index) => {
        if (current === 'ERROR_TIMEZONE') return acc;
        acc[cities[index]] = current;
        return acc;
      },
      {},
    );

    const resultString = this.mapCities(res);
    return `Сейчас в городах:\n${resultString}`;
  }

  private getTimeByTimezone(timezone: string): string {
    try {
      const now = new Date();

      const formatted = new Intl.DateTimeFormat('ru-RU', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);

      return formatted;
    } catch (err) {
      return 'ERROR_TIMEZONE';
    }
  }

  private isTime(param: string): boolean {
    return param.length === 5 && param[2] === ':';
  }

  private isCommandByParams(params: string[]) {
    const isAllCitiesNow = params.length === 0 || (params.length === 1 && params[0] === 'now');
    const isWillTime = params.length >= 2 && this.isTime(params[0]);

    return {
      isAllCitiesNow,
      isWillTime,
    };
  }
}

// time now
// time now Москва Лондон Питер
// time-save
// time 17:00 Москва Лондон Питер
