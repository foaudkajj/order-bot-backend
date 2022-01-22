export enum OrderChannel {
  Telegram = 'TELEGRAM',
  YemekSepetei = 'YEMEKSEPETI',
  Getir = 'GETIR',
  Panel = 'PANEL',
}

export enum OrderStatus {
  New = 0,
  UserConfirmed = 1,
  MerchantConfirmed = 2,
  Prepared = 3,
  OrderSent = 4,
  Delivered = 5,
  Canceled = 6,
  FutureOrder = 7,
  ConfirmedFutureOrder = 8,
}

export enum ProductStatus {
  Selected = 'SELECTED',
  InBasket = 'INBASKET',
}

export enum Status {
  Invalid = 0,
  Valid = 1,
}

export enum UserStatus {
  Passive,
  Active,
}

export enum PaymentMethod {
  OnDelivery = 'OnDelivery',
  Online = 'ONLINE',
}
