import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProductsController } from './product/products.controller';
import { ProductsService } from './product/products.service';

@Module({
  imports: [
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}