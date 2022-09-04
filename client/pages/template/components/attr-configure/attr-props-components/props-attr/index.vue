<template>
  <div v-if='currentElementProps.length'>
    <div class='attr-title marginB10 fontBold'>组件属性</div>
    <el-form>
      <component
        v-for='item in currentElementProps'
        :key='item'
        :is="'attr-qk-' + item"
        v-bind.sync='activeElement.propsValue'
      />
    </el-form>
  </div>
</template>

<script>
import attrComponents from './index.js';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    ...attrComponents,
  },
  computed: {
    ...mapState({
      projectData: state => state.template.projectData,
      activePageUUID: state => state.template.activePageUUID,
      activeElementUUID: state => state.template.activeElementUUID,
      activeAttrEditCollapse: state => state.template.activeAttrEditCollapse,
      
    }),
    ...mapGetters('template', ['currentPageIndex', 'activeElementIndex', 'activeElement', 'activePage']),
    /**
     * 当前选中元素需要编辑得 props 列表
     */
    currentElementProps() {
      // console.log(this.activeElement)
      if (!this.activeElement.propsValue) {
        return [];
      }
      let keyList = Object.keys(this.activeElement.propsValue);
      let editPropsComponentNameList = Object.keys(attrComponents);
      // 过滤掉找不到对应attr props编辑组件的key
      keyList = keyList.filter(v => {
        return editPropsComponentNameList.includes('attr-qk-' + v);
      });
      return keyList;
    },
  },
  watch: {

  },
  data() {
    return {
      tempType: [],
      tag: {
        text: [],
        type: 1,
      }
    };
  },
  methods: {
    /**
     * tag选择事件
     */
    symbolChange() {
      const types = this.tempType;
      this.activeElement.tag.type = -1;
      console.log(this.activeElement.tag);
      const length = types.length;
      if (types.includes('企业号') && types.includes('员工') && length === 2) {
        this.activeElement.tag.type = 23;
      } else if (types.includes('员工') && length === 1) {
        this.activeElement.tag.type = 3;
      } else if (types.includes('企业号') && length === 1) {
        this.activeElement.tag.type = 2;
      } else if (types.includes('顾客') && length === 1) {
        this.activeElement.tag.type = 1;
      } else if (types.includes('顾客') && types.includes('员工') && length === 2) {
        this.activeElement.tag.type = 13;
      } else if (types.includes('顾客') && types.includes('企业号') && length === 2) {
        this.activeElement.tag.type = 12;
      } else if (types.includes('顾客') && types.includes('员工') && types.includes('企业号') && length === 3) {
        this.activeElement.tag.type = 123;
      }
      
    },
  },
};
</script>

<style scoped></style>
