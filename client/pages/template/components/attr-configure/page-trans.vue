<template>
  <!-- 过渡动画 -->
  <el-select v-model="tempValue" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>

<script>
import {random} from 'lodash'

const TRNAS = [
  "随机",
  "Fat",
  "Lens",
  "Shake",
  "Slice",
  "Stretch",
  "Fluidly",
  "BackOff",
  "Oblique",
  "MoveLeft",
  "Windows4",
  "Colorful",
  "Magnifier",
  "Tetrapod",
  "Sunflower",
  "ZoomRight",
  "Radiation",
  "WaterWave",
  "HangAround",
  "FastSwitch",
  "WindowShades",
  "CircleCrop",
  "TricolorCircle",
  "Quicksand"
];

export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {
      tempValue: "",
      options: TRNAS.map(x => {
        return {value: x, label: x};
      })
    };
  },
  mounted() {
    this.tempValue = this.value;
  },
  methods: {},
  watch: {
    value(val) {
      this.tempValue = val;
    },
    tempValue() {
      //随机动画
      if (this.tempValue === "随机") {
      const randomIndex = random(0,TRNAS.length-1,false)
        this.tempValue = TRNAS[randomIndex]
        console.log(this.tempValue)
      }
      this.$emit("input", this.tempValue);
    }
  }
};
</script>

<style lang="scss" scoped></style>
