<template>
  <div class='image-select-wrapper'>
    <div class='image-select-l'>
      <div class='component-image-select'>
        <el-upload
          action='#'
          class='avatar-uploader'
          :show-file-list='false'
          :on-success='handleSuccess'
          :before-upload='beforeUpload'
        >
          <span v-if="type === 'image'">
            <img :src='imageUrl' v-if='value' />
            <i v-else class='el-icon-plus icon-size'></i
            ></span>
          <span v-else-if="type === 'music'"> <i class='el-icon-service icon-size'></i></span>
          <span v-else-if="type === 'video'"> <i class='el-icon-upload icon-size'></i></span>
        </el-upload>
      </div>
    </div>
    
    <div class='image-select-r'>
      <div class='title'>{{ imageUrl }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'image',
    },
  },
  data() {
    return {
      getUrl() {
        if (/^(http||https||www)/gi.test(this.value)) return this.value;
        return document.location.origin + this.value;
      },
    };
  },
  created() {
  },
  computed: {
    imageUrl() {
      if (this.value.includes('static')) return this.value;
      return 'resource' + this.value.split('resource')[1];
    },
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 200) {
        this.$emit('input', res.body.url);
        this.$emit('uploaded', res.body.url);
        this.$emit('getPostPath', res.body.url);
      }
    },
    beforeUpload(file) {
      const { type } = this;
      const ext = file.name.split('.').pop();
      if (type === 'image') {
        if (ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'jpeg') {
          //return true;
        } else {
          this.$message({ message: '格式不支持哦!', type: 'warning' });
          return false;
        }
      } else if (type === 'music') {
        if (ext === 'mp3' || ext === 'wav' || ext === 'wma' || ext === 'aac') {
          //return true;
        } else {
          this.$message({ message: '格式不支持哦!', type: 'warning' });
          return false;
        }
      } else if (type === 'video') {
        if (ext === 'mp4' || ext === 'avi' || ext === 'mov' || ext === 'mpeg') {
          //return true;
        } else {
          this.$message({ message: '格式不支持哦!', type: 'warning' });
          return false;
        }
      }
      
      const params = new FormData();
      params.append('file', file);
      params.append('id',String(this.$route.query.id))
      // console.log(typeof this.$route.query.id)
      this.$API.uploadFile(params).then(res => {
        this.handleSuccess(res, file);
      });
      return false;
    },
  },
};
</script>

<style lang='scss' scoped>
.component-image-select {
  width: 108px;
  height: 108px;
  border: 1px dashed $primary;
  border-radius: 3px;
  margin-bottom: 18px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.28s;
  position: relative;
  background: #eee 50% / contain no-repeat;
  justify-content: center;
  align-items: center;
  display: flex;
  
  .icon-size {
    font-size: 32px;
  }
  
  &:hover {
    color: $primary;
  }
  
  img {
    display: inline-block;
    max-width: 100%;
    max-height: 100%;
  }
  
  p {
    line-height: 1;
    padding-bottom: 10px;
  }
}

.image-preview-null {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 25px;
  background: rgba(0, 0, 0, 0.2);
}

.image-select-wrapper {
  display: flex;
  
  .image-select-l {
    width: 108px;
  }
  
  .image-select-r {
    flex: 1;
    margin-left: 10px;
    
    .title {
      width: 160px;
      word-break: break-word;
      color: #3eac93;
      line-height: 20px;
      font-size: 12px;
    }
  }
}
</style>
