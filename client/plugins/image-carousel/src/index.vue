<!--test.vue-->
<template>
  <div class="qk-image-carsousel">
    <!--异步加载轮播图的情况;-->
    <Swiper
      class="image-carsousel-swiper"
      v-if="imageSrcList.length > 0"
      :autoPlay="true"
      :showIndicator="true"
      :interval="interval * 1000"
      duration="500"
    >
      <Slide class="image-carsousel-slide" v-for="(item, index) in imageSrcList" :key="index">
        <img class="image-carsousel-image" :src="item" alt="" />
      </Slide>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, Slide } from "vue-swiper-component";
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
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.image-carsousel-swiper,
.image-carsousel-slide,
.image-carsousel-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<style>
.image-carsousel-swiper .wh_swiper {
  height: 100%;
}
</style>
