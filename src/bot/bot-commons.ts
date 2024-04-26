import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram';
import {CallBackQueryResult} from './models/enums';

export const MainMenueInlineKeyboard: InlineKeyboardButton[][] = [
  [
    {
      text: 'Sipariş Ver',
      callback_data: CallBackQueryResult.StartOrdering,
    },
  ],
  [
    {
      text: '🚚 Siparişini Takip Et 🚚',
      callback_data: CallBackQueryResult.GetConfirmedOrders,
    },
  ],
  [{text: '🗑 Sepetem 🗑', callback_data: CallBackQueryResult.MyBasket}],
  [
    {
      text: '🗑 Sepetemi Boşalt 🗑',
      callback_data: CallBackQueryResult.EmptyBakset,
    },
  ],
  [
    {
      text: '✔️ Siparişimi Tamamla ✔️',
      callback_data: CallBackQueryResult.CompleteOrder,
    },
  ],
];
