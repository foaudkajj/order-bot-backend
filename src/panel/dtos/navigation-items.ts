export class NavigationItem {
  key: string;
  title: string;
  type: string;
  translate: string;
  icon: string;
  url: string;
  priority: number;
  role: string;

  children?: NavigationItem[] = [];
}
