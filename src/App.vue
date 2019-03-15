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
.md-table-cell {
    .md-table-cell-container > div {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
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
// .md-button,
// .md-button.md-default {
//   box-shadow: none;
// }
.clear-button{
  width: 28px!important;
  min-width: 28px !important;
  height: 28px!important;
  margin: 0;
  position: absolute!important;
  background-color: transparent !important;
  -webkit-box-shadow: none;
  box-shadow: none;
  top:6px!important;
.md-button-content{
    top: -13px;
    left: 13px;
}
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
.md-dialog{
  box-shadow: none;
}
.md-chips:before,
.md-chips:after {
  display: block;
}
.md-card-profile .md-card-avatar {
    max-width: 132px;
    max-height: 132px;
    // background-color: #999999;
}
.picture-container {
    position: relative;
    cursor: pointer;
    text-align: center;
    .picture {
      transition-property: all;
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: 0s;
      width: 132px;
      height: 132px;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.2s;
      -webkit-transition: all 0.2s;
      .picture-wrapper-acronim {
        height: -webkit-fill-available;
        font-size: 4.875rem;
        .acronim {
          color: white;
          text-transform: uppercase;
        }
      }
      .picture-hint{
        position: absolute;
        transition-property: all;
        transition-duration: 0.4s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
        position: absolute;
        opacity: 0;
        width: 132px;
        height: 132px;
        background-color: black;
        border-radius: 50%;
        //  border: 3px transparent;
        .md-icon{
          color: white;
        }
      }
      .avatar {
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: transparent;
        margin: 0 auto;
        min-height: 132px;
        min-width: 132px;
      }
      &:hover {
        border-color: #4caf50;
      }
      &:hover > .picture-hint {
        opacity: 0.7;
      }
      input[type="file"] {
        cursor: pointer;
        display: block;
        height: 100%;
        left: 0;
        opacity: 0 !important;
        position: absolute;
        top: 0;
        width: 100%;
        max-width: 132px;
        margin-top: -132px;
        position: relative;
      }
    }
  }
</style>
>
