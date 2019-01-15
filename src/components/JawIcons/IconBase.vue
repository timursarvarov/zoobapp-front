/* eslint-disable */
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <!-- <title
      :id="iconName"
      lang="en"
    >{{iconName}} icon</title> -->
    <g
      :fill="iconColor"
      :stroke="iconColor"
    >
      <icon-adult v-if="iconName === 'icon-adult'" />
      <icon-baby v-if="iconName === 'icon-baby'" />
      <icon-brekets v-if="iconName === 'icon-brekets'" />
      <icon-card v-if="iconName === 'icon-card'" />
      <icon-forceps v-if="iconName === 'icon-forceps'" />
      <icon-implant v-if="iconName === 'icon-implant'" />
      <icon-injection v-if="iconName === 'icon-injection'" />
      <icon-inset-jaw v-if="iconName === 'icon-inset-jaw'" />
      <icon-observation v-if="iconName === 'icon-observation'" />
      <icon-open-mouth v-if="iconName === 'icon-open-mouth'" />
      <icon-palm-face v-if="iconName === 'icon-palm-face'" />
      <icon-paradontit v-if="iconName === 'icon-paradontit'" />
      <icon-point v-if="iconName === 'icon-point'" />
      <icon-root-canal v-if="iconName === 'icon-root-canal'" />
      <icon-survey v-if="iconName === 'icon-survey'" />
      <icon-tablets v-if="iconName === 'icon-tablets'" />
      <icon-toggle-bottom v-if="iconName === 'icon-toggle-bottom'" />
      <icon-toggle-top v-if="iconName === 'icon-toggle-top'" />
      <icon-tooth-bacteria v-if="iconName === 'icon-tooth-bacteria'" />
      <icon-tooth-bill v-if="iconName === 'icon-tooth-bill'" />
      <icon-tooth-bottle v-if="iconName === 'icon-tooth-bottle'" />
      <icon-tooth-bottom v-if="iconName === 'icon-tooth-bottom'" />
      <icon-tooth-calendar v-if="iconName === 'icon-tooth-calendar'" />
      <icon-tooth-card v-if="iconName === 'icon-tooth-card'" />
      <icon-tooth-carries v-if="iconName === 'icon-tooth-carries'" />
      <icon-tooth-clean v-if="iconName === 'icon-tooth-clean'" />
      <icon-tooth-corons v-if="iconName === 'icon-tooth-corons'" />
      <icon-tooth-cracked v-if="iconName === 'icon-tooth-cracked'" />
      <icon-tooth-drop v-if="iconName === 'icon-tooth-drop'" />
      <icon-tooth-extraction v-if="iconName === 'icon-tooth-extraction'" />
      <icon-tooth-handCare v-if="iconName === 'icon-tooth-handCare'" />
      <icon-tooth-ice v-if="iconName === 'icon-tooth-ice'" />
      <icon-tooth-info v-if="iconName === 'icon-tooth-info'" />
      <icon-tooth-inspected v-if="iconName === 'icon-tooth-inspected'" />
      <icon-tooth-locked v-if="iconName === 'icon-tooth-locked'" />
      <icon-tooth-pain v-if="iconName === 'icon-tooth-pain'" />
      <icon-tooth-point v-if="iconName === 'icon-tooth-point'" />
      <icon-tooth-protected v-if="iconName === 'icon-tooth-protected'" />
      <icon-tooth-renew v-if="iconName === 'icon-tooth-renew'" />
      <icon-tooth-settings v-if="iconName === 'icon-tooth-settings'" />
      <icon-tooth-small v-if="iconName === 'icon-tooth-small'" />
      <icon-tooth-star v-if="iconName === 'icon-tooth-star'" />
      <icon-tooth-sun v-if="iconName === 'icon-tooth-sun'" />
      <icon-tooth-tablet v-if="iconName === 'icon-tooth-tablet'" />
      <icon-tooth-treated v-if="iconName === 'icon-tooth-treated'" />
      <icon-tooth-tree v-if="iconName === 'icon-tooth-tree'" />
      <icon-tooth-wash v-if="iconName === 'icon-tooth-wash'" />
      <icon-tooth-wings v-if="iconName === 'icon-tooth-wings'" />
      <icon-tooth-world v-if="iconName === 'icon-tooth-world'" />
      <icon-tooth-restovration v-if="iconName === 'icon-tooth-restovration'" />
      <icon-tooth-health v-if="iconName === 'icon-tooth-health'" />
      <icon-tooth-hand-care v-if="iconName === 'icon-tooth-hand-care'" />
    </g>
  </svg>
</template>

<script>
/* eslint-disable */
import {
  IconAdult,
  IconBaby,
  IconBrekets,
  IconCard,
  IconForceps,
  IconImplant,
  IconInjection,
  IconInsetJaw,
  IconObservation,
  IconOpenMouth,
  IconPalmFace,
  IconParadontit,
  IconPoint,
  IconRootCanal,
  IconSurvey,
  IconTablets,
  IconToggleBottom,
  IconToggleTop,
  IconToothBacteria,
  IconToothBill,
  IconToothBottle,
  IconToothBottom,
  IconToothCalendar,
  IconToothCard,
  IconToothCarries,
  IconToothClean,
  IconToothCorons,
  IconToothCracked,
  IconToothDrop,
  IconToothExtraction,
  IconToothHandCare,
  IconToothHealth,
  IconToothIce,
  IconToothInfo,
  IconToothInspected,
  IconToothLocked,
  IconToothPain,
  IconToothPoint,
  IconToothProtected,
  IconToothRenew,
  IconToothSettings,
  IconToothSmall,
  IconToothStar,
  IconToothSun,
  IconToothTablet,
  IconToothTreated,
  IconToothTree,
  IconToothWash,
  IconToothWings,
  IconToothWorld,
  IconToothRestovration
} from "./Icons";

export default {
  components: {
    IconAdult,
    IconBaby,
    IconBrekets,
    IconCard,
    IconForceps,
    IconImplant,
    IconInjection,
    IconInsetJaw,
    IconObservation,
    IconOpenMouth,
    IconPalmFace,
    IconParadontit,
    IconPoint,
    IconRootCanal,
    IconSurvey,
    IconTablets,
    IconToggleBottom,
    IconToggleTop,
    IconToothBacteria,
    IconToothBill,
    IconToothBottle,
    IconToothBottom,
    IconToothCalendar,
    IconToothCard,
    IconToothCarries,
    IconToothClean,
    IconToothCorons,
    IconToothCracked,
    IconToothDrop,
    IconToothExtraction,
    IconToothHandCare,
    IconToothHealth,
    IconToothIce,
    IconToothInfo,
    IconToothInspected,
    IconToothLocked,
    IconToothPain,
    IconToothPoint,
    IconToothProtected,
    IconToothRenew,
    IconToothSettings,
    IconToothSmall,
    IconToothStar,
    IconToothSun,
    IconToothTablet,
    IconToothTreated,
    IconToothTree,
    IconToothWash,
    IconToothWings,
    IconToothWorld,
    IconToothRestovration
  },
  props: {
    iconName: {
      type: String,
      default: "box"
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: "currentColor"
    }
  }
};
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px; /* yes, I'm that particular about formatting */
}
</style>
