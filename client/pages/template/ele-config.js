import $config from "@client/config";

export default [
  {
    title: "基础组件",
    components: [
      {
        elName: "qk-text",
        title: "文字",
        icon: "iconfont iconwenben",
        // 每个组件设置props来展示哪些显示哪些编辑项
        valueType: "", // 标识数据类型，用于表单组件
        defaultStyle: {
          height: 40
        }
      },
      {
        elName: "qk-image",
        title: "图片",
        icon: "iconfont icontupian",
        valueType: "", // 标识数据类型，用于表单组件,
        defaultStyle: {
          height: 200
        }
      },
      {
        elName: "qk-rectangle-border",
        title: "纯色方块",
        icon: "iconfont iconjuxing",
        valueType: "",
        defaultStyle: {
          width: 200,
          height: 200
        }
      },
      {
        elName: "qk-rectangle-border",
        title: "分割线",
        icon: "iconfont icon758bianjiqi_fengexian",
        valueType: "",
        defaultStyle: {
          height: 1,
          width: 300,
          backgroundColor: "#999999"
        }
      },
      {
        elName: "qk-image-carousel",
        title: "图片相册",
        icon: "iconfont iconshouyelunbotu",
        valueType: "", // 标识数据类型，用于表单组件,
        defaultStyle: {
          height: 210
        }
      },

      {
        elName: "qk-video",
        title: "视频",
        icon: "iconfont iconshipin",
        valueType: "",
        defaultStyle: {
          width: $config.canvasH5Width,
          height: 300,
          paddingTop: 10,
          paddingBottom: 10
        }
      }
    ]
  },
  {
    title: "功能组件",
    components: [
      {
        elName: "qk-bg-music",
        title: "音乐",
        icon: "iconfont iconyinlemusic217",
        valueType: "",
        defaultStyle: {
          height: 52,
          width: 52
        }
      }
    ]
  },
  {
    title: "业务组件",
    components: []
  }
];
