import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  image: string;

  @IsBoolean()
  sold: boolean;

  @IsString()
  dateOfSale: string;
}
