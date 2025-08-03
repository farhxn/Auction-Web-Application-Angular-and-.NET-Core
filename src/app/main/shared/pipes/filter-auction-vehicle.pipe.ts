import { Pipe, PipeTransform } from '@angular/core';
import { AuctionVehicle } from '../model/auctionVehicle';

@Pipe({
  name: 'filterAuctionVehicle',
})
export class FilterAuctionVehiclePipe implements PipeTransform {
  transform(vehicles: AuctionVehicle[], searchTerm: string): AuctionVehicle[] {
    if (!vehicles || !searchTerm) return vehicles;
    const text = searchTerm.toLowerCase();
    return vehicles.filter((vehicle) => {
      return (
        vehicle.name.toLowerCase().includes(text) ||
        vehicle.description.toLowerCase().includes(text) ||
        vehicle.basePrice.toString().toLowerCase().includes(text) ||
        vehicle.item.toLowerCase().includes(text)
      );
    });
  }
}
