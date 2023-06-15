import { IUser } from "./User";

export interface IFlashcard {
  _id?: string;
  flipped?: boolean;
  englishText: string;
  turkishText: string;
  author?: IUser;
}
