/*
 * methods for calculating position layout,
 * extended by clipper-basic-component
 */
/* eslint-disable */
import { fromEvent } from 'rxjs';
import _commonMethods from './common/method';
import _basicMethods from './basic/method';
import _fixedMethods from './fixed/method';


import np from '../../namespace.js';

const basicMethods = Object.assign(_basicMethods, _commonMethods);
const fixedMethods = Object.assign(_fixedMethods, _commonMethods);

export { basicMethods };
export { fixedMethods };

/**  Listeners */
const rxEventListeners = {
  beforeCreate() {
    this.mousedown$ = fromEvent(window, 'mousedown');
    this.mousemove$ = fromEvent(window, 'mousemove');
    this.mouseup$ = fromEvent(window, 'mouseup');
    this.touchstart$ = fromEvent(window, 'touchstart', { passive: false });
    this.touchmove$ = fromEvent(window, 'touchmove', { passive: false });
    this.touchend$ = fromEvent(window, 'touchend', { passive: false });
  },
};

const rxWheelListeners = {
  beforeCreate() {
    this.wheel$ = fromEvent(window, 'wheel');
  },
};
export { rxEventListeners };
export { rxWheelListeners };
const pluginMethods = {
  methods: {
    clip() {
      const drawPos = this.getDrawPos();
      const ctx = this.canvasEl.getContext('2d');
      const width = drawPos.pos.swidth; // sw
      const height = drawPos.pos.sheight;// sh
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.translate(drawPos.translate.rotateX, drawPos.translate.rotateY);
      ctx.rotate(this.rotate * Math.PI / 180);
      ctx.translate(drawPos.translate.drawX - drawPos.translate.rotateX, drawPos.translate.drawY - drawPos.translate.rotateY);
      ctx.drawImage(this.imgEl, 0, 0);
      return this.canvasEl;
    },
    callPreview(method, ...arg) {
      const parentPropName = np.parentPropName;
      if (!this.preview) return;
      if (!this.$parent[parentPropName]) return; // "You register to use clipper-preview But No clipper-view Component detected.";
      const previews = this.$parent[parentPropName][this.preview];
      if (!previews) return; // `preview with name "${this.preview}" not found`;
      previews.forEach((p) => {
        p[method](...arg);
      });
    },
    emit(name, arg) {
      this.$emit(name, arg);
    },
  },
};

export { pluginMethods };
