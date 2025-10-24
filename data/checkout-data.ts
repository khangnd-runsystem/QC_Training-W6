import { CheckoutInfo } from '../interfaces/checkout-info';
import { readJson } from '../utils/dataReader';

export const CHECKOUT_DATA: { [key: string]: CheckoutInfo } = readJson<{ [key: string]: CheckoutInfo }>('data/checkout-data.json');
