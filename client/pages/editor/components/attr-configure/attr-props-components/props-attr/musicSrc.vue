<template>
  <el-form-item label="资源地址：">
    <fileUploader v-model="tempValue" :type="'music'" />
  </el-form-item>
</template>

<script>
import fileUploader from "@client/components/file-uploader";

export default {
  name: "attr-qk-musicSrc",
  props: {
    musicSrc: String
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
    this.tempValue = this.musicSrc;
  },
  watch: {
    musicSrc(val) {
      this.tempValue = val;
    },
    tempValue() {
      this.$emit("update:musicSrc", this.tempValue);
    }
  }
};
</script>

<style scoped></style>
