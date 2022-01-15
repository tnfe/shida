import $axios from "@/service/httpServer";

export const beginMakeVideo = p => $axios.post("/quark/video/making", p);
export const getVideoPercent = p => $axios.get("/quark/video/progress", p);
