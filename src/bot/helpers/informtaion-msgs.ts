import {Injectable} from '@nestjs/common';
import {AppService} from 'src/app.service';

@Injectable()
export class InformationMessages {
  constructor(private appService: AppService) {}

  async SendInformationMessage(
    botUserName: string,
    telegramId: number,
    text: string,
  ) {
    if (botUserName && text) {
      const botInstance = this.appService.botMap.get(botUserName);
      if (botInstance) {
        await botInstance.telegram.sendMessage(telegramId, text);
      }
    }
  }
}
