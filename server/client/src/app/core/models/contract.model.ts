export class ContractModel {
  _id: string;
  movieId: string;
  firstSide: string;
  secondSide: string;
  condition: number;
  tax?: number;
  condPercent: boolean;
  contNum: string;
  contDate: Date;
  fromDate: Date;
  toDate: Date;
  typeOfCont: number;
  parentId?: string;
  imageSrc?: string;
  movieUser?: string;
  // theater prices
  dayChildPriceTh?: number;
  dayAdultPriceTh?: number;
  eveningChildPriceTh?: number;
  eveningAdultPriceTh?: number;
  // org group prices
  dayChildPriceGr?: number;
  dayAdultPriceGr?: number;
  eveningChildPriceGr?: number;
  eveningAdultPriceGr?: number;
  // mobile theaters prices
  dayChildPriceMobile?: number;
  dayAdultPriceMobile?: number;
  eveningChildPriceMobile?: number;
  eveningAdultPriceMobile?: number;
}
