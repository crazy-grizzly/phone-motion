import { Component, OnDestroy, OnInit } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SocketService } from '../../services/socket.service';
import { DeviceOrientationData } from '../../interfaces/device-orientation-data.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private destroyedSubject = new Subject<void>();

  data: DeviceOrientationData;

  constructor(
    private ss: SocketService,
    private dds: DeviceDetectorService
  ) {
    this.ss.init();

    this.ss
      .onEvent('connect')
      .pipe(takeUntil(this.destroyedSubject))
      .subscribe(() => {
        console.log('Connected');
      });

    this.ss
      .onEvent('disconnect')
      .pipe(takeUntil(this.destroyedSubject))
      .subscribe(() => {
        console.log('Disconnected');
      });
  }

  ngOnInit(): void {
    if (this.dds.isMobile() || this.dds.isTablet()) {
      window.addEventListener(
        'deviceorientation',
        event => {
          console.log('event', event);

          const data: DeviceOrientationData = {
            alpha: event.alpha,
              beta: event.beta,
            gamma: event.gamma,
          };

          this.ss.emit(
            'phoneMessage',
            data
          );

          this.data = data;
        }
      );
    }

    if (this.dds.isDesktop()) {
      this.ss
        .onEvent('phoneMessage')
        .pipe(takeUntil(this.destroyedSubject))
        .subscribe(event => {
          console.log('event', event);
          this.data = event;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyedSubject.next();
    this.destroyedSubject.complete();
  }

}
