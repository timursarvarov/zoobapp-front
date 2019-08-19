<template>
  <li :class="[{'timeline-inverted': inverted}, {'timeline-simple': !inverted}]">
    <slot name="badge">
      <div
        class="timeline-badge"
        :class="badgeAvatar.color == null? '' : badgeType"
        :style="[{'background-color':
        badgeAvatar.img == null ||
        badgeAvatar.acronim == null ? '': `${badgeAvatar.color}`}]"
      >
          <img
            v-if="badgeAvatar.img"
            :src="badgeAvatar.img"
            alt="avatar"
          />
          <span v-if="badgeAvatar.acronim">
            {{badgeAvatar.acronim}}
          </span>
          <span v-else>
            <md-icon>{{ badgeIcon }}</md-icon>
          </span>
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
            badgeColor: {
                type: String,
                default: '',
            },
            badgeIcon: {
                type: String,
                default: '',
            },
            badgeAvatar: {
                type: Object,
                default: () => ({ img: null, acronim: null, color: 'null' }),
            },
        },
    };
</script>
<style lang="scss" scoped>
.timeline-badge{
  img{
    margin-top:-3px;
  }
  overflow: hidden;
    -webkit-box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)!important;
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2) !important;
}
</style>
