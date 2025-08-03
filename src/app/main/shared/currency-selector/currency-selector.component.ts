import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../service/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.css'],
  imports: [CommonModule],
})
// export class CurrencySelectorComponent implements OnInit {
//   currencies: any[] = [];
//   selectedCurrency: any;
//   dropdownOpen = false;


//   constructor(private currencyService: CurrencyService) {}

//   ngOnInit(): void {
//     this.currencies = this.currencyService.getCurrencies();
//     this.currencyService.getSelectedCurrency().subscribe((currency) => {
//       this.selectedCurrency = currency;
//     });

//     this.currencyService.loadStoredCurrency();

//     console.log('Available currencies:', this.currencies);

//   }

//   onCurrencyChange(event:Event)
//   {
//     const code = (event.target as HTMLSelectElement).value;
//     const selected = this.currencies.find((c) => c.code === code);
//     console.log(selected);
//     this.selectedCurrency = selected;
//     this.dropdownOpen = false;
//     if (selected) {
//       this.currencyService.setCurrency(selected);
//     }
//   }

//   toggleDropdown() {
//   this.dropdownOpen = !this.dropdownOpen;
// }

// closeDropdown() {
//   this.dropdownOpen = false;
// }

// // selectCurrency(currency: Currency) {
// //   this.selectedCurrency = currency;
// //   this.dropdownOpen = false;
// // }

// }

export class CurrencySelectorComponent implements OnInit {
  currencies: any[] = [];
  selectedCurrency: any;
  dropdownOpen = false;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencies = this.currencyService.getCurrencies();

    this.currencyService.getSelectedCurrency().subscribe((currency) => {
      this.selectedCurrency = currency;
    });

    this.currencyService.loadStoredCurrency();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  onCurrencyChange(currency: any) {
    this.selectedCurrency = currency;
    this.dropdownOpen = false;
    this.currencyService.setCurrency(currency);
  }
}
// The above code is a component for selecting currencies in an Angular application.
