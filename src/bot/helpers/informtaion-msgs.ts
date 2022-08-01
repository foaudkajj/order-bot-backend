import {Injectable} from '@nestjs/common';

@Injectable()
export class InformationMessages {
  constructor() {}

  async SendInformationMessage(
    botUserName: string,
    telegramId: number,
    text: string,
  ) {
    //TODO
    // if (botUserName && text) {
    //   const botInstance = this.botService.botMap.get(botUserName);
    //   if (botInstance) {
    //     await botInstance.telegram.sendMessage(telegramId, text);
    //   }
    // }
  }
}
