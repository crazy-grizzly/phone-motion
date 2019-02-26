import { InjectionToken, ValueProvider } from '@angular/core';

import * as THREE from 'three';

declare global {
  interface Window {
    THREE: typeof THREE;
  }
}

const ThreeToken: InjectionToken<typeof THREE> = new InjectionToken<typeof THREE>('THREE');
const ThreeProvider: ValueProvider = {
  provide: ThreeToken,
  useValue: window.THREE
};

export { ThreeToken, ThreeProvider };
