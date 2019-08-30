<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-size-66">
                <edit-profile-form header-color="green" />
            </div>
            <div class="md-layout-item md-medium-size-100 md-size-33">
                <user-card button-color="success" />
            </div>
        </div>
    </div>
</template>

<script>
import { EditProfileForm, UserCard } from '@/pages';

export default {
    name: 'UserProfile',
    components: {
        EditProfileForm,
        UserCard,
    },
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
