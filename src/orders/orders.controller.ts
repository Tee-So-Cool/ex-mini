import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() orderData: { userId: number; items: { productId: number; quantity: number; price: number }[] }) {
    return this.ordersService.createOrder(orderData);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAllOrders();
  }
}
