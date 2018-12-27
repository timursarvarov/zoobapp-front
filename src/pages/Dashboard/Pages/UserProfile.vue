<template>
  <div class="content user-profile">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <user-card button-color="success">
        </user-card>
      </div>

      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form header-color="green">
        </edit-profile-form>
      </div>

      <div class="md-layout-item md-medium-size-100 md-size-33">
        <password-form header-color="green">
        </password-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { EditProfileForm, UserCard, PasswordForm } from '@/pages';

  export default {
    components: {
      EditProfileForm,
      UserCard,
      PasswordForm,
    },
  };
</script>
<style lang="scss">
.text-right {
  display: flex;
}
.user-profile {
  .md-field {
      margin-top: 24px;
          .md-error {
          position: absolute;
          display: block!important;
          opacity: 1;
          // transform: translate3d(0,-12px,0);
          color: #ff1744;
          font-size: .6875rem;
          bottom: -1.3rem;
          line-height: normal;
          text-align:left;
          }
    }
}
</style>
