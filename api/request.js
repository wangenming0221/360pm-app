import request from "./http.js"
// post
export const post = params=> request('post',params.data,params.url,'')
// get
export const get = params => request('get',params.data,params.url,'')
//josn
export const jsonPost = params=> request('post',params.data,params.url,'json')
