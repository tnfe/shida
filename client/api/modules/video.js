import $axios from "@/service/httpServer";

export const beginMakeVideo = p => $axios.post("/quark/video/making", p);

export const getVideoPercent = p => $axios.get("/quark/video/progress", p);
//todo-制作视频/获取进度
export const templateBeginMakeVideo = p => $axios.post("/quark/video/templateMaking", p);
export const templateGetVideoPercent = p => $axios.get("/quark/video/templateGetProgress", p);