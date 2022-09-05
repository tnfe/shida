<!--test.vue-->
<template>
  <div class='qk-image-carousel'>
    <!--异步加载轮播图的情况;-->
    <Swiper
      class='image-carousel-swiper'
      v-if="imageSrcList.length > 0"
      :autoPlay="true"
      :showIndicator="true"
      :interval="interval * 1000"
      duration="500"
    >
      <Slide class='image-carousel-slide' v-for="(item, index) in carouselUrl" :key="index">
        <img class='image-carousel-image' :src="item" alt="" />
      </Slide>
    </Swiper>
  </div>
</template>

<script>
import { Slide, Swiper } from 'vue-swiper-component';

export default {
  name: "QkImageCarousel",
  components: {
    Swiper,
    Slide
  },
  props: {
    imageSrcList: {
      type: Array,
      default: () => {
        return ["/static/demo/demo.jpg", "/static/demo/demo.jpg", "/static/demo/demo.jpg"];
      }
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  computed:{
    carouselUrl() {
      const imageUrlList = []
      this.imageSrcList.forEach(imageSrc =>{
        if (imageSrc.includes('static')){
          imageUrlList.push(imageSrc);
        }else{
          imageUrlList.push( 'resource' + imageSrc.split('resource')[1])
        }
      })
      return imageUrlList
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.image-carousel-swiper,
.image-carousel-slide,
.image-carousel-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<style>
.image-carousel-swiper .wh_swiper {
  height: 100%;
}
</style>
