import {BaseModel} from './base.model';

export class MovieModel extends BaseModel {
  _id: string;
  name: string;
  originalName: string;
  country: string;
  language: string;
  yearMovie: string;
  studio: string;
  director: string;
  genre: string;
  comment?: string;
  premiereDate: Date;
  actor: string;
  formatVideo: string;
  formatAudio: string;
  recomAge: number;
  regNum: string;
  fileSrc: string;
  file: File;
  canDelete?: boolean = true;
}
