import { Pipe, PipeTransform } from '@angular/core';
import { AuctionVehicle } from '../model/auctionVehicle';

@Pipe({
  name: 'sortAuctionVehicle',
  // pure: false,
})
export class SortAuctionVehiclePipe implements PipeTransform {
  transform(items: AuctionVehicle[], sortOption: string): AuctionVehicle[] {
    // console.log('Sorting triggered:', sortOption); // add this for debug

    if (!items || !sortOption) {
      // console.log(items + sortOption);
      return items;
    }

    switch (sortOption) {
      case '2': // Newest
        return items
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

      case '3': // Oldest
        return items
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

      case '4': // Price: High to Low
        return items.slice().sort((a, b) => b.basePrice - a.basePrice);

      case '5': // Price: Low to High
        return items.slice().sort((a, b) => a.basePrice - b.basePrice);

      default:
        return items;
    }
  }
}
