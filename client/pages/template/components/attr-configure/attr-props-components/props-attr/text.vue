<template>
  <div class="text">
    <el-form-item label="文本内容：">
      <el-input type="textarea" :rows="2" placeholder="请输入文本内容" v-model="templateText"></el-input>
    </el-form-item>
    <el-form-item label="字体:">
      <el-select v-model="templateFont" placeholder="请选择" @change="changeFont">
        <el-option
          v-for='item in fonts'
          :key='item.value'
          :label='item.label'
          :value='item.value'>
        </el-option>
      </el-select>
    </el-form-item>
  </div>

</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'attr-qk-text',
  props: {
    text: String,
    font: {
      type: String,
      default: 'wryh',
    },
  },
  data() {
    return {
      templateText: "",
      templateFont: '',
      fonts: [
        {
          value: 'wryh',
          label: '微软雅黑',
        },
      ],
    };
  },
  mounted() {
    this.templateText = this.text;
    this.templateFont = this.font

  },
  created() {
    this.getFonts();
  },
  computed: {
    ...mapState({
      projectData: state => state.template.projectData,
      activePageUUID: state => state.template.activePageUUID,
      activeElementUUID: state => state.template.activeElementUUID,
      activeAttrEditCollapse: state => state.template.activeAttrEditCollapse,
      
    }),
    ...mapGetters('template', ['currentPageIndex', 'activeElementIndex', 'activeElement', 'activePage']),
  },
  watch: {
    text() {
      this.templateText = this.text;
    },
    templateText() {
      this.$emit("update:text", this.templateText);
    },
    templateFont() {
      this.$emit("update:font", this.templateFont)
      // console.log(this.templatepFont)
    }
  },
  methods: {
    changeFont(value) {
      const templateFont = this.templateFont.split('/')[1].split('.')[0];
      console.log(templateFont)
      this.$store.dispatch('template/resetElementCommonStyle', { 'font-family': templateFont });
    },
    //获取字体列表
    getFonts() {
      const fonts = require.context('@/common/text-fonts/src', false).keys();
      for (let i = 0; i < fonts.length; i++) {
        const font = fonts[i];
        this.fonts.push({ label: font.split('/')[1].split('.')[0], value: font });
      }
    },
  },
};
</script>

<style scoped></style>
