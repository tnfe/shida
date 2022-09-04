<template>
  <el-form-item label="颜色：">
    <el-color-picker size="mini" :show-alpha="true" v-model="tempValue"></el-color-picker>
  </el-form-item>
</template>
<script>
export default {
  name: "attr-qk-bgColor",
  props: {
    bgColor: {
      type: String,
      default: () => "#ffcc22"
    }
  },
  mounted() {
    this.tempValue = this.bgColor;
  },
  data() {
    return {
      tempValue: "#ffcc22"
    };
  },
  watch: {
    imageSrc(val) {
      this.tempValue = val;
    },
    tempValue() {
      this.$emit("update:bgColor", this.tempValue);
    }
  }
};
</script>

<style scoped></style>
