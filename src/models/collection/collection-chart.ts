import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CollectionChartModel {
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  limit: number;

  @IsOptional()
  getBy: string;
}
