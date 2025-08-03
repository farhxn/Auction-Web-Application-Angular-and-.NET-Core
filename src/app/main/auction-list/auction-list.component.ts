import { AfterViewInit, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuctionGridItemComponent } from '../shared/auction-grid-item/auction-grid-item.component';
import { AuctionListItemComponent } from '../shared/auction-list-item/auction-list-item.component';
import { AuctionVehicle } from '../shared/model/auctionVehicle';
import { AuctionVehicleService } from '../service/auction-vehicle.service';
import { FilterAuctionVehiclePipe } from '../shared/pipes/filter-auction-vehicle.pipe';
import { FormsModule } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { CurrencyService } from '../service/currency.service';
import { GridSkeletonComponent } from '../shared/grid-skeleton/grid-skeleton.component';
import { CommonModule } from '@angular/common';
import { SortAuctionVehiclePipe } from '../shared/pipes/sort-auction-vehicle.pipe';
import SlimSelect from 'slim-select';
import 'slim-select/styles'; // optional css import method

@Component({
  selector: 'app-auction-list',
  imports: [
    RouterLink,
    AuctionGridItemComponent,
    AuctionListItemComponent,
    FilterAuctionVehiclePipe,
    CommonModule,
    FormsModule,
    GridSkeletonComponent,
    SortAuctionVehiclePipe,
  ],
  templateUrl: './auction-list.component.html',
  styles: [
    'src/assets/vendor/slim-select/slimselect.css',
    'node_modules/slim-select/dist/slimselect.css',
    'src/styles.css',
  ],
})
export class AuctionListComponent implements OnInit,AfterViewInit {
  searchTerm = signal('');
  selectedSortOption: string = ''; // no function

  list: AuctionVehicle[] = [];
  convertedList: AuctionVehicle[] = [];
  currencySymbol = '$';
  isLoading = true;

  constructor(
    private auction: AuctionVehicleService,
    private currencyService: CurrencyService,
    private cdr: ChangeDetectorRef
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

    this.auction.vehicleList().subscribe({
      next: (res: any) => {
        this.list = res.data as AuctionVehicle[];

        this.currencyService
          .getSelectedCurrency()
          .pipe(
            switchMap((currency) => {
              this.currencySymbol = currency.symbol;
              return this.currencyService.getLiveRates().pipe(
                map((res) => {
                  const rate = res.conversion_rates[currency.code]; // ✅ Correct

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

  ngAfterViewInit(): void {
    const selectEl = document.querySelector(
      '#ul-inner-auctions-sort'
    ) as HTMLSelectElement;

    if (selectEl) {
      new SlimSelect({
        select: selectEl,
        settings: {
          showSearch: false,

        },
      });

      // 🔁 Listen to change event to sync with Angular
      selectEl.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        this.selectedSortOption = target.value;

        // ✅ Trigger Angular change detection manually
        this.cdr.detectChanges();
      });
    }
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSortOption = target.value;
  }
}
