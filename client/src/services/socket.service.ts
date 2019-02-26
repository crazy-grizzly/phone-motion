import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private host = `${location.hostname}:3000`;
  private socket: any;

  constructor() {
  }

  init() {
    this.socket = io(this.host);
  }

  emit(event: string, value: any) {
    return this.socket.emit(event, value);
  }

  onEvent(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

}
