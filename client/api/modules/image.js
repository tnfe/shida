/*
 * image 图片库
 **/
import $axios from "@/service/httpServer";

export const getMyImages = p => $axios.get("/quark/imageLib/myImages", p);
export const uploadImage = p => $axios.post("/quark/imageLib/upload", p);
export const uploadMultipleImages = p => $axios.post("/quark/images/uploadMultipleImages", p);
//todo-图片上传
export const templateUploadMultipleImages = p => $axios.post("/quark/images/templateUploadMultipleImages", p);
export const uploadCommonImage = p => $axios.post("/quark/imageCommon/upload", p);
export const uploadFile = p => $axios.post("/quark/file/upload", p);
