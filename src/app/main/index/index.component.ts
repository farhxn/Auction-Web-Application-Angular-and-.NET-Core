import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionVehicleService } from '../service/auction-vehicle.service';
import { AuctionVehicle } from '../shared/model/auctionVehicle';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { AuctionGridItemComponent } from '../shared/auction-grid-item/auction-grid-item.component';
import { AuctionListItemComponent } from '../shared/auction-list-item/auction-list-item.component';
import { CurrencyService } from '../service/currency.service';
import { combineLatest, forkJoin, map, switchMap } from 'rxjs';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ListSkeletonComponent } from "../shared/list-skeleton/list-skeleton.component";
import { GridSkeletonComponent } from "../shared/grid-skeleton/grid-skeleton.component";

@Component({
  selector: 'app-index',
  imports: [
    RouterLink,
    AuctionGridItemComponent,
    CommonModule,
    AuctionListItemComponent,
    NgxSkeletonLoaderComponent,
    ListSkeletonComponent,
    GridSkeletonComponent
],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  list: AuctionVehicle[] = [];
  convertedList: AuctionVehicle[] = [];
  currencySymbol = '$';
  isLoading = true;
    skeletonArray = Array(6);

  constructor(
    private auction: AuctionVehicleService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    // this.auction.vehicleList().subscribe({
    //   next: (res: any) => {
    //     this.list = res.data as AuctionVehicle[];
    //     console.log(this.list);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });

    // this.currencyService.getSelectedCurrency().subscribe((currency) => {
    //   this.currencySymbol = currency.symbol;

    //   this.currencyService.getLiveRates().subscribe((res) => {
    //     const rate = res.quotes['USD' + currency.code];
    //     if (rate) {
    //       this.convertedList = this.list.map((item) => ({
    //         ...item,
    //         convertedPrice: item.basePrice * rate,
    //       }));
    //     }
    //   });
    // });

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
}
