/* eslint-disable */
<template>
  <div>
    <router-view></router-view>
    <notifications></notifications>
  </div>
</template>

<script>
  import { USER_INITIAL, AUTH_DECODE_TOKEN } from '@/store/modules/constants';
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
        this.$store.dispatch(USER_INITIAL);
        this.$store.dispatch(AUTH_DECODE_TOKEN);
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
<style lang="scss">
.md-tabs-navigation {
  overflow: auto;
}
/* Change autocomplete styles in WebKit */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus textarea:-webkit-autofill,
textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset;
  transition: background-color 5000s ease-in-out 0s;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
div :not(.md-toolbar) > .md-field:not(.md-chips) {
  margin-top: 24px;
  .md-error {
    position: absolute;
    display: block !important;
    opacity: 1;
    // transform: translate3d(0,-12px,0);
    color: #ff1744;
    font-size: 0.6875rem;
    bottom: -1.3rem;
    line-height: normal;
    text-align: left;
  }
  .md-input-action {
    margin: 0;
  }
}
.md-button,
.md-button.md-default {
  box-shadow: none;
}
textarea::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 5px;
}
/* .md-field .md-input-action { */
/* background-color: transparent !important; */
/* } */
.main-panel > .content {
  min-height: calc(100vh - 160px);
}
.md-chips:before,
.md-chips:after {
  display: block;
}
</style>
>
