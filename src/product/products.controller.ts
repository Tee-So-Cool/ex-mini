import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() productData: Partial<Product>) {
    return this.productsService.create(productData);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() productData: Partial<Product>) {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected-route')
  async protectedRoute() {
    return { message: 'This is a protected route for products' };
  }
}
