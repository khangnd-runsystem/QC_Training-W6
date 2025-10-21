import { CheckoutInfo } from '../interfaces/checkout-info';

export const CHECKOUT_DATA: { [key: string]: CheckoutInfo } = {
  JOHN_DOE: {
    name: 'John Doe',
    country: 'USA',
    city: 'New York',
    creditCard: '4111111111111111',
    month: '12',
    year: '2025'
  },
  ANNA_VN: {
    name: 'Anna',
    country: 'VN',
    city: 'HCM',
    creditCard: '12345678',
    month: '01',
    year: '2026'
  }
};
