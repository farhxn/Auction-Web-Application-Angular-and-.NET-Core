export interface AuctionVehicle {
  id: number;
  itemId: string;
  name: string;
  description: string;
  basePrice: number;
  dateEnd: string;
  item: string;
  images:  string ;
  bitCount: number;
  currencySymbol?: string;
  createdAt: string;
}

export interface AuctionVehicleDetail {
  id: number;
  itemId: string;
  name: string;
  description: string;
  basePrice: number;
  dateEnd: string;
  item: string;
  images:  string[] ;
  bitCount: number;
  currencySymbol?: string;
  createdAt: string;
}

export class AuctionVehicle implements AuctionVehicle {
  constructor(
    public id: number,
    public itemId: string,
    public name: string,
    public description: string,
    public basePrice: number,
    public dateEnd: string,
    public item: string,
    public images: string,
    public bitCount: number,
    public createdAt: string,
    public currencySymbol?: string
  ) {}
}


export class AuctionVehicleDetail implements AuctionVehicleDetail{
  constructor(
    public id: number,
    public itemId: string,
    public name: string,
    public description: string,
    public basePrice: number,
    public dateEnd: string,
    public item: string,
    public images: string[],
    public bitCount: number,
    public createdAt: string,
    public currencySymbol?: string,
  ) {}
}


export interface AuctionVehicleAddEditDto {
  id: number;
  name: string;
  description: string;
  dateEnd: string;
  item: string;
  basePrice: number;
  // ImageFile? : File;
  ImageFiles?: File[];
}
