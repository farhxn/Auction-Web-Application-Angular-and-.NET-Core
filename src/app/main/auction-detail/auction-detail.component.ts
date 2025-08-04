import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuctionGridItemComponent } from '../shared/auction-grid-item/auction-grid-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AuctionVehicle,
  AuctionVehicleDetail,
} from '../shared/model/auctionVehicle';
import { AuctionVehicleService } from '../service/auction-vehicle.service';
import { environment } from '../../../environments/environment.development';
import { CurrencyService } from '../service/currency.service';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';

let mainSwiper: Swiper;
let thumbSwiper: Swiper;

@Component({
  selector: 'app-auction-detail',
  imports: [AuctionGridItemComponent, RouterLink, CommonModule],
  templateUrl: './auction-detail.component.html',
  styleUrl: './auction-detail.component.css',
})
export class AuctionDetailComponent implements OnInit {
  list: AuctionVehicle[] = [];
  AuctionDetail?: AuctionVehicleDetail;
  id = '0';
  imageBaseUrl = environment.imgBaseUrl;
  convertedList: AuctionVehicle[] = [];
  currencySymbol = '$';
  isLoading = true;

  countdown = {
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  };

  constructor(
    private auction: AuctionVehicleService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    // console.log(this.id);

    // this.auction.vehicleDetail(this.id).subscribe({
    //   next: (res: any) => {
    //     this.AuctionDetail = res.data as AuctionVehicle;

    //     this.currencyService
    //       .getSelectedCurrency()
    //       .pipe(
    //         switchMap((currency) => {
    //           this.currencySymbol = currency.symbol;
    //           return this.currencyService.getLiveRates().pipe(
    //             map((res) => {
    //               const rate = res.quotes['USD' + currency.code];
    //               if (rate) {
    //                 this.convertedList = this.list.map((item) => ({
    //                   ...item,
    //                   basePrice: item.basePrice * rate,
    //                   currencySymbol: currency.symbol,
    //                 }));
    //               }
    //             })
    //           );
    //         })
    //       )
    //       .subscribe();
    //     console.log(this.AuctionDetail);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });

    this.auction.vehicleDetail(this.id).subscribe({
      next: (res: any) => {
        this.AuctionDetail = res.data as AuctionVehicleDetail;
        if (typeof this.AuctionDetail.images === 'string') {
          try {
            this.AuctionDetail.images = JSON.parse(this.AuctionDetail.images);
          } catch {
            this.AuctionDetail.images = [];
          }
        }
        console.log(this.AuctionDetail);

        this.currencyService
          .getSelectedCurrency()
          .pipe(
            switchMap((currency) => {
              this.currencySymbol = currency.symbol;
              return this.currencyService.getLiveRates().pipe(
                map((res) => {
                  const rate = res.conversion_rates[currency.code];
                  if (rate && this.AuctionDetail?.basePrice) {
                    this.AuctionDetail = {
                      ...this.AuctionDetail,
                      basePrice: this.AuctionDetail.basePrice * rate,
                      currencySymbol: currency.symbol,
                    };
                  }
                })
              );
            })
          )
          .subscribe();
        this.calculateCountdown();

        // console.log(this.AuctionDetail);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.auction.vehicleList().subscribe({
      next: (res: any) => {
        this.list = res.data.vehicles as AuctionVehicle[];

        this.currencyService
          .getSelectedCurrency()
          .pipe(
            switchMap((currency) => {
              this.currencySymbol = currency.symbol;
              return this.currencyService.getLiveRates().pipe(
                map((res) => {
                  const rate = res.conversion_rates[currency.code];

                  if (rate) {
                    // console.log(rate);
                    this.convertedList = this.list.map((item) => ({
                      ...item,
                      basePrice: item.basePrice * rate,
                      currencySymbol: currency.symbol,
                    }));
                  }
                })
              );
            })
          )
          .subscribe();

        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  calculateCountdown() {
    console.log(this.AuctionDetail!.dateEnd);

    const now = new Date().getTime();
    const end = new Date(this.AuctionDetail!.dateEnd ?? now).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.countdown = {
      days: days.toString(),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  }

  get isAuctionActive(): boolean {
    const now = new Date();
    const end = new Date(this.AuctionDetail?.dateEnd ?? now);
    return end > now;
  }

  shareTo(platform: string) {
    const pageUrl = window.location.href;
    const message = `Check out this auction item!\n${pageUrl}`; // ← newline before link
    const encodedMessage = encodeURIComponent(message);
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          pageUrl
        )}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
        break;
    }

    window.open(url, '_blank');
  }



}
