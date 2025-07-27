import { Component } from '@angular/core';
import { AuctionGridItemComponent } from "../shared/auction-grid-item/auction-grid-item.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auction-detail',
  imports: [AuctionGridItemComponent,RouterLink],
  templateUrl: './auction-detail.component.html',
  styleUrl: './auction-detail.component.css'
})
export class AuctionDetailComponent {

}
