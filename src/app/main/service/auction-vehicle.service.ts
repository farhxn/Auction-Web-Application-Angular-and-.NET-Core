import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'jquery';
import { environment } from '../../../environments/environment.development';
import { AuctionVehicleAddEditDto } from '../shared/model/auctionVehicle';

@Injectable({
  providedIn: 'root',
})
export class AuctionVehicleService {
  private baseurl = environment.baseUrl + 'AuctionVehicle/';
  constructor(private http: HttpClient) {}

  vehicleList() {
    return this.http.get(this.baseurl + 'getVechileList');
  }

  vehicleDetail(id: string) {
    return this.http.get(this.baseurl + 'getVechileDetial/' + id);
  }

  addAuctionVehicle(data: AuctionVehicleAddEditDto) {
    const fromData = this.buildFormData(data);
    return this.http.post(this.baseurl + 'AddAuctionVechile', fromData);
  }

  private buildFormData(product: AuctionVehicleAddEditDto): FormData {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description);
    formData.append('DateEnd', product.dateEnd);
    formData.append('Item', '1234554');
    formData.append('BasePrice', product.basePrice.toString());
    if (product.ImageFile) {
      formData.append('ImageFile', product.ImageFile);
    }
    return formData;
  }
}
