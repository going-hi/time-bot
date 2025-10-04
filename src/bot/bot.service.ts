import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, CommandContext, Context, GrammyError, HttpError } from 'grammy';
import { COMMANDS, AbstractCommand } from './commands';
import { GeminiService } from '@/gemini';
import { TimezoneApiService } from '@/timezone-api';
import { limit } from '@grammyjs/ratelimiter';
import { CitiesRepository } from '@/cities';

@Injectable()
export class BotService {
  private bot: Bot;
  private menuCommands: AbstractCommand[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService,
    private readonly timezoneApiService: TimezoneApiService,
    private readonly citiesRepository: CitiesRepository,
  ) {
    const token = configService.get('BOT_TOKEN');
    this.bot = new Bot(token);

    this.bot.use(
      limit({
        timeFrame: 2000,
        limit: 3,
        onLimitExceeded: async (ctx: CommandContext<Context>) => {
          const authorId = ctx.message?.from.id;

          const paulId = 6139896342;
          if (authorId === paulId) {
            await ctx.reply(
              'Павел, хватит хуярить меня запросами, успокойся пожалуйста',
            );
            return;
          }

          await ctx.reply('Rate limit ошибка, успокойся');
        },
        keyGenerator: (ctx: CommandContext<Context>) => {
          return ctx.from?.id.toString();
        },
      }),
    );

    this.handleCommands();
    this.handleMenuCommands();

    this.start();
    this.errorHandler();
  }

  private handleCommands() {
    for (const Command of COMMANDS) {
      const instance = new Command(
        this.geminiService,
        this.timezoneApiService,
        this.citiesRepository,
      );
      if (instance.isMenuCommand) {
        this.menuCommands.push(instance);
      }

      this.bot.command(instance.commandName, (ctx) => instance.execute(ctx));
    }
  }

  public async start() {
    await this.bot.start();
    console.log('Bot started');
  }

  private async handleMenuCommands() {
    const infoList = this.menuCommands.map((cmd) => ({
      command: cmd.commandName,
      description: cmd.commandDescription,
    }));

    await this.bot.api.setMyCommands(infoList);
  }

  private errorHandler() {
    this.bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
      } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
      } else {
        console.error('Unknown error:', e);
      }
      ctx.reply(`Ошибка повторите попозже! ${err.message}`);
    });
  }
}
