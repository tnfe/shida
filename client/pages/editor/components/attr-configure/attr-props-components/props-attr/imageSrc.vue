<template>
  <el-form-item label="图片：">
    <fileUploader v-model="tempValue" />
  </el-form-item>
</template>

<script>
import fileUploader from "@client/components/file-uploader";

export default {
  name: "attr-qk-imageSrc",
  props: {
    imageSrc: String
  },
  components: {
    fileUploader
  },
  data() {
    return {
      tempValue: ""
    };
  },
  mounted() {
    this.tempValue = this.imageSrc;
  },
  watch: {
    imageSrc(val) {
      this.tempValue = val;
    },
    tempValue() {
      this.$emit("update:imageSrc", this.tempValue);
    }
  }
};
</script>

<style scoped></style>
