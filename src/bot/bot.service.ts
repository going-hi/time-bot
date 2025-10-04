import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, GrammyError, HttpError } from 'grammy';
import { COMMANDS, AbstractCommand } from './commands';
import { GeminiService } from '@/gemini';
import { TimezoneApiService } from '@/timezone-api';
import { CacheSqliteService } from '@/core/cache';

@Injectable()
export class BotService {
  private bot: Bot;
  private menuCommands: AbstractCommand[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService,
    private readonly timezoneApiService: TimezoneApiService,
    private readonly cacheSqliteService: CacheSqliteService,
  ) {
    const token = configService.get('BOT_TOKEN');
    this.bot = new Bot(token);

    this.handleCommands();
    this.handleMenuCommands();

    this.start();
    this.errorHandler()
  }

  private handleCommands() {
    for (const Command of COMMANDS) {
      const instance = new Command(
        this.geminiService,
        this.timezoneApiService,
        this.cacheSqliteService,
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
      ctx.reply(`Ошибка повторите попозже! ${err.message}`)
    });
  }
}
