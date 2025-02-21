import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer } from 'kafkajs';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private configService: ConfigService) {
    const keyPath = join(
      __dirname,
      this.configService.get<string>('SSL_KEY_PATH'),
    );
    const certPath = join(
      __dirname,
      this.configService.get<string>('SSL_CERT_PATH'),
    );
    const caPath = join(
      __dirname,
      this.configService.get<string>('SSL_CA_PATH'),
    );

    if (
      !fs.existsSync(keyPath) ||
      !fs.existsSync(certPath) ||
      !fs.existsSync(caPath)
    ) {
      throw new Error(`One or more SSL files do not exist:
        SSL_KEY_PATH=${keyPath} exists: ${fs.existsSync(keyPath)},
        SSL_CERT_PATH=${certPath} exists: ${fs.existsSync(certPath)},
        SSL_CA_PATH=${caPath} exists: ${fs.existsSync(caPath)}`);
    }

    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
      ssl: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        ca: [fs.readFileSync(caPath)],
      },
    });

    this.producer = this.kafka.producer();
  }

  async connectProducer() {
    if (!this.producer) {
      this.producer = this.kafka.producer();
    }
    await this.producer.connect();
  }

  async produceMessage(message: string, topic?: string) {
    topic = topic || this.configService.get<string>('KAFKA_TOPIC');
    await this.connectProducer();
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
    console.log('Produced message:', message, 'on topic:', topic);
  }

  async getConsumer(groupId?: string, topic?: string): Promise<Consumer> {
    groupId = groupId || this.configService.get<string>('KAFKA_GROUP_ID');
    topic = topic || this.configService.get<string>('KAFKA_TOPIC');
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(
      'Subscribed on topic:',
      topic,
      ', groupId:',
      groupId,
      ', Now ready to consume messages',
    );
    return consumer;
  }
}
