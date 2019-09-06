<template>
    <div>
        <div class="t-avatar-box md-layout md-alignment-left-center">
            <div class="md-layout" style="max-width:40px;">
                <t-avatar
                    :notification="notification"
                    :notificationClass="notificationClass"
                    :small="small"
                    :text-to-color="`${secondLine}${id}${firstLine}`"
                    :image-src="avatar"
                    :title="secondLine + ' ' + firstLine"
                />
            </div>
            <div
                :class="[{ 'md-layout-item': !small }]"
                class="md-xsmall-hide t-avatar-box_text"
            >
                <small v-if="small">
                    <span v-if="firstLine">{{ firstLine | capitilize }}</span>
                    <br v-if="firstLine" />
                    <span v-if="secondLine">{{ secondLine | capitilize }}</span>
                </small>
                <span v-else>
                    <span v-if="firstLine">{{ firstLine | capitilize }}</span>
                    <br v-if="firstLine" />
                    <span v-if="secondLine">{{ secondLine | capitilize }}</span>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import TAvatar from './TAvatar';

export default {
    name: 'AvatarBox',
    components: {
        TAvatar
    },
    props: {
        small: {
            type: Boolean,
            default: () => false
        },
        item: {
            type: Object,
            default: () => {}
        },
        id: {
            type: Number,
            default: () => 0
        },
        firstLine: {
            type: String,
            default: () => ''
        },
        notification: {
            type: String,
            default: () => ''
        },
        notificationClass: {
            type: String,
            default: () => ''
        },
        secondLine: {
            type: String,
            default: () => ''
        },
        avatar: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {};
    }
};
</script>
<style lang="scss"></style>
