<template>
    <footer class="footer">
        <div class="container">
            <nav>
                <ul>
                    <li>
                        <router-link v-if="$route.meta.rtlActive" :to="{ path: '/dashboard' }">
                            منزل
                        </router-link>
                        <router-link v-else :to="{ path: '/dashboard' }">
                            Home
                        </router-link>
                    </li>
                    <li>
                        <a v-if="$route.meta.rtlActive" href="#">
                            شركة
                        </a>
                        <a v-else href="#">
                            Company
                        </a>
                    </li>
                    <li>
                        <a v-if="$route.meta.rtlActive" href="#">
                            محفظة
                        </a>
                        <a v-else href="#">
                            Portfolio
                        </a>
                    </li>
                    <li>
                        <a v-if="$route.meta.rtlActive" href="#">
                            بلوق
                        </a>
                        <a v-else href="#">
                            Blog
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="copyright text-center">
                &copy; {{ new Date().getFullYear() }} <a href="https://www.zoobapp.com" target="_blank">Owl Team</a>, made with
                <i class="fa fa-heart heart" /> for a better web
            </div>
        </div>
    </footer>
</template>
<script>
export default {
    name: 'ContentFooter'
};
</script>
<style></style>
