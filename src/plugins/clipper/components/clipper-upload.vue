/* eslint-disable */
<template>
    <div @click="triggerInput">
        <slot />
        <input type="file" class="upload" style="display:none" @input="upload($event)" @click="clear($event)" />
    </div>
</template>

<script>
export default {
    name: 'ClipperUpload',
    props: {
        value: {
            type: String,
            default: ''
        },
        check: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        uploadEl: null,
        DomString: ''
    }),
    mounted() {
        this.uploadEl = this.$el.querySelector('.upload');
    },
    methods: {
        upload(e) {
            if (e.target.files.length !== 1) return;
            const file = e.target.files[0];
            if (this.check && !file.type.startsWith('image/')) return;
            if (this.DomString) window.URL.revokeObjectURL(this.DomString);
            this.DomString = window.URL.createObjectURL(file);
            this.$emit('input', this.DomString);
        },
        clear(e) {
            e.target.value = null;
        },
        triggerInput() {
            if (this.uploadEl) this.uploadEl.click();
        }
    }
};
</script>

<style lang="scss" scoped></style>
