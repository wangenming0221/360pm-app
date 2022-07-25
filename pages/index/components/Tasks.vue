<template>
	<view class="index-c-tasks">
			<view class="item" v-for="(item,index) of list" :key="index">
				<image class="left" :src="icon" mode=""></image>
				<view class="center">
					{{ item.taio_task_name }}
				</view>
				<view class="right">
					<span>{{ item.taio_end_time }}</span>
					<span>截止</span>
				</view>
			</view>
		<view class="more" @click="lookMore">
			<view>
				<uni-icons type="more-filled" color="#CBCCCE"></uni-icons>
			</view>
			<view class="b">
				查看更多
			</view>
		</view>
	</view>
</template>

<script setup>
	import { mainDataStore } from '@/store/pinia';

	const store = mainDataStore();
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		}
	});
	const icon = `${store.baseUrl}/syty360pm/appPicture/index/icon3.png`;
	
	const lookMore = () => {
		uni.navigateTo({
			url:'/pagesA/calendar/calendar'
		})
	};
</script>

<style lang="scss">
	.index-c-tasks{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		padding-bottom: 30rpx;
		
		.item{
			display: flex;
			align-items: center;
			line-height: 55rpx;
			height: 55rpx;
			font-size: 26rpx;
			margin-top: 20rpx;
			
			.left{
				width: 35rpx;
				height: 35rpx;
			}
			.center{
				margin-left: 30rpx;
				width: 40%;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
			.right{
				margin-left: auto;
				color: rgba(0,0,0,0.4);
				
				span{
					margin-left: 10rpx;
				}
			}
		}
		
		.more{
			display: flex;
			margin-top: 50rpx;
			
			.b{
				margin-left: 20rpx;
				font-size: 32rpx;
			}
		}
	}
</style>
