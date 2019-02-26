import { Inject, Injectable } from '@angular/core';

import * as THREE from 'three';
import * as Stats from 'three/examples/js/libs/stats.min';

import { ThreeToken } from '../lib.providers';
import { PhoneMotionData } from '../../interfaces/phone-motion-data.interface';

@Injectable()
export class PhoneMotionScene {

  private renderer: THREE.Renderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private stats: any;

  private phone: THREE.Object3D;

  constructor(
    @Inject(ThreeToken) private three: typeof THREE
  ) {
  }

  init(): void {
    this.scene = new this.three.Scene();
    this.scene.background = new this.three.Color(0xccbeb0);

    this.camera = new this.three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.camera.position.set(0, 0, 0);
    this.camera.position.set(
      0,
      0,
      21
    );

    this.renderer = new this.three.WebGLRenderer(
      {
        antialias: true,
        alpha: true
      }
    );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const loader = new this.three.ColladaLoader();
    loader.load(
      '/assets/model/p20pro.dae',
      model => {
        this.phone = this.scene.add(model.scene);
        this.phone.scale.addScalar(10);
      }
    );

    const ambientLight = new this.three.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new this.three.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    this.scene.add(directionalLight);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  private setObjectQuaternion(quaternion, alpha, beta, gamma, orient): void {
    const zee = new this.three.Vector3(0, 0, 1);
    const euler = new this.three.Euler();
    const q0 = new this.three.Quaternion();
    const q1 = new this.three.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
    quaternion.setFromEuler(euler); // orient the device
    quaternion.multiply(q1); // camera looks out the back of the device, not the top
    quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    this.stats.begin();
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }


  rotatePhone(data: PhoneMotionData): void {
    if (!this.phone) {
      return;
    }

    const alpha = data.alpha ? this.three.Math.degToRad(data.alpha) : 0; // Z
    const beta = data.beta ? this.three.Math.degToRad(data.beta) : 0; // X'
    const gamma = data.gamma ? this.three.Math.degToRad(data.gamma) : 0; // Y''
    const orient = data.orientationAngle ? this.three.Math.degToRad(data.orientationAngle) : 0; // O

    this.setObjectQuaternion(this.phone.quaternion, alpha, beta, gamma, orient);
  }

}
