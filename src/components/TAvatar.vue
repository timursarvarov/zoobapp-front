<template>
    <md-avatar
      :class="[{'md-small': small}]"
      class="md-avatar-icon t-avatar"
      :style="{'background-color': color}"
    >
      <div
        v-if="noImgTag && imageSrc"
        class="avatar"
        :style="{'background-image':  'url(' + imageSrc + ')'}"
          >
      </div>
      <img
        v-else-if="imageSrc"
        :src="imageSrc"
        :alt="title | acronim">
      <span v-else>
      {{ title | acronim}}
      </span>
    </md-avatar>
</template>
<script>

  export default {
    name: 't-avatar',
    props: {
      color: {
        type: String,
        default: '#000000',
      },
      imageSrc: {
        type: String,
        default: '',
      },
      noImgTag: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      small: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
    },
  };
</script>
<style lang="scss">
.t-avatar {
  .avatar {
    width: 100%;
    height: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: transparent;
    margin: 0 auto;
  }
}
</style>
