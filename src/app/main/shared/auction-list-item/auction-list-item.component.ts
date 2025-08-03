import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { AuctionVehicle } from '../model/auctionVehicle';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-auction-list-item',
  imports: [RouterLink, CommonModule],
  templateUrl: './auction-list-item.component.html',
  styleUrl: './auction-list-item.component.css',
})
export class AuctionListItemComponent {
  item = input.required<AuctionVehicle>();
  imageBaseUrl = environment.imgBaseUrl;

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
