<template>
	<view class="plan-c-title">
		<view class="left"></view>
		<view class="title">
			{{ title }}
		</view>
		<view class="right" @click="handleClick">
			{{ action }}
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		title: {
			type:String,
			default:() => '未定义',
		},
		action: {
			type:String,
			default:() => '未定义',
		},
		bp_fkid: {
			type:String,
			default:() => '',
		}
	});
	const emits = defineEmits(['changeAction']);
	const handleClick = () => {
		const e = props.action === '切换一级节点' ? 1:2;
		emits('changeAction', e);
	};

</script>

<style lang="scss">
	.plan-c-title{
		height: 120rpx;
		line-height: 120rpx;
		display: flex;
		align-items: center;
		
		.left{
			width: 10rpx;
			height: 50rpx;
			background-color: #0079FE;
		}
		
		.title{
			margin-left: 20rpx;
			font-size: 36rpx;
			font-weight: bold;
		}
		
		.right{
			margin-left: auto;
			font-size: 32rpx;
			color: #0079FE;
			padding-right: 20rpx;
		}
	}
</style>
