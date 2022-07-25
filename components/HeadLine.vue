<template>
	<view class="head-line" :style="{paddingLeft:paddingLeft}">
		<view class="left" :style="{width:width}"></view>
		<view class="title">
			{{ title }}
		</view>
		
	</view>
</template>

<script setup>
	const props = defineProps({
		title: {
			type:String,
			default:() => '未定义',
		},
		paddingLeft: {
			type:String,
			default:() => '0',
		},
		width: {
			type:String,
			default:() => '4rpx',
		}
	});
</script>

<style lang="scss">
	.head-line{
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		align-items: center;
		
		.left{
			height: 50rpx;
			background-color: #0079FE;
		}
		
		.title{
			margin-left: 20rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>
