<!--矩形边框-->
<template>
  <div class="qk-rectangle-border">
    <div class="qk-rectangle-nei" :style="{ 'background-color': bgColor }"></div>
  </div>
</template>

<script>
export default {
  name: "QkRectangleBorder",
  props: {
    bgColor: {
      type: String,
      default: "#ffcc22"
    }
  }
};
</script>

<style lang="scss" scoped>
.qk-rectangle-nei {
  width: 100%;
  height: 100%;
}
</style>
