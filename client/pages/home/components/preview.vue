<template>
  <div>
    <previewWrapper
      :pageData="pageData"
      :videoUrl="pageData.videoUrl"
      :showVideo="!!pageData.videoUrl"
      @closePanel="closePanel"
    />
    <el-dialog title="提示" :visible.sync="showDialog" width="30%" :before-close="handleClose">
      <span>暂时没有合成视频</span>
    </el-dialog>
  </div>
</template>

<script>
import previewWrapper from "@client/components/preview-wrapper";

export default {
  components: {
    previewWrapper
  },
  props: {
    pageId: String
  },
  data() {
    return {
      pageData: { videoUrl: null },
      showDialog: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    closePanel() {
      this.$emit("closePreview", false);
    },
    getData() {
      this.pageData = { videoUrl: null };
      this.loading = true;
      this.$API
        .getPageDetail({ pageId: this.pageId })
        .then(res => {
          this.pageData = res.body;
          if (!this.pageData.videoUrl) this.showDialog = true;
        })
        .catch(() => {
          this.showDialog = true;
        });
    },
    handleClose() {
      this.closePanel();
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-info-wrapper {
  padding: 30px 30px 60px;
  font-size: 16px;
}

.page-info {
  display: flex;
  padding: 12px;
  background-color: #f0f3f4;
  .page-cover {
    width: 80px;
    height: 80px;
    overflow: hidden;
  }
  .page-title-des {
    padding-left: 20px;
    flex: 1;
  }
}
.info-form-wrapper {
  display: flex;
  padding-bottom: 16px;
  .info-form-l {
    line-height: 42px;
    &.com-width {
      width: 120px;
    }
  }
  .info-form-r {
    flex: 1;
    padding-left: 10px;
  }
}
.share-wx-config-wrapper {
  margin-top: 14px;
  padding: 12px;
  background-color: #f0f3f4;
}
</style>
