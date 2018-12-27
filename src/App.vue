 /* eslint-disable */
<template>
  <div>
  <router-view></router-view>
  <notifications></notifications>
  </div>
</template>

<script>
  import { USER_REQUEST } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        getNotify: 'getNotify',
        refreshTokenExist: 'fetchRefreshToken',
        isProfileLoaded: 'isProfileLoaded',
      }),
    },
    mounted() {
      if (this.refreshTokenExist) {
        this.$store.dispatch(USER_REQUEST);
      }
    },
    watch: {
      getNotify: {
        handler() {
          const newNotify = {};
          const el = this;
          Object.keys(el.getNotify).forEach((key) => {
            newNotify[key] = el.getNotify[key];
          });
          this.$notify(newNotify);
        },
        deep: true,
      },
    },
  };
</script>
<style>
.md-tabs-navigation {
  overflow: auto;
}
  /* Change autocomplete styles in WebKit */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
>
