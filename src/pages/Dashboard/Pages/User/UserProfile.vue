<template>
    <div class="content user-profile">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-size-66">
                <user-card button-color="success" />
            </div>

            <div class="md-layout-item md-medium-size-100 md-size-33">
                <password-form header-color="green" />
            </div>

            <div class="md-layout-item md-medium-size-100 md-size-33">
                <!-- <calendar-form header-color="green"/> -->
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from './UserProfile/UserCard.vue';
import PasswordForm from './UserProfile/PasswordForm.vue';
// import CalendarForm from './UserProfile/CalendarForm';

export default {
    name: 'UserProfile',
    components: {
        UserCard,
        PasswordForm
        // CalendarForm,
    }
};
</script>
<style lang="scss">
// .user-profile {
//   .md-field {
//     .md-error {
//       position: absolute;
//       display: block !important;
//       opacity: 1;
//       // transform: translate3d(0,-12px,0);
//       color: #ff1744;
//       font-size: 0.6875rem;
//       bottom: -1.3rem;
//       line-height: normal;
//       text-align: left;
//     }
//   }
// }
</style>
