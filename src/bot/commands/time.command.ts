import { GeminiService } from '@/gemini';
import { AbstractCommand } from './abstract.command';
import { Context, CommandContext } from 'grammy';
import { DateTime } from 'luxon';

export class TimeCommand extends AbstractCommand {
  public commandName = 'time';
  public commandDescription = 'Ping the bot';
  public isMenuCommand = true;

  async execute(ctx: CommandContext<Context>): Promise<void> {
    const text = ctx.message?.text || '';

    const params = this.parseArgs(text);

    if (this.validationParams(params)) {
      await ctx.reply('Введите данные в формате /time Время Город - Город');
      return;
    }

    const prompt = this.getPromptTimezone(params[0]);

    const generateText = await this.geminiService.generate(prompt);
    console.log('generateText', generateText);

    await ctx.reply(this.getDate(generateText));
  }

  private getDate(timezone: string): string {
    return DateTime.now().setZone(timezone).toFormat('yyyy-MM-dd HH:mm:ss');
  }

  private validationParams(params: string[]): boolean {
    return params.length < 1;
  }

  private getCityPrompt(city: string) {
    return `Ты профессиональный переводчик. Ты получаешь данные или город или страну, ты должен перевести название на английский язык. Но ответ ты должен дать в формате "Город", если ты не смог перевести, то ответь "Неизвестно", вот твой первый город: ${city}`;
  }

  private getPromptTimezone(city: string) {
    return `Ты профессиональный переводчик. Ты получаешь данные город или страну, ты должен вывести мне timezone на английский язык. Но ответ ты должен дать в формате "timezone", если ты не смог перевести, то ответь "Неизвестно", вот твой первый город: ${city}`;
  }

  private getGmtNumberPrompt(city: string) {
    return `Ты профессиональный переводчик. Ты получаешь данные город или страну, ты должен вывести мне GMT этого региона или города. Но ответ ты должен дать в формате "number", просто число, без GMT, если ты не смог перевести, то ответь "Неизвестно", вот твой первый город или регион: ${city}`;
  }

  private example = `Ты профессиональный переводчик.Ты получаешь данные вида "время Город1 -> Город2
                    Эта строка значит что ты должен вернуть время в Город2, когда в Город1 время.
                    Ты должен вернуть должен одну строку в формате “Когда в Город1 время, в Город2 …”
                    Если пользователь ввел страну, то в качестве ответа ты должен вернуть время в столице этой страны, но пиши все равно страну в ответе
                    В ответе дай только одну строчку - только время в формате “Когда в Город1 время, в Город2 ...”!!!!
                    Если пользователь ввел что-то другое, или дал недостаточно данных, то в качестве ответа ты должен вернуть “Введите данные в формате /time Время Город - Город”, НО
                    Если пользователь ввел только города или страны, дай ответ относительно текущего времени, вот оно в UTC:${new Date().toUTCString().split(' ')[4].split(':').slice(0, 2).join(':')}. Ответ дай не в utc формате, а в местном времени города
                    Не используй никакие разметки в ответе, только текст
                    Вот первая строка:`;
}

// time now
