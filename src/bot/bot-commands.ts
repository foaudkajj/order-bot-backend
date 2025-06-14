import {InlineKeyboardButton} from '@telegraf/types';
import {CallBackQueryResult} from './models/enums';

/**
 * A class used to mange the commands of the bot.
 */
export class BotCommands {
  static actions = {
    [CallBackQueryResult.CompleteOrder]: '✔️ Siparişimi Tamamla ✔️',
    [CallBackQueryResult.MainMenu]: '◀️ Ana Menüye Dön ◀️',
    [CallBackQueryResult.StartOrdering]: 'Sipariş Ver',
    [CallBackQueryResult.TrackOrder]: '😍 Aktif siparişler 😍',
    [CallBackQueryResult.MyBasket]: '🛒 Sepetim 🛒',
    [CallBackQueryResult.EmptyBakset]: '🗑 Sepetemi Boşalt 🗑',
    [CallBackQueryResult.AddToBasketAndContinueShopping]:
      '🛒 Sepete Ekle ve Alışverişe devam et 🛒',
    [CallBackQueryResult.RemoveFromBasket]: 'Ürün çıkar',
    [CallBackQueryResult.SendOrder]: '👌 Siparişimi Onayla 👌',
    [CallBackQueryResult.AddNoteToOrder]: '🗒 Siparişe Not Ekle/Düzenle 🗒',
    [CallBackQueryResult.AddUpdateAddress]: '📍Adresimi Güncelle📍',
  };

  static getMainMenu(
    data?: {[key in CallBackQueryResult]: object},
    exclude?: CallBackQueryResult[],
  ): InlineKeyboardButton[][] {
    return [
      CallBackQueryResult.StartOrdering,
      CallBackQueryResult.TrackOrder,
      CallBackQueryResult.MyBasket,
      CallBackQueryResult.EmptyBakset,
      CallBackQueryResult.CompleteOrder,
      CallBackQueryResult.RemoveFromBasket,
      CallBackQueryResult.AddUpdateAddress,
    ]
      .filter(cmnd => !(exclude ?? []).includes(cmnd))
      .map(action => {
        return <InlineKeyboardButton[]>[
          {
            text: this.actions[action],
            callback_data: JSON.stringify({
              action: action,
              data: data?.[action] ?? {},
            }),
          },
        ];
      });
  }

  static getCustom(
    cmnds: {action: CallBackQueryResult; text?: string; data?: any}[],
  ): InlineKeyboardButton[][] {
    return cmnds.map(cmnd => {
      return <InlineKeyboardButton[]>[
        {
          text: cmnd.text ?? this.actions[cmnd.action],
          callback_data: JSON.stringify({
            action: cmnd.action,
            data: cmnd.data ?? {},
          }),
        },
      ];
    });
  }
}
