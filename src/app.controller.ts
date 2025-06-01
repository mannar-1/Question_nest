import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('get-questions')
  getQuestions(data: any) {
    return ['What is NestJS?', 'What is a Microservice?'];
  }
}
