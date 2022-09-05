<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="样式" name="1">
        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">尺寸：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number size="mini" v-model="activeElement.commonStyle.width" controls-position="right" :min="0" />
            <div class="attr-item-edit-input-des">宽度</div>
          </div>
          <div class="col-2 attr-item-edit-input">
            <el-input-number
              size="mini"
              v-model="activeElement.commonStyle.height"
              controls-position="right"
              :min="0"
            />
            <div class="attr-item-edit-input-des">高度</div>
          </div>
        </div>

        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">位置：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number size="mini" v-model="activeElement.commonStyle.left" controls-position="right" />
            <div class="attr-item-edit-input-des">X</div>
          </div>
          <div class="col-2 attr-item-edit-input">
            <el-input-number size="mini" v-model="activeElement.commonStyle.top" controls-position="right" />
            <div class="attr-item-edit-input-des">Y</div>
          </div>
         
        </div>
        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">旋转：</p>
          <div class="col-1 attr-item-edit-input">
            <el-slider
              v-model="activeElement.commonStyle.rotate"
              @change="throttleAddHistory"
              show-input
              :min="-180"
              :max="180"
              :marks="{ 0: '', 90: '', '-90': '' }"
              input-size="mini"
            ></el-slider>
          </div>
        </div>

        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">透明度：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.opacity"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item title="字体：" name="4">
        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">字体颜色：</p>
          <div class="attr-item-edit-input">
            <el-color-picker
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.color"
            ></el-color-picker>
          </div>
        </div>

        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">字体大小：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.fontSize"
              controls-position="right"
              :min="0"
            />
          </div>
        </div>

        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">字体粗细：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.fontWeight"
              controls-position="right"
              :min="300"
              :step="100"
              :max="900"
            />
          </div>
        </div>

        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">字间距：</p>
          <div class="col-2 attr-item-edit-input">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.letterSpacing"
              controls-position="right"
              :min="0"
            />
          </div>
        </div>
        <div class="attr-item-edit-wrapper">
          <p class="attr-item-title">对齐方式：</p>
          <div class="sizeAndPosition-wrapper">
            <div class="align-type-item clearFlex" @click="handleTextAlignClick('left')">
              <el-tooltip effect="dark" content="左对齐" placement="bottom">
                <i class="iconfont iconzuoduiqi1"></i>
              </el-tooltip>
            </div>
            <div class="align-type-item clearFlex" @click="handleTextAlignClick('center')">
              <el-tooltip effect="dark" content="居中对齐" placement="bottom">
                <i class="iconfont iconjuzhongduiqi"></i>
              </el-tooltip>
            </div>
            <div class="align-type-item clearFlex" @click="handleTextAlignClick('right')">
              <el-tooltip effect="dark" content="右对齐" placement="bottom">
                <i class="iconfont iconyouduiqi2"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { ceil, subtract, divide, throttle } from "lodash";

export default {
  data() {
    return {
      activeNames: ["1"],
      alignTypeList: [
        {
          title: "左对齐",
          icon: "iconfont iconzuoduiqi",
          type: "l"
        },
        {
          title: "上对齐",
          icon: "iconfont iconshangduiqi",
          type: "t"
        },
        {
          title: "右对齐",
          icon: "iconfont iconyouduiqi",
          type: "r"
        },
        {
          title: "下对齐",
          icon: "iconfont iconxiaduiqi",
          type: "b"
        },
        {
          title: "垂直居中对齐",
          icon: "iconfont iconchuizhijuzhongduiqi",
          type: "tb"
        },
        {
          title: "水平居中对齐",
          icon: "iconfont iconshuipingjuzhongduiqi",
          type: "lr"
        }
      ],
      // 'none', 'solid', 'dashed', 'dotted', 'double'
      borderStyleList: [
        {
          label: "实线",
          value: "solid"
        },
        {
          label: "虚线",
          value: "dashed"
        },
        {
          label: "点状",
          value: "dotted"
        },
        {
          label: "双线",
          value: "double"
        }
      ],
      boxShadow: {
        h: 0,
        v: 0,
        blur: 0,
        spread: 0,
        color: "#000000"
      }
    };
  },
  computed: {
    ...mapState({
      projectData: state => state.editor.projectData,
      activePageUUID: state => state.editor.activePageUUID,
      activeElementUUID: state => state.editor.activeElementUUID,
      activeAttrEditCollapse: state => state.editor.activeAttrEditCollapse
    }),
    ...mapGetters(["currentPageIndex", "activeElementIndex", "activeElement", "activePage"])
  },
  watch: {
    activeElementUUID() {
      // 设置boxShadow
      this.$nextTick(() => {
        this.initBoxShadowEdit();
      });
    },
    activeNames() {
      this.$store.commit("updateActiveAttrEditCollapse", this.activeNames);
    }
  },
  created() {
    this.throttleAddHistory = throttle(this.addHistory, 3000);
  },
  mounted() {
    this.initBoxShadowEdit();
    this.activeNames = this.activeAttrEditCollapse;
  },
  methods: {
    /**
     * 纪录一条历史纪录
     * */
    addHistory() {
      // console.log('common style change addHistoryCache')
      this.$store.dispatch("addHistoryCache");
    },
    /**
     *
     * @param type
     */
    changeAlignType(type) {
      let canvasW = this.$config.canvasH5Width;
      let canvasH = this.$config.canvasH5Height;
      let eleW = this.activeElement.commonStyle.width;
      let eleH = this.activeElement.commonStyle.height;

      switch (type) {
        case "t":
          this.activeElement.commonStyle.top = 0;
          break;
        case "b":
          this.activeElement.commonStyle.top = subtract(canvasH - eleH);
          break;
        case "l":
          this.activeElement.commonStyle.left = 0;
          break;
        case "r":
          this.activeElement.commonStyle.left = subtract(canvasW - eleW);
          break;
        case "tb":
          this.activeElement.commonStyle.top = ceil(divide(subtract(canvasH - eleH), 2), 2);
          break;
        case "lr":
          this.activeElement.commonStyle.left = ceil(divide(subtract(canvasW - eleW), 2), 2);
          break;
      }
    },
    /**
     * 初始化阴影编辑对象
     */
    initBoxShadowEdit() {
      let boxShadow = this.activeElement.commonStyle.boxShadow;
      let boxShadowEditConfig = {
        h: 0,
        v: 0,
        blur: 0,
        spread: 0,
        color: "#000000"
      };
      if (!boxShadow || boxShadow === "none") {
        this.boxShadow = boxShadowEditConfig;
        return;
      }
      let str = boxShadow.split(" ");

      boxShadowEditConfig = {
        h: parseInt(str[0].replace("px", "")),
        v: parseInt(str[1].replace("px", "")),
        blur: parseInt(str[2].replace("px", "")),
        spread: parseInt(str[3].replace("px", "")),
        color: str[4]
      };
      this.boxShadow = boxShadowEditConfig;
    },
    boxShadowChange() {
      let str = `${this.boxShadow.h}px ${this.boxShadow.v}px  ${this.boxShadow.blur}px  ${this.boxShadow.spread}px  ${this.boxShadow.color}`;
      this.activeElement.commonStyle.boxShadow = str;
    },
    /**
     * 字体样式设置对齐方式
     * @param str
     */
    handleTextAlignClick(str) {
      this.activeElement.commonStyle.textAlign = str;
    },
    /**
     * 字体样式设置对齐方式
     * @param str
     */
    handleResizeClick(type) {
      if (type.includes("w")) {
        this.activeElement.commonStyle.left = 0;
        this.activeElement.commonStyle.width = this.$config.canvasH5Width;
      }
      if (type.includes("h")) {
        this.activeElement.commonStyle.top = 0;
        this.activeElement.commonStyle.height = this.$config.canvasH5Height;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sizeAndPosition-wrapper {
  display: flex;
  width: 100%;
}

.align-type-item {
  flex: 1;
  cursor: pointer;
  text-align: center;
  &.clearFlex {
    width: 42px;
    flex: none;
  }
  i {
    line-height: 1;
    display: inline-block;
    padding: 6px;
    border-radius: 4px;
    background: rgba(37, 165, 137, 0.08);
  }
  &:hover {
    i {
      color: white;
      background: $primary;
    }
  }
}

.attr-item-edit-wrapper {
  padding-left: 18px;
  display: flex;
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
  .attr-item-title {
    text-align: left;
    min-width: 60px;
    font-size: 12px;
  }
  .attr-item-edit-input {
    &.col-2 {
      width: 90px;
      margin-left: 10px;
    }
    &.col-1 {
      width: 250px;
    }
    &.col-3 {
      width: 60px;
      margin-left: 10px;
    }
    &.col-4 {
      width: 50px;
      margin-left: 10px;
    }
    .attr-item-edit-input-des {
      text-align: center;
      line-height: 1;
      margin-top: 2px;
      font-size: 12px;
      color: $gray;
    }
  }
}
</style>
<style lang="scss">
.attr-item-edit-wrapper {
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
    padding-right: 32px;
    width: 90px;
  }
  .el-input-number--mini {
    width: 90px;
  }
  .el-slider__runway.show-input {
    margin-right: 108px;
  }
}
</style>
