import { Module, DynamicModule } from '@nestjs/common';

interface DatabaseConfig {
  host: string;
  port: number;
}

@Module({})
export class DatabaseModule {
  static forRoot(config: DatabaseConfig): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_CONFIG',
          useValue: config,
        },
      ],
      exports: ['DATABASE_CONFIG'],
    };
  }
}
