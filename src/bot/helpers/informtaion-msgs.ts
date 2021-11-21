import { AppService } from 'src/app.service';

export abstract class InformationMessages {
  static async SendInformationMessage (chatId: string | number, text: string) {
    if (chatId && text) await AppService.bot.telegram.sendMessage(chatId, text);
  }
}
