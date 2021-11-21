export enum OrderStatus {
    New = 0,
    UserConfirmed = 1,
    MerchantConfirmed = 2,
    Preparing = 3,
    OrderSent = 4,
    Delivered = 5,
    Canceled = 6
}

export enum ProductStatus {
    Selected = 'SELECTED',
    InBasket = 'INBASKET',
}