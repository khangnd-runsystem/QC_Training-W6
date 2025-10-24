import { ProductInfo } from '../interfaces/product-info';
import { readJson } from '../utils/dataReader';

export const PRODUCTS: { [key: string]: ProductInfo } = readJson<{ [key: string]: ProductInfo }>('data/products.json');
