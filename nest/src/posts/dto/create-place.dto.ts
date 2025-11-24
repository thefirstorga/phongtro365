import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  title: string;

  @IsString()
  address: string;
  @Type(() => Number)
  @IsNumber()
  latitude: number;
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @IsArray()
  addedPhotos: string[];

  @IsString()
  description: string;

  @IsArray()
  perks: string[];

  @IsString()
  extraInfo: string;

  @IsNumber()
  area: number;

  @IsNumber()
  duration: number;

  @IsNumber()
  price: number;
}
