<template>
	<view class="taskManagement">
		<v-ring-header />
		<v-model ref="model"/>
		<view class="button">
			<button class="uni_button" type="default" @click="goPage">设置任务触发方式</button>
		</view>
	</view>
</template>

<script setup>
	import vRingHeader from '@/components/RingHeader';
	import vModel from './components/Model';
	import { ref } from 'vue';

	const model = ref(null);

	// 任务触发方式设置
	const goPage = () => {
		model.value.goPage();
	};
</script>

<style lang="scss">
	.taskManagement{
		padding-bottom: 80rpx;
		
		.publish{
			height: 100rpx;
			line-height: 100rpx;
			width: 90%;
			margin: 0 auto;
			font-size: 36rpx;
			text-align: right;
			color: #FFFFFF;
			font-weight: bold;
			letter-spacing: 6rpx;
		}
		
		.button{
			width: 90%;
			margin: 0 auto;

			.uni_button{
				text-align: center;
				font-size: 36rpx;
				color: #FFFFFF;
				box-shadow: 0 3rpx 3rpx rgb(31 110 207 / 20%);
				background: #1f6ecf;
			}
		}
	}
</style>
