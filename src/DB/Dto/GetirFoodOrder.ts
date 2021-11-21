export interface GetirFoodOrder {
    id: string;
    status: number;
    isScheduled: boolean;
    confirmationId: string;
    client: Client;
    courier: Courier;
    products: Product[];
    clientNote: string;
    totalPrice: number;
    checkoutDate: Date;
    deliveryType: number;
    doNotKnock: boolean;
    isEcoFriendly: boolean;
    restaurant: Restaurant;
    paymentMethod: number;
    paymentMethodText: PaymentMethodText;
}

export interface Client {
    id: string;
    name: string;
    location: Location;
    clientPhoneNumber: string;
    contactPhoneNumber: string;
    deliveryAddress: DeliveryAddress;
}

export interface DeliveryAddress {
    id: string;
    address: string;
    aptNo: string;
    floor: string;
    doorNo: string;
    city: string;
    district: string;
    description: string;
}

export interface Location {
    lat: number;
    lon: number;
}

export interface Courier {
    id: string;
    status: number;
    name: string;
    location: Location;
}

export interface PaymentMethodText {
    en: string;
    tr: string;
}

export interface Product {
    id: string;
    imageURL: string;
    wideImageURL: string;
    count: number;
    product: string;
    chainProduct: string;
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

export interface DisplayInfo {
    title: PaymentMethodText;
    options: Options;
}

export interface Options {
    tr: any[];
    en: any[];
}

export interface Restaurant {
    id: string;
}