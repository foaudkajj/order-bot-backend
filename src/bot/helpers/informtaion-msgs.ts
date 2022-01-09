import {AppService} from 'src/app.service';

export abstract class InformationMessages {
  static async SendInformationMessage(
    botUserName: string,
    telegramId: number,
    text: string,
  ) {
    if (botUserName && text) {
      const botInstance = AppService.botMap.get(botUserName);
      if (botInstance) {
        await botInstance.telegram.sendMessage(telegramId, text);
      }
    }
  }
}
