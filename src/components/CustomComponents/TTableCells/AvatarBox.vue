<template>
    <div>
        <div :class="field.key" class="md-layout md-alignment-left-center">
            <div class="md-layout" style="max-width:40px;">
                <t-avatar
                    :small="small"
                    :text-to-color="
                        `${item.firstName}${item.ID}${item.lastName}`
                    "
                    :image-src="item.avatar"
                    :title="item.firstName + ' ' + item.lastName"
                />
            </div>
            <span class="md-layout-item">
                <span>{{ item.lastName | capitilize }}</span>
                <br />
                <span>{{ item.firstName | capitilize }}</span>
            </span>
        </div>
    </div>
</template>
<script>
import TAvatar from '../TAvatar';

export default {
    name: 'CellAuthor',
    components: {
        TAvatar
    },
    props: {
        small: {
            type: Boolean,
            default: () => false
        },
        item: {
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
