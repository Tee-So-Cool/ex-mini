import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(orderData: { userId: number; items: { productId: number; quantity: number; price: number }[] }) {
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, items } = orderData;
      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = queryRunner.manager.create(Order, { userId, totalPrice });
      const savedOrder = await queryRunner.manager.save(order);

      for (const item of items) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrders() {
    return this.orderRepository.find({ relations: ['items'] });
  }
}
