import { IsNumberString } from "class-validator";

export class findOneParams{
  @IsNumberString()
  id:string
}