<template>
  <li :class="[{'timeline-inverted': inverted}, {'timeline-simple': !inverted}]">
    <slot name="badge">
      <div
        class="timeline-badge"
        :class="badgeType"
      >
        <md-avatar
          v-if=" badgeAvatar.img || badgeAvatar.acronim"
          class="md-avatar-icon"
          :style="[{'background-color':`${badgeAvatar.color}`}]"
        >
          <img
            v-if="badgeAvatar.img"
            :src="badgeAvatar.img"
            alt="avatar"
          />
          <span v-else>
            {{badgeAvatar.acronim}}
          </span>
        </md-avatar>
        <md-icon v-else>{{ badgeIcon }}</md-icon>
      </div>
    </slot>
    <div class="timeline-panel">
      <div class="timeline-heading">
        <slot name="header"></slot>
      </div>
      <div
        class="timeline-body"
        v-if="$slots.content"
      >
        <slot name="content"></slot>
      </div>
      <h6 v-if="$slots.footer">
        <slot name="footer"></slot>
      </h6>
    </div>
  </li>
</template>
<script>
  export default {
    name: 'time-line-item',
    props: {
      inverted: Boolean,
      badgeType: {
        type: String,
        default: 'success',
      },
      badgeIcon: {
        type: String,
        default: '',
      },
      badgeAvatar: {
        type: Object,
        default: () => ({ img: '', acronim: '', color: '' }),
      },
    },
  };
</script>
<style lang="scss" scoped>
.md-avatar {
  height: 50px;
  min-height: 50px;
  min-width: 50px;
  width: 50px;
  margin-top: -5px;
}
</style>
