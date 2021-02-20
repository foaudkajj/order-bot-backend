export class NavigationItems {
    key: string;
    title: string;
    type: string;
    translate: string;
    icon: string;
    url: string;

    children?: NavigationItems[] = [];
}