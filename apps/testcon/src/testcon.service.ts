import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { KafkaService, RedisService } from '@app/common';

@Injectable()
export class TestConService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    const groupId = this.configService.get<string>('KAFKA_GROUP_ID');
    const topic = this.configService.get<string>('KAFKA_TOPIC');
    await this.kafkaService.produceMessage('Hello there', topic);

    await this.redisService.set('testKey', 'testValue');
    const myredisval = await this.redisService.get('testKey');
    console.log('Redis value:', myredisval);

    const consumer = await this.kafkaService.getConsumer(groupId, topic);
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Got message using SSL:', message.value.toString());
      },
    });
  }
}
