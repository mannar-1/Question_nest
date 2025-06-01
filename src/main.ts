import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  // Create HTTP app for dummy port
  const app = await NestFactory.create(AppModule);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.send('Question service is alive');
  });

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`HTTP server running on port ${PORT}`);

  // RabbitMQ microservice logic
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'question_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  console.log('RabbitMQ microservice is listening...');
}

bootstrap();
