import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { PhoneMotionScene } from './three/phone-motion-scene';
import { PhoneMotionData } from '../interfaces/phone-motion-data.interface';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private destroyedSubject = new Subject<void>();

  data: PhoneMotionData;

  isMobile: boolean;

  constructor(
    private ss: SocketService,
    private dds: DeviceDetectorService,
    private cdr: ChangeDetectorRef,
    private scene: PhoneMotionScene
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
      this.isMobile = true;

      fromEvent(window, 'deviceorientation')
        .pipe(
          withLatestFrom(
            merge(
              of(null),
              fromEvent(window, 'orientationchange')
            )
          ),
          takeUntil(this.destroyedSubject)
        )
        .subscribe( (events: [DeviceOrientationEvent, Event]) => {
          const [
            deviceOrientationEvent,
            orientationChangeEvent
          ] = events;

          const data: PhoneMotionData = {
            alpha: deviceOrientationEvent.alpha,
            beta: deviceOrientationEvent.beta,
            gamma: deviceOrientationEvent.gamma,
            orientationAngle: (window.screen.orientation && window.screen.orientation.angle) || 0,
          };

          this.ss.emit(
            'phoneMessages',
            data
          );

          this.data = data;
          this.cdr.markForCheck();
        });
    }

    if (this.dds.isDesktop()) {
      this.isMobile = false;

      this.scene.init();

      this.ss
        .onEvent('phoneMessages')
        .pipe(takeUntil(this.destroyedSubject))
        .subscribe((data: PhoneMotionData) => {
          this.data = data;

          this.scene.rotatePhone(data);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyedSubject.next();
    this.destroyedSubject.complete();
  }

}
