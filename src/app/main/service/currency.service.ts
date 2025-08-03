import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  rate?: number; // optional, in case you add exchange rates
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor() {}

  http = inject(HttpClient);
  private baseUrl = environment.baseUrl + 'Currency/';

private currencyList: Currency[] = [
  // Western Countries
  { code: 'USD', symbol: '$', flag: 'US', name: 'US Dollar' },
  { code: 'CAD', symbol: '$', flag: 'CA', name: 'Canadian Dollar' },
  { code: 'GBP', symbol: '£', flag: 'GB', name: 'British Pound' },
  { code: 'CHF', symbol: 'Fr', flag: 'CH', name: 'Swiss Franc' },
  { code: 'AUD', symbol: '$', flag: 'AU', name: 'Australian Dollar' },
  { code: 'NZD', symbol: '$', flag: 'NZ', name: 'New Zealand Dollar' },
  { code: 'SEK', symbol: 'kr', flag: 'SE', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', flag: 'NO', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', flag: 'DK', name: 'Danish Krone' },

  // South Asia
  { code: 'INR', symbol: '₹', flag: 'IN', name: 'Indian Rupee' },
  { code: 'PKR', symbol: '₨', flag: 'PK', name: 'Pakistani Rupee' },
  { code: 'BDT', symbol: '৳', flag: 'BD', name: 'Bangladeshi Taka' },
  { code: 'LKR', symbol: 'Rs', flag: 'LK', name: 'Sri Lankan Rupee' },
  { code: 'NPR', symbol: '₨', flag: 'NP', name: 'Nepalese Rupee' },

  // Gulf Countries
  { code: 'AED', symbol: 'د.إ', flag: 'AE', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', flag: 'SA', name: 'Saudi Riyal' },
  { code: 'QAR', symbol: 'ر.ق', flag: 'QA', name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'د.ك', flag: 'KW', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: 'ب.د', flag: 'BH', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: 'ر.ع.', flag: 'OM', name: 'Omani Rial' }
];


  private selectedCurrency$ = new BehaviorSubject<Currency>(
    this.currencyList[0]
  );

  getCurrencies() {
    return this.currencyList;
  }

  getSelectedCurrency() {
    return this.selectedCurrency$.asObservable();
  }

  setCurrency(currency: Currency) {
    console.log('service' + currency);

    this.selectedCurrency$.next(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  }

  loadStoredCurrency() {
    const stored = localStorage.getItem('selectedCurrency');
    if (stored) {
      this.selectedCurrency$.next(JSON.parse(stored));
    }
  }

  getLiveRates() {
    return this.http.get<any>(`${this.baseUrl}GetRates/rates`);
  }
}
