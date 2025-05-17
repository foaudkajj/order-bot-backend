export enum CallBackQueryResult {
  StartOrdering = 'START_ORDERING',
  AddToBasketAndContinueShopping = 'ADD_TO_BASKET',
  RemoveFromBasket = 'REMOVE_FROM_BASKET',
  MyBasket = 'MY_ORDERS',
  CompleteOrder = 'COMPLETE_ORDER',
  EnterAddress = 'ENTER_ADDRESS',
  SendOrder = 'SEND_ORDER',
  ConfirmOrder = 'CONFIRM_ORDER',
  EmptyBakset = 'EMPTY_BASKET',
  MainMenu = 'MAIN_MENU',
  AddNoteToOrder = 'ADD_NOTE_TO_ORDER',
  TrackOrder = 'TRACK_ORDER',
}

export enum Messages {
  EMPTY_BASKET = 'Sepetinizde ürün yoktur.',
}
