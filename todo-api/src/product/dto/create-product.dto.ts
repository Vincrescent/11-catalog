import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, Max } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Nama produk harus berupa teks' })
  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong' })
  name: string;

  @IsString({ message: 'Kategori harus berupa teks' })
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;

  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh kurang dari 0' })
  price: number;

  @IsNumber({}, { message: 'Stok harus berupa angka' })
  @Min(0, { message: 'Stok tidak boleh kurang dari 0' })
  stock: number;

  @IsNumber({}, { message: 'Rating harus berupa angka' })
  @Min(0, { message: 'Rating minimal 0' })
  @Max(5, { message: 'Rating maksimal 5' })
  @IsOptional()
  rating?: number;

  @IsString({ message: 'Deskripsi harus berupa teks' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'URL Gambar harus berupa string' })
  @IsOptional()
  imageUrl?: string;
}
