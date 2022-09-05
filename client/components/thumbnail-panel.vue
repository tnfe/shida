<template>
  <div class='page-thumbnail-panel' v-loading='loading' v-if='pageData'>
    <div class='thumbnail-panel-cover'>
      <div class='header-mask'>
        <div class='details-btn' @click='preview(pageData._id)'>预览</div>
      </div>
      <div class='image-wrapper'>
        <img :src='pageData.coverImage || defaultCoverImage' alt />
      </div>
    </div>
    
    <div class='page-item-title border-T ellipsis'>
      <span class='item-title-i' :title='pageData.title'>{{ pageData.title || '未命名作品' }}</span>
    </div>
    <div class='border-T thumbnail-panel-btn' v-if='btnList.length'>
      <div class='btn-wrapper' v-if="btnList.includes('edit')">
        <el-button type='text' size='mini' @click='edit'>编辑</el-button>
      </div>
      <div class='btn-wrapper' v-if="btnList.includes('useTemplate')">
        <el-button type='text' size='mini' @click='copyPage'>使用模板</el-button>
      </div>
      <div class='btn-wrapper' v-if="btnList.includes('copyTemplate')">
        <el-button type='text' size='mini' @click='copyPage'>复制</el-button>
      </div>
      <div class='btn-wrapper' v-if='showMoreBtn'>
        <el-dropdown @command='command' placement='top-start'>
          <el-button type='text' size='mini'>
            更多
            <i class='el-icon-more-outline'></i>
          </el-button>
          <el-dropdown-menu>
            <template v-for='(item, index) in operationDataList'>
              <el-dropdown-item :key='index' :command='item.eventType' v-if='btnList.includes(item.eventType)'>
                <div :class='item.extraClassName'>{{ item.title }}</div>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
  
  <div class='page-thumbnail-panel create' v-loading='loading' v-else>
    <div class='temp-create' @click='newPage(isTemplate)'>
      <i class='el-icon-plus'></i>
      <p class='paddingT10' v-if='!isTemplate'>新建页面</p>
      <p class='paddingT10' v-else>新建模板</p>
    </div>
  </div>
</template>

<script>
import { Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
import editorProjectConfig from '@/pages/editor/DataModel';
import addCooperationer from '@/components/add-cooperationer/index.js';

export default {
  props: {
    showPublishState: {
      type: Boolean,
      default: true,
    },
    showMoreBtn: {
      type: Boolean,
      default: true,
    },
    pageType: {
      type: String,
      default: 'h5',
    },
    pageData: Object,
    // 操作按钮显示哪些按钮  根据type来匹配。
    btnList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  created() {
    if(this.$router.history.current.name === 'myTemplate'){
      this.isTemplate = true
    }else if(this.$router.history.current.name === 'pageList'){
      this.isTemplate = false
    }
  },
  data() {
    return {
      isTemplate:true,
      loading: false,
      defaultCoverImage: require('@/common/images/pagecover.jpg'),
      operationDataList: [
        {
          title: '设为我的模板',
          eventType: 'setTemplate',
          iconClass: '',
        },
        {
          title: '协作设置',
          eventType: 'cooperation',
          iconClass: '',
        },
        {
          title: '删除',
          eventType: 'delete',
          extraClassName: 'error',
          iconClass: '',
        },
        {
          title: '退出协作',
          eventType: 'unCooperation',
          extraClassName: 'error',
          iconClass: '',
        },
      ],
    };
  },
  
  methods: {
    command(type) {
      switch (type) {
        case 'publish':
          this.publish();
          break;
        
        case 'copyUrl':
          this.copyUrl();
          break;
        
        case 'setTemplate':
          this.setTemplate();
          break;
        
        case 'viewPageData':
          this.viewPageData();
          break;
        
        case 'cooperation':
          this.cooperation();
          break;
        
        case 'delete':
          this.delete();
          break;
        
        case 'unCooperation':
          this.unCooperation();
          break;
        
        case 'publishTemplate':
          this.publishTemplate();
          break;
      }
    },
    
    // 新建页面
    newPage(isTemplate) {
      
      let newPageData = editorProjectConfig.getProjectConfig();
      newPageData.isTemplate = isTemplate;
      this.loading = true;
      this.$API
        .createPage({ ...newPageData })
        .then(res => {
          this.loading = false;
          if (res.body) {
            if (!isTemplate) {
              this.$router.push({ name: 'Editor', query: { id: res.body._id } });
            } else {
              this.$router.push({ name: 'Template', query: { id: res.body._id }, params:{type: 'newTemplate'} });
            }
            
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    
    // 编辑
    edit() {
      if (!this.isTemplate) {
        this.$router.push({ name: 'Editor', query: { id: this.pageData._id } });
      } else {
        this.$router.push({ name: 'Template', query: { id: this.pageData._id }, params:{type: 'editTemplate'} });
      }
    },
    
    // 复制页面
    copyPage() {
      this.loading = true;
      if (this.isTemplate){
        this.$API
          .copyPage({ id: this.pageData._id })
          .then(res => {
            this.loading = false;
            this.$router.push({ name: 'Template', query: { id: res.body._id } , params:{type: 'useTemplate'}});
          })
          .catch(() => {
            this.loading = false;
          });
      }else {
        this.$API
          .copyPage({ id: this.pageData._id })
          .then(res => {
            this.loading = false;
            this.$router.push({ name: 'Editor', query: { id: res.body._id } });
          })
          .catch(() => {
            this.loading = false;
          });
      }
     
    },
    
    // 发布 ----
    publish() {
      this.loading = true;
      this.$API
        .publishPage({ id: this.pageData._id })
        .then(() => {
          this.loading = false;
          this.$message.success('发布成功');
          this.preview(this.pageData._id);
          this.$emit('refresh');
        })
        .catch(() => {
          this.loading = false;
        });
    },
    
    // 预览
    preview(id) {
      this.$emit('showPreview', id);
    },
    
    // 复制链接
    copyUrl() {
    },
    
    // 设为我的模板
    setTemplate() {
      this.loading = true;
      this.$API
        .setTemplatePage({ id: this.pageData._id })
        .then(() => {
          this.loading = false;
          this.$message.success('已添加到我的模板');
        })
        .catch(() => {
          this.loading = false;
        });
    },
    
    // 页面数据
    viewPageData() {
      this.$router.push({
        name: 'pageDataDetail',
        query: { id: this.pageData._id },
      });
    },
    
    // 协作设置
    cooperation() {
      addCooperationer(this.pageData._id);
    },
    
    // 删除
    delete() {
      this.$alert('确认删除页面？删除后，将无法访问此页面?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$API.deletePage({ id: this.pageData._id }).then(() => {
          this.$message.success('删除成功！');
          this.$emit('refresh');
        });
      });
    },
    
    // 退出协作
    unCooperation() {
      this.$alert('确认退出协作编辑？退出后，将无法编辑此页面?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$API
          .delCooperation({
            pageId: this.pageData._id,
            userId: this.$store.state.user.userInfo._id,
          })
          .then(() => {
            this.$message.success('已退出！');
            this.$emit('refresh');
          });
      });
    },
    
    // 发布模板到模板市场
    publishTemplate() {
      this.loading = true;
      this.$API
        .publishPage({ id: this.pageData._id })
        .then(() => {
          this.loading = false;
          this.$message.success('发布成功');
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.page-thumbnail-panel {
  width: 200px;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: all 0.28s;
  
  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
    transform: translate3d(0, -2px, 0);
    
    .header-mask {
      opacity: 1;
    }
  }
  
  .header-mask {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    border-radius: 4px 4px 0 0;
    padding-top: 92px;
    text-align: center;
    transition: top 0.28s ease, opacity 0.28s ease, height 0.28s ease;
    
    .details-btn {
      display: inline-block;
      width: 120px;
      height: 44px;
      font-size: 18px;
      line-height: 44px;
      border-radius: 22px;
      border: 1px solid #fff;
      color: #fff;
      cursor: pointer;
    }
  }
}

.thumbnail-panel-cover {
  flex: 1;
  position: relative;
  
  .image-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 5px;
    z-index: 10;
    
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

.page-item-title {
  height: 36px;
  line-height: 36px;
  padding: 0 8px;
  font-size: 14px;
}

.thumbnail-panel-btn {
  height: 36px;
  width: 100%;
  display: flex;
  flex-direction: row;
  
  .btn-wrapper {
    flex: 1;
    text-align: center;
  }
}

.unpublish {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 12px;
  display: block;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  background-color: #76838f;
  color: #fff;
  border-top-left-radius: 4px;
  border-bottom-right-radius: 12px;
  z-index: 10;
}

.page-thumbnail-panel.create {
  padding: 16px;
  text-align: center;
  
  .temp-create {
    display: inline-block;
    width: 100%;
    height: 100%;
    border: 1px solid #e6ebed;
    border-radius: 3px;
    padding-top: 100px;
    transition: all 0.28s;
    cursor: pointer;
    
    &:hover {
      color: $primary;
      border-color: $primary;
    }
  }
  
  .null-create {
    display: inline-block;
    width: 100%;
    height: 42px;
    line-height: 42px;
    border: 1px solid #4a4e52;
    transition: all 0.28s;
    cursor: pointer;
    
    &:hover {
      color: $primary;
      border-color: $primary;
    }
  }
}
</style>
