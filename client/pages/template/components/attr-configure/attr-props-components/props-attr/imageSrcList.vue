<template>
  <el-form-item>
    <div class="con" v-for="(item, index) in tempValue" :key="index">
      <fileUploader v-model="item.url" :type="'image'" @uploaded="imgUploaded" />
      <div>
        <span class="imageSelect-btn" @click="onClick('+', index)">
          <i class="el-icon-circle-plus-outline"></i>
        </span>
        <span class="imageSelect-btn" @click="onClick('-', index)">
          <i class="el-icon-remove-outline"></i>
        </span>
      </div>
      <hr class="hr" />
    </div>
  </el-form-item>
</template>

<script>
import fileUploader from "@client/components/file-uploader";

export default {
  name: "attr-qk-imageSrcList",
  props: {
    imageSrcList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    fileUploader
  },
  data() {
    return {
      tempValue: []
    };
  },
  created() {
    this.fillTempValue();
  },
  methods: {
    fillTempValue() {
      const list = [];
      this.imageSrcList.forEach(item => list.push({ url: item }));
      this.tempValue = list;
    },

    imgUploaded() {
      const list = this.getResultImageSrcList();
      this.$emit("update:imageSrcList", list);
    },

    getResultImageSrcList() {
      let list = [];
      for (let i = 0, len = this.tempValue.length; i < len; i++) {
        list.push(this.tempValue[i].url);
      }
      return list;
    },

    onClick(type, index) {
      if (type === "+") {
        this.tempValue.splice(index + 1, 0, { url: "/static/demo/demo.jpg" });
      } else {
        if (this.tempValue.length <= 2) {
          this.$message("最少要有两张图片!");
          return;
        }
        this.tempValue.splice(index, 1);
      }

      this.imgUploaded();
    }
  }
};
</script>

<style scoped>
.con {
}
.hr {
  opacity: 0.7;
}
.imageSelect-btn {
  cursor: pointer;
}
</style>
