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
        :alt="((firstName.length > 0 ? firstName[0]:'') + (lastName.length > 0 ? lastName[0]:'')) | capitilize">
      <span v-else>
      {{ (firstName.length > 0 ? firstName[0]:'') | capitilize}}{{ (lastName.length > 0 ? lastName[0]:'') | capitilize}}
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
      firstName: {
        type: String,
        default: '',
      },
      lastName: {
        type: String,
        default: '',
      },
      small: {
        type: Boolean,
        default: false,
      },
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
