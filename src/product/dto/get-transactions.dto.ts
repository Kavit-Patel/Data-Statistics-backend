import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetTransactionsDto {
  @IsString()
  @IsIn([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ])
  month: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  perPage?: number;
}
