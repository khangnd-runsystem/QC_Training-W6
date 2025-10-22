import { ProductInfo } from '../interfaces/product-info';

export const PRODUCTS: { [key: string]: ProductInfo } = {
  SAMSUNG_GALAXY_S6: {
    name: 'Samsung galaxy s6',
    category: 'Phones',
    price: 360
  },
  MACBOOK_PRO: {
    name: 'MacBook Pro',
    category: 'Laptops',
    price: 1100
  },
  SONY_XPERIA_Z5: {
    name: 'Sony xperia z5',
    category: 'Phones',
    price: 320
  },
  MACBOOK_AIR: {
    name: 'MacBook air',
    category: 'Laptops',
    price: 700
  },
  SONY_VAIO_I5: {
    name: 'Sony vaio i5',
    category: 'Laptops',
    price: 790
  },
  APPLE_MONITOR_24: {
    name: 'Apple monitor 24',
    category: 'Monitors',
    price: 400
  }
};
