import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'jquery';
import { environment } from '../../../environments/environment.development';
import { AuctionVehicleAddEditDto } from '../shared/model/auctionVehicle';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionVehicleService {
  private baseurl = environment.baseUrl + 'AuctionVehicle/';
  constructor(private http: HttpClient) {}
  private vehicleCache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 5 * 60 * 1000;

  vehicleList(page: number = 1, pageSize: number = 6): Observable<any> {
    const cacheKey = `page=${page}&pageSize=${pageSize}`;
    const cached = this.vehicleCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTTL) {
      return of(cached.data);
    }

    return this.http
      .get(`${this.baseurl}GetVehicleList?page=${page}&pageSize=${pageSize}`)
      .pipe(
        tap((data) => this.vehicleCache.set(cacheKey, { data, timestamp: now }))
      );
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
    // if (product.ImageFile) {
    //   formData.append('ImageFile', product.ImageFile);
    // }
    if (product.ImageFiles && product.ImageFiles.length > 0) {
      for (const file of product.ImageFiles) {
        formData.append('ImageFiles', file); 
      }
    }

    return formData;
  }
}
