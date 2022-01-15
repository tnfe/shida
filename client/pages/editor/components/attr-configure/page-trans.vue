<template>
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
const TRNAS = [
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
        return { value: x, label: x };
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
      this.$emit("input", this.tempValue);
    }
  }
};
</script>

<style lang="scss" scoped></style>
