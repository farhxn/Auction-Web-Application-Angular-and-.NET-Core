import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionVehicle } from '../model/auctionVehicle';
import { environment } from '../../../../environments/environment.development';
import { CurrencyService } from '../../service/currency.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auction-grid-item',
  imports: [RouterLink, CommonModule],
  templateUrl: './auction-grid-item.component.html',
  styleUrl: './auction-grid-item.component.css',
})
export class AuctionGridItemComponent implements OnInit {
  basePrice = 100;
  convertedPrice: number | null = null;
  currencySymbol = '$';

  constructor(
    private currencyService: CurrencyService,
    private http: HttpClient
  ) {}

  item = input.required<AuctionVehicle>();
  imageBaseUrl = environment.imgBaseUrl;

  ngOnInit(): void {

    // this.currencyService.getSelectedCurrency().subscribe((currency) => {
    //   this.currencySymbol = currency.symbol;
    //   this.convertPrice(currency.code);
    // });
  }

  getTimeRemaining(endDate: string | Date) {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const distance = end - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }
}
