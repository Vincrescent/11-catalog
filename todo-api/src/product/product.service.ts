import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Electronics',
      price: 4999000,
      stock: 15,
      rating: 4.9,
      description: 'Headphone peredam bising aktif terbaik dengan kualitas audio resolusi tinggi dan daya tahan baterai 30 jam.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      createdAt: '2026-07-20T08:00:00.000Z',
      updatedAt: '2026-07-20T08:00:00.000Z',
    },
    {
      id: 2,
      name: 'Smartwatch Pro GPS Tactical',
      category: 'Gadgets',
      price: 2750000,
      stock: 8,
      rating: 4.7,
      description: 'Jam tangan pintar outdoor dengan monitor detak jantung, pemeta SpO2, GPS dual-band, dan ketahanan air 50M.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      createdAt: '2026-07-21T09:15:00.000Z',
      updatedAt: '2026-07-21T09:15:00.000Z',
    },
    {
      id: 3,
      name: 'Minimalist Mechanical Keyboard RGB',
      category: 'Electronics',
      price: 1290000,
      stock: 0,
      rating: 4.8,
      description: 'Keyboard mekanikal wireless 75% dengan Gateron Yellow Switches, hot-swappable PCB, dan RGB backlight.',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      isAvailable: false,
      createdAt: '2026-07-22T10:30:00.000Z',
      updatedAt: '2026-07-23T11:00:00.000Z',
    },
    {
      id: 4,
      name: 'Nordic Ceramic Coffee Set & Kettle',
      category: 'Home',
      price: 649000,
      stock: 24,
      rating: 4.6,
      description: 'Set teko & cangkir keramik gaya skandinavia dengan lapisan matte glaze tahan panas dan desain elegan.',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      createdAt: '2026-07-22T14:20:00.000Z',
      updatedAt: '2026-07-22T14:20:00.000Z',
    },
    {
      id: 5,
      name: 'Urban Canvas Travel Backpack 25L',
      category: 'Fashion',
      price: 890000,
      stock: 12,
      rating: 4.8,
      description: 'Ransel kasual tahan air dengan kompartemen laptop 15.6 inci, saku tersembunyi, dan tali ergonomis.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      createdAt: '2026-07-23T07:10:00.000Z',
      updatedAt: '2026-07-23T07:10:00.000Z',
    },
    {
      id: 6,
      name: 'Ultra Slim Wireless Ergonomic Mouse',
      category: 'Gadgets',
      price: 450000,
      stock: 5,
      rating: 4.5,
      description: 'Mouse nirkabel dual-mode Bluetooth + 2.4GHz dengan tombol silent click dan pengisian daya USB-C.',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      createdAt: '2026-07-23T08:00:00.000Z',
      updatedAt: '2026-07-23T08:00:00.000Z',
    },
  ];

  private nextId = 7;

  findAll(category?: string, availableOnly?: boolean, search?: string): Product[] {
    let result = [...this.products];

    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (availableOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: this.nextId++,
      name: createProductDto.name,
      category: createProductDto.category,
      price: Number(createProductDto.price),
      stock: Number(createProductDto.stock),
      rating: createProductDto.rating !== undefined ? Number(createProductDto.rating) : 5.0,
      description: createProductDto.description || '',
      imageUrl:
        createProductDto.imageUrl ||
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      isAvailable: Number(createProductDto.stock) > 0,
      createdAt: now,
      updatedAt: now,
    };

    this.products.unshift(newProduct);
    return newProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }

    const existingProduct = this.products[productIndex];
    const updatedStock =
      updateProductDto.stock !== undefined
        ? Number(updateProductDto.stock)
        : existingProduct.stock;

    const updatedProduct: Product = {
      ...existingProduct,
      ...updateProductDto,
      price:
        updateProductDto.price !== undefined
          ? Number(updateProductDto.price)
          : existingProduct.price,
      stock: updatedStock,
      rating:
        updateProductDto.rating !== undefined
          ? Number(updateProductDto.rating)
          : existingProduct.rating,
      isAvailable: updatedStock > 0,
      updatedAt: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number): { message: string; id: number } {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produk dengan ID #${id} tidak ditemukan`);
    }

    this.products.splice(productIndex, 1);
    return {
      message: `Produk #${id} berhasil dihapus dari katalog`,
      id,
    };
  }
}
