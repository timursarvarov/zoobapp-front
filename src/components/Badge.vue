<template>
  <component
  :style="[{'background-color':`${color}`}]" 
  :is="tag"
  class="badge"
  :class="`badge-${type}`">
    <slot></slot>
  </component>
</template>
<script>
  export default {
    name: 'badge',
    props: {
      tag: {
        type: String,
        default: 'span',
      },
      color: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'default',
        validator: (value) => {
          const acceptedValues = [
            'primary',
            'info',
            'success',
            'warning',
            'danger',
            'rose',
          ];
          return acceptedValues.indexOf(value) !== -1;
        },
      },
    },
  };
</script>
<style>
</style>
