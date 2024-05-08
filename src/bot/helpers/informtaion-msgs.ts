import {Injectable} from '@nestjs/common';
import {BotService} from '../bot.service';

@Injectable()
export class InformationMessages {
  constructor() {}

  async SendInformationMessage(
    botUserName: string,
    telegramId: number,
    text: string,
  ) {
    if (botUserName && text) {
      const botInstance = BotService.botMap.get(botUserName);
      if (botInstance) {
        await botInstance.telegram.sendMessage(telegramId, text, {
          parse_mode: 'HTML',
        });
      }
    }
  }
}
