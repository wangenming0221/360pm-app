<template>
	<view class="commProgress">
		<view v-if="messagesInfo.progress">
			<view class="item" v-for="(item,index) of messagesInfo.progress" :key="index">
				<view class="left">
					<view class="left-a"></view>
					<view class="left-b"></view>
				</view>
				<view class="center">
					<view class="delay">
						<!-- 延期天数：{{ item.delay }}天 -->
					</view>
					<view class="center-a">
						{{ item.progress_title }}
					</view>
					<view class="center-b">
						{{ item.progress_describe }}
					</view>
					<view class="center-c">
						{{ item.nick_name }}
					</view>
				</view>
				<view class="right" v-if="item.update_time">
					{{ item.update_time.substring(0, 10) }}
				</view>
			</view>
		</view>
		<v-no-data v-else></v-no-data>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import vNoData from '@/components/NoData';

	const messagesInfo = ref({});

	const list = ref([
		{
			delay:'1',
			title:'发布任务：安全任务管理',
			where:'系统发布',
			time:'2020.03.02'
		},
		{
			delay:'1',
			title:'发布任务：安全任务管理',
			where:'系统发布',
			time:'2020.03.02'
		},
		{
			delay:'1',
			title:'发布任务：安全任务管理',
			where:'系统发布',
			time:'2020.03.02'
		}
	]);

	onLoad((options) => {
		if(options.messagesInfo) {
			messagesInfo.value = Object.assign({}, JSON.parse(options.messagesInfo));
		}
	});
</script>

<style lang="scss">
	.commProgress{
		padding: 30rpx;
		
		.item{
			display: flex;
			
			.left{
				width: 25rpx;
				margin-top: 15rpx;
				
				.left-a{
					width: 25rpx;
					height: 25rpx;
					background-color: #5882FF;
					border-radius: 999rpx;
				}
				.left-b{
					width: 1rpx;
					margin: 0 auto;
					min-height: 150rpx;
					border-right: 1px dashed #5882FF;
				}
			}
			
			.center{
				margin-left: 40rpx;
				max-width: 62%;
				
				.delay{
					color: #fa3534;
					font-size: 36rpx;
					margin-bottom: 10rpx;
				}
				
				.center-a{
					font-size: 36rpx;
					color: #666666;
					font-weight: bold;
				}
				.center-b{
					margin-top: 20rpx;
					font-size: 32rpx;
					color: rgba(0,0,0,0.4);
				}
				.center-c{
					margin-top: 20rpx;
					font-size: 32rpx;
					color: rgba(0,0,0,0.4);
				}
			}
			
			.right{
				margin-left: auto;
				font-size: 30rpx;
				color: rgba(0,0,0,0.4);
			}
		}
	}
</style>
