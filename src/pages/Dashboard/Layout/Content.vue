<template>
    <div class="content">
        <FadeTransition :duration="200" mode="out-in">
            <!-- your content here -->
            <router-view />
        </FadeTransition>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';

export default {
    name: 'Content',
    components: {
        FadeTransition
    }
};
</script>
<style></style>
