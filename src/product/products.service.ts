import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createObjectCsvWriter } from 'csv-writer';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    return this.productRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async exportToCsv(products: Product[]): Promise<string> {
    const csvWriter = createObjectCsvWriter({
      path: 'products.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
      ],
    });
  
    await csvWriter.writeRecords(products);
    return 'products.csv';
  }
}
