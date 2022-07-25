<template>
	<view class="upload" >
		<uni-transition 
			mode-class="slide-left"
		 	v-for="(item,index) in fileList" 
		 	:key="index"
			:show="item">
			<view class="box" >
				<image :src="item" mode=""></image>
				<!-- #ifdef MP-WEIXIN -->
				<view class="close" @click="remove(item)">
					<!-- <uni-icons type="close" ></uni-icons> -->
					x
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="close_app" @click="remove(item)">x</view>
				<!-- #endif -->
			</view>
		</uni-transition>
		<!-- #ifdef APP-PLUS -->
		<view class="add" @click="upLoad">
			<image :src="imgPath"></image>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<picker @change="typeSelect" :range="type">
			<view class="add">
				<image :src="imgPath"></image>
			</view>
		</picker>
		<!-- #endif -->
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import uploadImage from '@/common/ossutil/uploadFile.js';
	import messageFile from '@/common/ossutil/messageFile.png';

	const props = defineProps({
		isSize:{
			type:Boolean,
			default:() => false
		},
		type:{
			type:String,
			default:() => ''
		}
	})

	const store = mainDataStore();
	const imgPath = `${store.baseUrl}/syty360pm/appPicture/index/uploadPath.png`
	const type = ['本地上传','从聊天记录中选择附件'];
	const fileList = ref([]);
	const imgList = ref([]);
	const size = ref('');

	const typeSelect = (e) => {
		switch(e.detail.value){
			case '0':
				upLoad();
			break;
			case '1':
				messageUpLoad();
			break;
		}
	};
	const remove = (item) => {
		const index = fileList.value.indexOf(item);
		if(index > -1){
			imgList.value.splice(index,1);
			fileList.value.splice(index,1);
		};
	};
	const emits = defineEmits(['changeList'])
	// 本地上传
	const upLoad = () => {
				uni.chooseImage({
				    count: 1, // 默认最多一次选择9张图
				    success: res=> {
				        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						const timestamps = timestamp("{y}-{m}-{d}");
				        //支持多图上传
				        for (var i = 0; i < res.tempFiles.length; i++) {
				            //显示消息提示框
				            uni.showLoading({
				              mask: true
				            })
							size.value = Number(res.tempFiles[i].size);
				            //上传图片
				            //图片路径可自行修改
				            uploadImage(
							res.tempFiles[i].path, 
							`syty360pm/${props.type == 'addTask' ? '新建任务附件' : '任务完成附件'}/${timestamps}/`,
				                result => {
									// 不传文件大小
									if(!props.isSize) {
										imgList.value.push({
											ctfl_address:result
										});
										emits('changeList',imgList.value);
										uni.hideLoading();
									} else {// 传文件大小
										// 每个接口附件字段名不一样,所以要区分开
										if(props.type == 'addTask') { //新建任务
											imgList.value.push({
												ctfl_address:result,
												ctfl_byte:size.value,
												ctfl_name:'移动端文件'
											});
										}
										if(props.type == 'commRefer') { //任务完成
											imgList.value.push({
												tahl_address:result,
												tahl_file_size:size.value,
												tahl_file_name:'移动端文件'
											});
										}
										emits('changeList',imgList.value);
										uni.hideLoading();
									}
				            });
							fileList.value.push(res.tempFiles[i].path);
				        }
				    }
				})
	};
	//聊天记录上传
	const messageUpLoad = () => {
				wx.chooseMessageFile({
				  count: 1,
				  type: 'all',
				  success:res => {
					const timestamps = timestamp("{y}-{m}-{d}")
					//支持多图上传
					for (var i = 0; i < res.tempFiles.length; i++) {
					    //显示消息提示框
					    uni.showLoading({
					      mask: true
					    })
						size.value = Number(res.tempFiles[i].size);
					    uploadImage(
						res.tempFiles[i].path, 
						`syty360pm/${props.type == 'addTask' ? '新建任务附件' : '任务完成附件'}/${timestamps}/`,
					        result => { 
								result.value = result
								// 不传文件大小
								if(!props.isSize) {
									imgList.value.push({
										ctfl_address:result
									});
									emits('changeList',imgList.value)
									uni.hideLoading();
								} else {// 传文件大小
									// 每个接口附件字段名不一样,所以要区分开
									if(props.type == 'addTask') { //新建任务
										imgList.value.push({
											ctfl_address:result.value,
											ctfl_byte:size.value,
											ctfl_name:'移动端文件'
										});
									}
									if(props.type == 'commRefer') { //任务完成
										imgList.value.push({
											tahl_address:result.value,
											tahl_file_size:size.value,
											tahl_file_name:'移动端文件'
										});
									}
									emits('changeList',imgList.value);
									uni.hideLoading();
								}
					    	});
							if(res.tempFiles[i].type === 'image'){
								fileList.value.push(res.tempFiles[i].path);
							}else{
								fileList.value.push(messageFile);
							}
					}
				  }
				})
	};
	//  时间戳
	const timestamp = (format) => {
		const time = new Date();
		const y = time.getFullYear();
		const m = time.getMonth() + 1;
		const d = time.getDate();
		const h = time.getHours();
		const mm = time.getMinutes();
		const s = time.getSeconds();
		const ms = time.getMilliseconds();
		if (format == "{y}{m}{d}{h}{i}{s}") {
			return (
				"" +
				y +
				Add0(m) +
				Add0(d) +
				Add0(h) +
				Add0(mm) +
				Add0(s) +
				Add0(ms)
			);
		}
		if (format == "{y}-{m}-{d}") {
			return y + "-" + Add0(m) + "-" + Add0(d);
		}
	};
	const Add0 = (m) => {
		return m < 10 ? "0" + m : m;
	};

</script>

<style lang="scss">
	.upload {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0 20rpx 0;
		height: auto;
		
		
		.box{
			width: 75px;
			height: 75px;
			border-radius: 16rpx;
			margin: 15rpx;
			position: relative;
			
			.close{
				position: absolute;
				border-radius: 999rpx;
				left: 125rpx;
				top: -3rpx;
				background-color: rgb(244,245,247);
				width: 45rpx;
				height: 45rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:28rpx;
				line-height: 45rpx;
				text-align: center;
			}
			.close_app{
				position: absolute;
				border-radius: 999rpx;
				left: 90rpx;
				top: -3rpx;
				background-color: rgb(244,245,247);
				width: 35rpx;
				height: 35rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size:26rpx;
				line-height: 35rpx;
				text-align: center;
				z-index: 999;
			}
			
			image{
				width: 100%;
				height: 100%;
			}
		}
		.add{
			width: 75px;
			height: 75px;
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
