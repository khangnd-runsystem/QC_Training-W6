export interface ProductInfo {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price: number;
  description?: string;
}
