export class FoodOrderDto {
  foodOrder: FoodOrder;
}

export class FoodOrder {
  id: string;
  status: number;
  isScheduled: boolean;
  confirmationId: string;
  client: Client;
  courier: Courier;
  products: Product[];
  clientNote: string;
  doNotKnock: boolean;
  dropOffAtDoor: boolean;
  totalPrice: number;
  checkoutDate: string;
  deliveryType: number;
  isEcoFriendly: boolean;
  paymentMethod: number;
  paymentMethodText: PaymentMethodText;
  restaurant: Restaurant;
}

export class Client {
  id: string;
  name: string;
  contactPhoneNumber: string;
  clientPhoneNumber: string;
  deliveryAddress: DeliveryAddress;
  location: Location;
}

export class DeliveryAddress {
  id: string;
  address: string;
  city: string;
  district: string;
}

export class Location {
  lat: number;
  lon: number;
}

export class Courier {
  id: string;
  status: number;
  name: string;
  location: Location;
}

export class PaymentMethodText {
  en: string;
  tr: string;
}

export class Product {
  id: string;
  imageURL: string;
  wideImageURL: string;
  count: number;
  product: string;
  name: PaymentMethodText;
  price: number;
  optionPrice: number;
  priceWithOption: number;
  totalPrice: number;
  totalOptionPrice: number;
  totalPriceWithOption: number;
  optionCategories: any[];
  displayInfo: DisplayInfo;
  note: string;
}

export class DisplayInfo {
  title: PaymentMethodText;
  options: Options;
}

export class Options {
  tr: any[];
  en: any[];
}

export class Restaurant {
  id: string;
}
