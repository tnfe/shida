<template>
  <div ref="con" class="screenshot-layer">
    <div
      v-for="(page, i) in pagesData.pages"
      :id="'slayer-p-' + i"
      :key="page.uuid"
      :style="{ width: pagesData.width + 'px', height: pagesData.height + 'px' }"
      class="slayer-page"
    >
      <div class="page-preview-wrapper" :id="'slayer-pw-' + i" :style="getCommonStyle(page.commonStyle)">
        <component
          v-for="item in page.elements"
          :key="item.uuid"
          :uuid="item.uuid"
          :id="'slayer-e-' + item.uuid"
          :defaultStyle="item.commonStyle"
          :style="
            getCommonStyle({
              ...item.commonStyle,
              width: item.commonStyle.width,
              height: item.commonStyle.height,
              left: item.commonStyle.left,
              top: item.commonStyle.top,
              position: item.commonStyle.position
            })
          "
          :is="item.elName"
          class="element-on-edit-pane"
          v-bind="item.propsValue"
        />
      </div>
    </div>
<!--    <el-dialog-->
<!--      :visible.sync="dialogVisible"-->
<!--      width="30%">-->
<!--      <span>{{projectData}}</span>-->
<!--&lt;!&ndash;      <span>{{postData}}</span>&ndash;&gt;-->
<!--    </el-dialog>-->
  </div>

</template>

<script>
import { clone, cloneDeep, forEach, isArray, isEmpty } from 'lodash';
import { mapState } from 'vuex';
import html3canvas from 'html3canvas';
import shortid from 'js-shortid';
import $ from 'cash-dom';

import { _qk_register_components_object } from '@/plugins';
import templateProjectConfig from '@client/pages/template/DataModel';
import $bus from '@client/eventBus';
import Timeout from 'await-timeout';


//todo

export default {
  name: "screenshot-layer",
  components: {
    ..._qk_register_components_object
  },
  computed: {
    ...mapState({ projectData: state => state.template.projectData })
  },
  created() {
    $bus.$on("publishTemplate", this.publishFun);
  },
  beforeDestroy() {
    $bus.$off("publishTemplate", this.publishFun);
    this.pagesData = { pages: [] };
  },
  
  data() {
    return {
      getCommonStyle: templateProjectConfig.getCommonStyle,
      pagesData: { pages: [] },
      videoData: [],
      folderId: 1,
      dialogVisible:true,
      postData:[]
    };
  },
  methods: {
    publishFun() {
      // console.log("screenshot-publishFn")
      this.reset();
      // 删掉音乐元素,并且按照z-index重新排序
      //todo -修改发布视频的数据:模板测试
      this.pagesData = templateProjectConfig.processingProjectData(this.projectData,true);
      this.videoData = templateProjectConfig.cloneToVideoData(this.projectData);
      // this.pagesData = templateProjectConfig.processingProjectData(testTemplateData);
      // this.videoData = templateProjectConfig.cloneToVideoData(testTemplateData);
      // console.log("this.projectData:",this.pagesData)
      // console.log("this.videoData:",this.videoData)
      // console.log("-------------")
      this.$nextTick(async () => {
        this.folderId = shortid.gen();
        const domIdsArr = this.groupingPagesData(this.pagesData);
        // console.log("domIdsArr:",domIdsArr)
        
        const noAniDomArr = this.rearrangeDom(domIdsArr);
        // console.log("noAniDomArr:",noAniDomArr)
        
        const result = await this.screenshotAndUpload(noAniDomArr);
        // console.log("result:",result)
        
        const videoData = this.updateVideoData(result);
        // console.log("videoData:",JSON.stringify(videoData.pages[0].elements))
        await Timeout.set(1000);
        //1
        this.postData = videoData
        await this.beginMakingVideo(videoData);
      });
    },

    /**
     * 更新并且替换 videoData
     */
    updateVideoData(result) {
      if (!result) return this.videoData; //没有直接返回

      for (let i = 0; i < result.length; i++) {
        const { id, url, localPath } = result[i];
        // console.log("-----------------------------------")
        // console.log("this.videoData:",this.videoData)
        const element = templateProjectConfig.getDataByKeyFromVideoData(this.videoData, id);//通过id获取元素
        if (element) {
          //赋值
          element.propsValue.imageSrc = url;
          element.propsValue.localPath = localPath;
        }
      }
  
  
      // console.log()
      // console.log("this.videoData:",this.videoData)
      // console.log("-----------------------------------")
      //
      //返回新的videoData
      return this.videoData;
    },

    /**
     * 开始制作视频
     */
    async beginMakingVideo(videoData) {
      // console.log(videoData);
      const res = await this.$API.templateBeginMakeVideo({ videoData, folderId: this.folderId , id: this.$route.query.id});
      if (res.code === 200) {
        const { taskId, uuid } = res.body;

        this.getProgressing({ taskId, uuid });
      }
    },

    getProgressing({ taskId, uuid }) {
      // console.log("进入progress")
      let index = 0;
      const DELAY = 1000 / 2;
      const MAX = (100 * 1000) / DELAY;
      let isCompleted = false
      const id = setInterval(async () => {
        const res = await this.$API.templateGetVideoPercent({ taskId, uuid , id: this.$route.query.id});
        if (res.code == 200) {
          const { progress, state, videoUrl } = res.body;
          this.$emit("making", { progress, state, videoUrl });

          if (state === "complete" && isCompleted === false) {
            isCompleted = true
            clearInterval(id);
            this.updateData({ videoUrl });
          }
        } else {
          clearInterval(id);
        }

        if (index > MAX) clearInterval(id);
        index++;
      }, DELAY);
    },

    updateData({ videoUrl }) {
      this.projectData.videoUrl = videoUrl;
      this.$API.templateUpdatePage({ pageData: this.projectData });
    },

    /**
     * 截图并且一起上传
     */
    async screenshotAndUpload(noAniDomArr) {
      const pfiles = [];
      for (let i = 0; i < noAniDomArr.length; i++) {//遍历所有无动画组件
        const elements = noAniDomArr[i];
        const files = await this.screenshots(elements, i);//截图,如果没有无动画组件直接返回
        if (isEmpty(files)) continue; //如果没有则终止此次循环

        for (let j = 0; j < files.length; j++) {
          const file = files[j];
          pfiles.push(file);
        }
      }

      return await this.uploadAllImages(pfiles);//上传所有图片,
    },

    async uploadAllImages(pfiles) {
      if (isEmpty(pfiles)) return; //没有截图,直接返回

      const params = new FormData();
      forEach(pfiles, (file, index) => {
        params.append(`file${index}`, file.file);
        
        params.append(`data${index}`, file.id);
      });
      params.append("folder", this.folderId);
      params.append('id', String(this.$route.query.id))

      const res = await this.$API.uploadMultipleImages(params);
      if (res.status) {
        return res.body;
      }

      return null;
    },

    /**
     * 截图 - 同时截取一个page下的多个容器元素
     */
    async screenshots(elements, i) {
      if (isEmpty(elements)) return; //如果没有无动画组件,直接返回

      const el = this.$refs.con;
      const { width, height } = this.pagesData;
      const size = elements.map(x => [width, height]);

      const canvass = await html3canvas(el, {
        elements,
        size,
        scale: 1,
        x: 0,
        y: 0,
        allowTaint: true,
        removeContainer: true,
        backgroundColor: null,
        proxy: "/quark/html2canvas/corsproxy"
      });

      const files = [];
      forEach(canvass, (canvas, j) => {
        const name = `image-${i}-${j}`;
        const file = this.$mUtils.canvasToFile({ name, canvas, quality: 0.9, type: "png" });
        files.push(file);
      });

      return files;
    },

    /**
     * 按照元素是否有动画分组 形如：[[0, 1, 2], 3, 4, [5, 6]]
     *
     * 1、没有动画的都合并到一张图片 -> [0, 1, 2]
     * 2、有动画的独立保存 -> 3, 4
     * 3、填充videoData
     */
    groupingPagesData(pagesData) {
      const domIdsArr = [];
      const donotMergeLayer = ele => {
        let isGIF = false
        if(ele.elName === 'qk-image') {
          console.log( ele.propsValue.imageSrc)
          const ext = ele.propsValue.imageSrc.split('.').pop()
          if(ext === 'gif')
            isGIF = true
        }
        // console.log(!isEmpty(ele.animations))
        return !isEmpty(ele.animations) || ele.elName === "qk-video" || ele.elName === "qk-image-carousel"||ele.elName === 'qk-text' || isGIF;
      };

      for (let i = 0; i < pagesData.pages.length; i++) {
        const page = pagesData.pages[i];
        const videoPage = this.videoData.pages[i];
        const pageArr = [];
        let eleArr = [];
        let index = 0;

        // 添加-无动画的元素合
        const pushSubArr = () => {
          if (!isEmpty(eleArr)) { //如果元素数组非空
            pageArr.push(clone(eleArr));//添加到pageArr
            videoPage.elements.push({ //向videoPage中添加图片元素
              elName: "qk-image",
              isFFImage: true,
              index,
              commonStyle: {
                width: pagesData.width,
                height: pagesData.height
              },
              key: `image-${i}-${index}`,
              propsValue: { imageSrc: null }
            });

            index++;
          }
          eleArr.length = 0;
        };

        // 遍历元素处理
        for (let j = 0; j < page.elements.length; j++) {
          const ele = page.elements[j];
          //如果是true:是 动画/视频/轮播图
          if (donotMergeLayer(ele)) {
            pushSubArr();
            pageArr.push(ele.uuid); // 把元素uuid放入pageArr
            videoPage.elements.push(cloneDeep(ele)); //把这个元素放入videoPage中
          } else {
            eleArr.push(ele.uuid); //存入eleArr
          }
        }

        pushSubArr();
        domIdsArr.push(pageArr);
      }

      return domIdsArr;
    },

    /**
     * 重排dom
     * 1、没有动画的并相邻的放到一个容器div下
     * 2、有动画的隐藏
     * 3、返回 无动画组件 的容器组合
     * 形如 [[div1, div2], [div3, div4, div5]]
     */
    rearrangeDom(domIdsArr) {
      const noAniDomArr = [];
      const con = this.$refs.con;

      for (let i = 0; i < domIdsArr.length; i++) {
        const eleArr = domIdsArr[i];
        const domArr = [];
        noAniDomArr.push(domArr);

        for (let j = 0; j < eleArr.length; j++) {
          const eles = eleArr[j];
          if (isArray(eles)) {
            // 合并
            const elesCon = this.createElesCon(j);
            $(con)
              .find(`#slayer-pw-${i}`)
              .append(elesCon);
            domArr.push(elesCon.get(0));

            for (let k = 0; k < eles.length; k++) {
              elesCon.append($(con).find(`#slayer-e-${eles[k]}`));
            }
          } else {
            // 隐藏
            $(con)
              .find(`#slayer-e-${eles}`)
              .css("display", "none");
          }
        }
      }

      return noAniDomArr;
    },

    /**
     * 创建一个临时容器
     */
    createElesCon(index = 99) {
      const { width, height } = this.pagesData;

      return $("<div></div>")
        .addClass("slayer-page page-con")
        .css({
          width: width + "px",
          height: height + "px",
          zIndex: index + 100,
          position: "absolute",
          overflow: "hidden",
          top: 0,
          left: 0
        });
    },

    reset() {
      this.pagesData = { pages: [] };
      this.videoData = [];
    }
  }
};
</script>

<style scoped>
.screenshot-layer {
  /* visibility: hidden; */
  position: fixed;
  z-index: 9999;
  top: -9999px;
  left: -9999px;
}

.slayer-page {
  display: block;
  float: left;
  overflow: hidden;
}

.page-preview-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
