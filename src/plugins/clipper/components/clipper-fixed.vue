/* eslint-disable */
<template>
    <div class='clipper-fixed'>
        <div class='wrap' :style='wrapStyle'>
          <canvas class='stem-outer' :width='stemArea.width' :height='stemArea.height'></canvas>
          <div class="img-center">
            <canvas class="stem-bg"></canvas>
            <div class='img-scale' :style='scaleStyle'>
            <div class='img-translate' :style='translateStyle'>
              <img :src='src' class='img' @load="imgLoaded(); emit('load',$event)" @error="emit('error',$event)" :style='bgStyle'>
            </div>
          </div>
          </div>
          <div class='cover'>
            <div class='area' :style='areaStyle'>
              <canvas class='stem-area' :width='stemArea.width' :height='stemArea.height' :style="stemStyle"></canvas>
              <div v-if="grid" class="grid">
                  <div v-for="index in 4" :key="'gridItem'+index" class="grid-item"></div>
                </div>
            </div>
          </div>
        </div>
      <canvas class='hidden-canvas'></canvas>
    </div>
</template>

<script>
/* eslint-disable */
  import {
    tap,
    map,
    filter,
    startWith,
    concatMap,
    merge,
    scan,
    takeUntil,
  } from 'rxjs/operators';
  import { Subject } from 'rxjs';
  import {
    fixedMethods,
    rxEventListeners,
    rxWheelListeners,
    pluginMethods,
  } from './extends/clippo';

  export default {
    name: 'clipper-fixed',
    extends: {
      methods: fixedMethods,
      mixins: [rxEventListeners, rxWheelListeners, pluginMethods],
    },
    subscriptions() {
      this.setWH$ = new Subject();
      this.setTL$ = new Subject();
      this.onchange$ = new Subject();
      /** basic */
      this.mousedownDrag$ = this.mousedown$.pipe(
        filter(this.isDragElement),
        map(this.prevent),
        map(this.dragDownPos),
        concatMap(
          () => this.mousemove$.pipe(map(this.prevent), takeUntil(this.mouseup$)),
          (down, move) => ({ down, move }),
        ),
        tap(this.changed),
      );
      this.touchdownDrag$ = this.touchstart$.pipe(
        filter(this.isDragElement),
        map(this.prevent),
        filter(e => e.touches.length === 1),
        map(e => e.touches[0]),
        map(this.dragDownPos),
        concatMap(
          () => this.touchmove$.pipe(
            takeUntil(this.touchend$),
            filter(e => e.touches.length === 1),
          ),
          (down, move) => ({ down, move: move.touches[0] }),
        ),
        tap(this.changed),
      );
      this.wheelEvent$ = this.wheel$.pipe(
        filter(this.isDragElement),
        map(this.prevent),
        map(e => e.deltaY),
        map(deltaY => (deltaY >= 0 ? -1 : 1)),
        tap(this.changed),
      );
      this.touchTwoFinger$ = this.touchstart$.pipe(
        filter(this.isDragElement),
        filter(e => e.touches.length === 2),
        map(this.prevent),
        map(this.towPointsTouches),
        map(this.setOrigin),
        concatMap(
          () => this.touchmove$.pipe(
            takeUntil(this.touchend$),
            filter(e => e.touches.length === 2),
            map(this.towPointsTouches),
          ),
          ({ down, origin }, move) => ({ down, move, origin }),
        ),
        map(this.twoPointsDelta),
        tap(this.changed),
      );
      /** Zoom Subject */
      this.wheelZoom$ = new Subject().pipe(
        startWith(1),
        merge(this.wheelEvent$),
        scan((origin, delta) => {
          const rate = this.zoomRate * Math.max(origin, 0.8) * delta;
          return Math.max(origin + rate, this.minScale);
        }),
        tap(this.changed),
      );
      this.touchZoom$ = new Subject().pipe(
        startWith(1),
        merge(this.touchTwoFinger$),
        scan((origin, delta) => {
          const rate = Math.max(origin, 0.8) * delta;
          return Math.max(origin + rate, this.minScale);
        }),
        tap(this.changed),
      );
      this.zoomSubject$ = new Subject().pipe(
        merge(this.setWH$),
        merge(this.wheelZoom$),
        merge(this.touchZoom$),
      );
      /** Drag Subject */
      this.dragSubject$ = new Subject().pipe(
        startWith({ left: 0, top: 0 }),
        merge(this.setTL$),
        merge(
          this.mousedownDrag$.pipe(
            merge(this.touchdownDrag$),
            map(this.delta),
            map(this.toPercentage),
          // map(this.validateTL)
          ),
        ),
      );
      return {
        bgWH$: this.zoomSubject$,
        bgTL$: this.dragSubject$,
      };
    },
    data: () => ({
      imgRatio: NaN,
      blobLength: 0,
      callbackLauncher: 0,
    }),
    props: {
      src: {
        type: String,
      },
      rotate: {
        type: Number,
        default: 0,
      },
      ratio: {
        type: Number,
        default: 1,
      },
      zoomRate: {
        type: Number,
        default: 0.04,
      },
      minScale: {
        type: Number,
        default: 0.1,
      },
      bgColor: {
        type: String,
        default: 'white',
      },
      border: {
        type: Number,
        default: 1,
      },
      grid: {
        type: Boolean,
        default: true,
      },
      shadow: {
        type: String,
        default: 'rgba(0, 0, 0, 0.4)',
      },
      round: {
        type: Boolean,
        default: false,
      },
      preview: {
        type: String,
      },
    },
    mounted() {
      this.imgEl = this.$el.querySelector('.img');
      this.wrapEl = this.$el.querySelector('.wrap');
      this.areaEl = this.$el.querySelector('.area');
      this.scaleEl = this.$el.querySelector('.img-scale');
      this.translateEl = this.$el.querySelector('.img-translate');
      this.stemEl = this.$el.querySelector('.stem-bg');
      this.canvasEl = this.$el.querySelector('.hidden-canvas');
      this.$subscribeTo(
        this.zoomSubject$.pipe(merge(this.dragSubject$), merge(this.onchange$)),
        () => {
          this.$nextTick(() => {
            const result = this.getDrawPos().pos;
            const rotate = this.rotate;
            if (this.invalidDrawPos(result)) return;
            this.callPreview('locateImage', result, rotate);
          });
        },
      );
    },
    methods: {
      calculateSizeAfterTimeout() {
        const canvas = this.clip();
        const dataURL = canvas.toDataURL('imageToCorp/jpeg', 0.5);
        const blob = this.dataURItoBlob(dataURL);
        this.blobLength = blob.size;
        const size = this.formatBytes(blob.size, 0);
        this.$emit('changed', size);
      },
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
      formatBytes(a, b) {
        if (a === 0) return '0 Bytes';
        const c = 1024;
        const d = b || 2;

        const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const f = Math.floor(Math.log(a) / Math.log(c));
        const size = {
          // eslint-disable-next-line
          num: parseFloat((a / Math.pow(c, f)).toFixed(d)),
          type: e[f],
          bytes: a,
        };
        // return `${parseFloat((a / Math.pow(c, f)).toFixed(d))} ${e[f]}`;
        return size;
      },
      changed() {
        const DELAY = 400;
        this.message = 'Calculating...';

        const vm = this;
        if (this.callbackLauncher) {
          clearTimeout(vm.callbackLauncher);
        }

        this.callbackLauncher = setTimeout(() => {
          Promise.resolve(vm.calculateSizeAfterTimeout());
          Promise.resolve((vm.message = 'Current size'));
        }, DELAY);
      },
      dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(dataURI.split(',')[1]);
        } else byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
      },
      imgLoaded() {
        this.resetData();
        this.imgRatio = this.imgEl.naturalWidth / this.imgEl.naturalHeight;
        this.stemEl.width = this.imgEl.naturalWidth;
        this.stemEl.height = this.imgEl.naturalHeight;
        this.callPreview('setData', {
          src: this.src,
          bgColor: this.bgColor,
        });
      },
      resetData() {
        this.setTL$.next({ left: 0, top: 0 });
        this.setWH$.next(1);
      },
    },
    computed: {
      areaStyle() {
        const style = {
          color: this.shadow,
          borderWidth: `${this.border}px`,
          boxShadow: `0 0 0 ${this._shadow}`,
          borderRadius: (this.round) ? '50%' : '',
        };
        this.ratio >= 1 ? (style.width = '50%') : (style.height = '50%');
        return style;
      },
      scaleStyle() {
        const width = this.bgWH$;
        return {
          transform: `scale(${width})`,
        };
      },
      translateStyle() {
        const left = this.bgTL$.left;
        const top = this.bgTL$.top;
        return {
          transform: `translate(${left}%,${top}%)`,
        };
      },
      bgStyle() {
        this.onchange$.next(0);
        return {
          transform: `rotate(${this.rotate}deg)`,
        };
      },
      wrapStyle() {
        return {
          backgroundColor: this.watchPreData.bgColor,
        };
      },
      stemArea() {
        return {
          width: 10,
          height: 10 / this.ratio,
        };
      },
      stemStyle() {
        const style = {};
        this.ratio >= 1 ? (style.width = '100%') : (style.height = '100%');
        return style;
      },
      _shadow() {
        return `${this.imgRatio >= 1 ? 100 : 100 / this.imgRatio}vw`;
      },
      watchPreData() {
        this.callPreview('setData', { bgColor: this.bgColor });
        return {
          bgColor: this.bgColor,
        };
      },
    },
  };
</script>
<style lang='scss' scoped>
$grid-width: 1px;

.hidden-canvas {
  display: none;
}
.wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: grab;
}
.stem-outer {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  display: block;
}
.stem-bg {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
}
.img-center {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.img-scale {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
}
.img-translate {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
}
.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: block;
}
.cover {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: white;
  border-style: solid;
}
.stem-area {
  display: block;
  position: relative;
}
.grid {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  & .grid-item {
    position: absolute;
    border-color: rgba(255, 255, 255, 0.7);
    border-style: dashed;
    width: 50%;
    height: 50%;
    box-sizing: border-box;
  }
  & .grid-item:nth-child(1) {
    top: 0;
    left: 0;
    border-width: 0 $grid-width $grid-width 0;
    transform: translate($grid-width/2, $grid-width/2);
  }
  & .grid-item:nth-child(2) {
    top: 0;
    right: 0;
    border-width: 0 0 $grid-width 0;
    transform: translate(-$grid-width/2, $grid-width/2);
  }
  & .grid-item:nth-child(3) {
    bottom: 0;
    left: 0;
    border-width: 0 $grid-width 0 0;
    transform: translate($grid-width/2, -$grid-width/2);
  }
  & .grid-item:nth-child(4) {
    bottom: 0;
    right: 0;
    border-width: 0;
    transform: translate(-$grid-width/2, -$grid-width/2);
  }
}
</style>
