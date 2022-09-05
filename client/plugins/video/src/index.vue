<!--test.vue-->
<template>
  <div class='qk-video'>
<!--    <video :src='videoUrl' v-if='videoSrc' autoplay></video>-->
    <img src='/static/demo/video.jpg' alt=''/>
  </div>
</template>

<script>
export default {
  name: 'QkVideo', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    videoSrc: {
      type: String,
      default: '/static/demo/demo.mp4',
    },
  },
  computed: {
    videoUrl() {
      if (this.videoSrc.includes('static')) return this.videoSrc;
      return 'resource' + this.videoSrc.split('resource')[1];
    },
  },
};
</script>

<style lang='scss' scoped>
.qk-video {
  width: 100%;
  height: 100%;
}

img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
