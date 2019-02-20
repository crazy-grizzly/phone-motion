import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {

  @WebSocketServer() server;

  @SubscribeMessage('phoneMessage')
  handleMessage(client: any, payload: any): void {
    this.server.emit('phoneMessage', payload);
  }

}
