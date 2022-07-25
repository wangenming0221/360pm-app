<template>
	<view class="index-c-header">
		<view class="title">360项目管理</view>
		<view class="box" @click="goScreen">
			<image class="img" :src="icon" mode=""></image>
			<view class="select">
				{{ projectInfo.branchOfficeCode ? projectInfo.branchOfficeCode : '选择公司' }}
			</view>
			<u-icon name="arrow-down-fill" ></u-icon>
			<uni-icons type="bottom"></uni-icons>
			<view class="input">
				{{ projectInfo.deptName }}
			</view>
		</view>	
	</view>
</template>

<script setup>
	import { computed,watch } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';

	const store = mainDataStore();
	const { projectInfo } = storeToRefs(store);
	
	const icon = `${store.baseUrl}/syty360pm/appPicture/index/icon1.png`;
	
	const goScreen = () => {
		uni.navigateTo({
			url:'/pagesA/screen/screen'
		});
	};
	
</script>

<style lang="scss">
	.index-c-header{
		height: 400rpx;
		width: 100%;
		background: url('https://syty360pm.oss-cn-zhangjiakou.aliyuncs.com/syty360pm/appPicture/index/background.png') no-repeat;
		background-size:100% 100%;
		
		.title{
			font-family: "Arial";
			color: #FFFFFF;
			padding-top: 100rpx;
			font-size:42rpx;
			letter-spacing: 4rpx;
			font-weight: bold;
			margin-left: 40rpx;
		}
		.box{
			margin-left: 40rpx;
			width: 80%;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #ECF3FD;
			border-radius: 999rpx;
			margin-top: 80rpx;
			display: flex;
			align-items: center;
			position: relative;
			
			.img{
				width: 35rpx;
				height: 35rpx;
				margin-left: 30rpx;
			}
			.select{
				margin-left: 20rpx;
				font-size: 30rpx;
				color: #333333;
				font-weight: bold;
				letter-spacing: 2rpx;
				height: 70rpx;
				line-height: 70rpx;
				max-width: 35%;
				min-width: 20%;
				overflow-x: auto;
				white-space: nowrap;
			}
			
			.input{
				margin-left: 20rpx;
				width: 45%;
				overflow-x: auto;
				white-space: nowrap;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 32rpx;
			}
		}
	}
</style>
