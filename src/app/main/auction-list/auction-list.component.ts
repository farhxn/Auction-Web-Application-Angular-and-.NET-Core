import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuctionGridItemComponent } from '../shared/auction-grid-item/auction-grid-item.component';
import { AuctionListItemComponent } from '../shared/auction-list-item/auction-list-item.component';

@Component({
  selector: 'app-auction-list',
  imports: [RouterLink, AuctionGridItemComponent, AuctionListItemComponent],
  templateUrl: './auction-list.component.html',
  styles: [
    'src/assets/vendor/slim-select/slimselect.css',
    'node_modules/slim-select/dist/slimselect.css',
    'src/styles.css',
  ],
})
export class AuctionListComponent {
  constructor(private route: ActivatedRoute) {}


}
