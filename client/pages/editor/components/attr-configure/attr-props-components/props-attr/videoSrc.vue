<template>
  <el-form-item label="视频地址：">
    <fileUploader v-model="tempValue" :type="'video'" />
  </el-form-item>
</template>

<script>
import fileUploader from "@client/components/file-uploader";

export default {
  name: "attr-qk-videoSrc",
  props: {
    videoSrc: String
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
    this.tempValue = this.videoSrc;
  },
  watch: {
    videoSrc(val) {
      this.tempValue = val;
    },
    tempValue() {
      this.$emit("update:videoSrc", this.tempValue);
    }
  }
};
</script>

<style scoped></style>
