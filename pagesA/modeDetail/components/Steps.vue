<template>
	<view class="modeDetail-c-steps">
		<view v-for="(item,index) of progress" :key="index">
			<view class="steps_line" v-if="index != 0"></view>
			<view class="steps_item">
				<view class="steps-title" v-if="item.timestamp > nowData">{{ item.user_name.chartAt(0) }}</view>
				<image :src="icon" class="steps-icon" v-if="item.timestamp < nowData"></image>
				<view class="steps-content" v-if="item.timestamp > nowData">
				<view class="steps-content-time">{{ item.title }}</view>
					<!-- <view class="steps-content-time">{{ item.describe }}</view> -->
					<view class="steps-content-date">{{ item.time }}</view>
				</view>
				<view class="steps-error" v-if="item.timestamp < nowData">
					<view class="steps-content-time">{{ item.title }}</view>
					<!-- <view class="steps-content-time">{{ item.describe }}</view> -->
					<view class="steps-content-date">{{ item.time }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { watch, ref } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';

	const store = mainDataStore();
	const { modeInfo } = storeToRefs(store);
	const icon = `${store.baseUrl}/syty360pm/appPicture/index/error_icon.png`;
	const nowData = new Date().getTime();
	const progress = ref([]);

	watch(
		() => modeInfo,
		(newVal, oldVal) => {
			if(newVal.value.taskActualProgresses) {
				newVal.value.taskActualProgresses.forEach(item => {
					const create_time =  new Date(Date.parse(item.create_time.replace(/-/g, "/")));
					progress.value.push({
						time:item.create_time,
						user_name:newVal.value.nick_name,
						describe:item.progress_describe,
						title:item.progress_title,
						timestamp:new Date(create_time).getTime()
					});
				});
			}
		},
		{deep:true}
	)
</script>

<style lang="scss">
	.modeDetail-c-steps {
		padding: 30rpx;

		.steps_item {
			display: flex;

			.steps-title{
				height: 110rpx;
				width: 110rpx;
				line-height: 110rpx;
				border-radius: 999rpx;
				text-align: center;
				background-color: #238EEC;
				color: #FFFFFF;
				font-size: 34rpx;
				font-weight: bold;
			}
			.steps-icon{
				height: 100rpx;
				width: 100rpx;
			}
			.steps-content{
				margin-left: 30rpx;
				display: flex;
				flex-direction:column;
				justify-content: space-between;
				margin-left: 30rpx;

				.steps-content-time{
					font-size: 32rpx;
				}
				.steps-content-date{
					font-size: 28rpx;
					color: #BFBFBF;
				}
			}
			.steps-error{
				background-color: rgb(246,191,30);
				padding: 20rpx;
				min-height: 100rpx;
				color: #FFFFFF;
				border-radius: 16rpx;
				margin-left: 30rpx;

				.steps-content-time{
					font-size: 32rpx;
				}
				.steps-content-date{
					font-size: 28rpx;
				}
			}
		}
		.steps_line{
			height: 80rpx;
			background-color: #BFBFBF;
			width: 3rpx;
			margin-left: 55rpx;
		}
	}
</style>
