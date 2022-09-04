<template>
  <div class="seize-symbol">
    <el-form-item label="文本内容：">
      <el-input type="textarea" :rows="2" placeholder="请输入文本内容" v-model="templateSymbol"> </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "seize-symbol",
  props: {
    symbol: String
  },
  data() {
    return {
      templateSymbol: ""
    };
  },
  mounted() {
    this.templatepSymbol = this.symbol;
  },
  watch: {
    text() {
      this.templateSymbol = this.symbol;
    },
    templateText() {
      this.$emit("update:symbol", this.templatepSymbol);
    }
  }
};
</script>

<style lang="less" scoped>

</style>