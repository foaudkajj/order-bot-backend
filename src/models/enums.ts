export enum OrderChannel {
  Telegram = 'TELEGRAM',
  YemekSepetei = 'YEMEKSEPETI',
  Getir = 'GETIR',
  Panel = 'PANEL',
}

export enum OrderStatus {
  New = 'NEW',
  UserConfirmed = 'USER_CONFIRMED',
  MerchantConfirmed = 'MERCHANT_CONFIRMED',
  Prepared = 'PREPARED',
  OrderSent = 'ORDER_SENT',
  Delivered = 'DELIVERED',
  Canceled = 'CANCELLED',
  FutureOrder = 'FUTURE_ORDER',
  ConfirmedFutureOrder = 'CONFIRMED_FUTURE_ORDER',
}

export enum ProductStatus {
  // means the prduct is selected from the menu appears to the user by the Telegram.
  Selected = 'SELECTED',
  // means that the user added the product to the basket by clicking on the related button.
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

export enum StoragePrefix {
  Products = 'products',
}
