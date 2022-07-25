<template>
	<view class="currdet_c_header">
		{{ title }}
	</view>
</template>

<script setup>
	const props = defineProps({
		title:{
			type:String,
			default:()=>'未定义'
		}
	})
</script>

<style lang="scss">
	.currdet_c_header{
		height: 50rpx;
		line-height: 50rpx;
		border-left: 5px solid #49496A;
		padding-left: 25rpx;
		margin-top: 45rpx;
		margin-bottom: 45rpx;
		font-weight: bold;
		color: #49496A;
	}
</style>