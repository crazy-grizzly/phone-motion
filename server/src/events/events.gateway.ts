import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {

  @WebSocketServer() server;

  @SubscribeMessage('phoneMessages')
  handleMessage(client: any, payload: any): void {
    this.server.emit('phoneMessages', payload);
  }

}
