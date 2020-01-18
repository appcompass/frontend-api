import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport
} from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379'
      }
    });
  }

  send<T>(pattern: string, data?: T) {
    return this.client.send<T, T>(pattern, data);
  }

  sendAsync<T>(pattern: string, data?: T) {
    return this.send<T>(pattern, data).toPromise();
  }
}
