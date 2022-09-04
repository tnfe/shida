<template>
  <el-form-item label="相册动画间隔：">
    <div class="col-2 attr-item-edit-input">
      <el-input-number size="mini" v-model="tempVal" controls-position="right" :min="0" :step="0.1" :max="100" />
    </div>
  </el-form-item>
</template>

<script>
export default {
  name: "attr-qk-interval",
  props: {
    interval: Number
  },
  data() {
    return {
      tempVal: ""
    };
  },
  mounted() {
    this.tempVal = this.interval;
  },
  watch: {
    interval() {
      this.tempVal = this.interval;
    },
    tempVal() {
      this.$emit("update:interval", this.tempVal);
    }
  }
};
</script>

<style scoped></style>
