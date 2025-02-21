import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: RedisClientType;

  constructor(private configService: ConfigService) {
    this.redisClient = createClient({
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      socket: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: Number(this.configService.get<string>('REDIS_PORT')),
      },
    });

    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );
  }

  async onModuleInit() {
    await this.connect();
    console.log('Redis Client Connected');
  }

  async connect() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    return this.redisClient;
  }

  async getRedisClient(): Promise<RedisClientType> {
    return this.connect();
  }

  async set(key: string, value: string) {
    const client = await this.getRedisClient();
    await client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    const client = await this.getRedisClient();
    return client.get(key);
  }
}
