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
  minPriceTicket: number;
}
