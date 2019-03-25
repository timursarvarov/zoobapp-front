<template>
  <div class="file-preview" :style="[{width: width +'px'},{height:height+'px'}]">
    <div class="picture">
      <transition name="fade">
        <img
          :class="{'img-to-preview': mimeTypeClass(mimeType).some(v=> v === 'file-image')}"
          @click="$emit('show', '.img-to-preview')"
          :style="[
            {'object-fit': 'cover'},
            {width: 100+'%'},
            {height: height + 'px'},
            ]"
          :src="url"
          @load="onLoaded"
          v-show="loaded && url"
        >
      </transition>
      <transition name="fade">
        <div
          v-show="!loaded"
          :style="[{width: width +'px'},{height:height+'px'}]"
          class="md-layout md-alignment-center-center mimetype-wrapper"
        >
          <div class="md-layout-item md-layout md-alignment-center-center mx-auto mimetype">
            <md-icon class="md-layout-item" :style="{color: computedColor}">
              <font-awesome-icon :size="`${iconSize}x`" :icon="mimeTypeClass(mimeType)"/>
            </md-icon>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import mimetype2fa from './mime-type2fa';

  const randomMC = require('random-material-color');

  export default {
    name: 't-file-preview',
    components: {},
    props: {
      color: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
      mimeType: {
        type: String,
        default: '',
      },
      iconSize: {
        type: Number,
        default: 1,
      },
      width: {
        type: Number,
        default: 60,
      },
      height: {
        type: Number,
        default: 60,
      },
    },
    data() {
      return {
        loaded: false,
      };
    },
    methods: {
      mimeTypeClass(m) {
        return mimetype2fa(m, { prefix: 'far ' }).split(' ');
      },
      onLoaded() {
        this.loaded = true;
      },
    },
    computed: {
      computedColor() {
        if (this.color) {
          return this.color;
        }
        const color = randomMC.getColor({
          text: this.mimeType,
        });
        return color;
      },
    },
  };
</script>
<style lang="scss">
.file-preview {
  position: relative;
  text-align: center;
  overflow: hidden;
  border-radius: 3px;
  .picture {
    .fade-enter-active {
      transition: opacity 3s ease-in-out;
    }

    .fade-enter-to {
      opacity: 1;
    }

    .fade-enter {
      opacity: 0;
    }
    transition-property: all;
    transition-duration: 0.4s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0s;
    overflow: hidden;
    transition: all 0.2s;
    -webkit-transition: all 0.2s;
    .mimetype-wrapper {
      .fade-enter-active {
        transition: opacity 3s ease-out-in;
      }
      .fade-enter-to {
        opacity: 1;
      }
      .fade-enter {
        opacity: 0;
      }
      height: -webkit-fill-available;
      font-size: 3.9rem;
      .md-icon {
        text-align: center;
        color: white;
      }
    }
    .img-to-preview {
      transition: all 0.4s ease;
      cursor: zoom-in;
    }
  }
}
</style>
