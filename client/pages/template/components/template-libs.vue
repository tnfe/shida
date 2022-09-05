<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <p class="page-title text-center">新建模板
      <el-tooltip class="item" effect="dark" content="新增一页" placement="top-start">
        <el-button class="add-button" type="primary" icon="el-icon-plus" circle size="small" @click="addPage()"></el-button>
      </el-tooltip>
    </p>

    <!--    <el-input v-model="text" @change="inputChangeText"></el-input>-->
    <!--    <el-input v-model="img" @change="inputChangeImg"></el-input>-->
    <el-scrollbar style="height: 100%;">
      <div
        class="page-item clearfix"
        v-for="(item, index) in projectData.pages"
        :key="item.uuid"
        @click="changeActivePage(item)"
        :class="{ active: activePageUUID === item.uuid }"
      >
        <div class="inline-block">
          <span class="page-item-index">{{ index + 1 }}</span>
          第{{ index + 1 }}页
        </div>
        <div class="page-item-btn-wrapper pull-right width20">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="btn-item" @click="copyPage(item)"><i class="el-icon-document-copy"></i> 复制页面</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="btn-item" @click="addPage(item)"><i class="el-icon-document-add"></i> 新增页面</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="btn-item" @click="deletePage(item)"><i class="el-icon-delete"></i> 删除页面</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <ul class="scrollbar-wrapper">
        <li v-for="(item, index) in componentsList" :key="index" class="clearfix paddingB30">
          <div class="components-libs-title">
            <p>{{ item.title }}</p>
          </div>
          <div v-if="item.components && item.components.length">
            <div
              class="components-lib-item"
              v-for="(element, i) in item.components"
              :key="i"
              @click="handleClick(element)"
            >
              <div class="lib-item-img"><i :class="[element.icon]"></i></div>
              <p class="lib-item-title">{{ element.title }}</p>
            </div>
          </div>
          <div v-else>
            <p class="gray text-center paddingT20">待完善...</p>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  
  </div>
</template>

<script>
import {camelCase} from "lodash";
import eleConfig from "../ele-config";
import {_qk_register_components_object} from "@/plugins";

window._qk_register_components_object = _qk_register_components_object;

//todo
import testTemplateData from '../test.json'
import {mapState} from "vuex";
//比如开放xx模板的xx属性可自定义

export default {
  name: "component-libs",
  computed: {
    ...mapState({
      projectData: state => state.template.projectData,
      activePageUUID: state => state.template.activePageUUID,
      activeElementUUID: state => state.template.activeElementUUID
    })
  },
  data() {
    return {
      componentsList: eleConfig,
      text: testTemplateData.pages[0].elements[2].propsValue.text,
      img: testTemplateData.pages[0].elements[0].propsValue.imageSrcList
    };
  },
  methods: {
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick(item) {
      let props = this.getComponentProps(item.elName);
      this.$store.dispatch("template/addElement", {...item, needProps: props});
      // console.log(testTemplateData.pages[0])
    },
    /**
     * 根据elname获取组件默认props数据
     * @param elName
     */
    getComponentProps(elName) {
      let elComponentData;
      for (let key in _qk_register_components_object) {
        if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
          elComponentData = _qk_register_components_object[key];
          // console.log(elComponentData)
          break;
        }
      }
      if (!elComponentData) return {};
      
      let props = {};
      for (let key in elComponentData.props) {
        props[key] = [Object, Array].includes(elComponentData.props[key].type)
          ? elComponentData.props[key].default()
          : elComponentData.props[key].default;
      }
      return props;
    },

    /**
     * 新建模板中的添加页面
     * @param item
     */
    addPage(item) {
      this.$store.dispatch("template/addPage", item ? item.uuid : "");
    },
    copyPage(item) {
      this.$store.dispatch("template/copyPage", item.uuid);
    },
    deletePage(item) {
      if(this.activePageUUID === item.uuid && this.projectData.pages.length>1) {
        // console.log("vue:",this.projectData.pages.indexOf(item));
        this.$store.dispatch("template/setActivePageUUID", this.projectData.pages[this.projectData.pages.indexOf(item)-1].uuid);
      }
      this.$store.dispatch("template/deletePage", item.uuid);
    },
    /**
     * 切换选中页面
     * @param item
     */
    changeActivePage(item) {
      this.$store.dispatch("template/setActivePageUUID", item.uuid);
    },
  
    //--------------------------------------------------------------------------------------//
    /**
     *todo - 测试模板数据
     *
     */
    inputChangeText() {
      testTemplateData.pages[0].elements[2].propsValue.text = this.text
    },
    inputChangeImg() {
      testTemplateData.pages[0].elements[0].propsValue.imageSrcList[0] = this.img
    },
  
  }
};
</script>

<style lang="scss" scoped>
.components-libs-wrapper {
  user-select: none;
  height: 100%;
  padding-top: 60px;
  position: relative;
  
  & ul {
    padding: 10px;
  }
}

.page-title {
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
}

.components-libs-title {
  margin-bottom: 16px;
}

.components-lib-item {
  color: #424242;
  text-align: center;
  background: #f4f4f4;
  width: 80px;
  float: left;
  padding: 6px 0;
  margin: 5px;
  border: 1px solid #dddddd;
  font-size: 12px;
  cursor: pointer;
  transition: All 0.3s ease-in-out;
  
  &:hover {
    background: #fff;
    border: 1px solid $primary;
    color: $primary;
  }
  
  .lib-item-img {
  }
  
  .lib-item-title {
  }
}
.add-button {
  float: right;
  margin-right: 20px;
  margin-top: -8px;
}
</style>
<style lang="scss" scoped>
.components-page-manage {
  height: 100%;
  padding-top: 60px;
  padding-bottom: 60px;
  position: relative;
}
.page-title {
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
}
.page-item {
  height: 40px;
  line-height: 40px;
  width: 100%;
  cursor: pointer;
  transition: all 0.28s;
  border-bottom: 1px solid #e6ebed;
  background: white;
  color: #666666;
  padding: 0 10px;
  display: flex;
  & > .pull-right {
    width: 20px;
    &.custom-loading-btn {
      width: 84px;
    }
  }
  & > .inline-block {
    flex: 1;
  }
  &:hover {
    background-color: #eee;
    .page-item-btn-wrapper {
      display: block;
      opacity: 1;
    }
  }
  &.active {
    background-color: #eee;
    color: #111;
    .page-item-index {
      background: $primary;
      color: white;
    }
  }
  .page-item-index {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 12px;
    background-color: #ccc;
    color: #fff;
    margin-right: 8px;
  }
  .page-item-btn-wrapper {
    .btn-item {
      display: inline-block;
      padding: 4px 4px;
      font-size: 18px;
      transition: all 0.28s;
      &:hover {
        color: $primary;
        transform: scale(1.05);
      }
    }
  }
}
.bottom-btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 60px;
  text-align: center;
  width: 100%;
  padding-top: 12px;
}
</style>