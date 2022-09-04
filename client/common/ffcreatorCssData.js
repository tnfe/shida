//FFCreator中尚未实现的animation动画,用来过滤视搭页面不能使用的动画
let filtersAnimation =
  {
    label: "未实现",
    children: [
      {label: "光速进入", value: "lightSpeedIn"},
      {label: "Y轴旋转", value: "flip"},
      {label: "中心X轴旋转", value: "flipInX"},
      {label: "中心Y轴旋转", value: "flipInY"},
      {label: "左长半径旋转", value: "rollIn"},
      {label: "弹跳", value: "bounce"},
      {label: "闪烁", value: "flash"},
      {label: "放大缩小", value: "pulse"},
      {label: "放大缩小弹簧", value: "rubberBand"},
      {label: "左右晃动", value: "shake"},
      {label: "左右小幅晃动", value: "headShake"},
      {label: "左右扇形摇摆", value: "swing"},
      {label: "放大晃动缩小", value: "tada"},
      {label: "扇形摇摆", value: "wobble"},
      {label: "左右上下晃动", value: "jello"},
      {label: "Y轴旋转", value: "flip"},
      {label: "光速进出", value: "lightSpeedOut"},
      {label: "中心X轴旋转", value: "flipOutX"},
      {label: "中心Y轴旋转", value: "flipOutY"},
    ]
  };

export default filtersAnimation;