<template>
	<view class="calendar-c-box">
			<view class="item" v-for="(item,index) of list" :key="index">
				<view class="header">
					<u-icon name="calendar" color="#2979ff" size="28"></u-icon>
					<uni-icons type="contact" size="28" color="#2979ff"></uni-icons>
					<view class="title">{{ item.taio_task_name }}</view>
					<view class="time">{{ item.taio_begin_time.substring(0,10) }}-{{ item.taio_end_time.substring(0,10) }}</view>	
				</view>
				<view class="body">
					<view class="person">
						任务执行：{{ item.nick_name }}
					</view>
					<view class="name">
						项目名称：{{ item.project_name }}
					</view>
				</view>
			</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});
</script>

<style lang="scss">
	.calendar-c-box{
		width: 90%;
		margin: 0 auto;
		margin-bottom: 50rpx;
		
		.item{
			margin-top: 50rpx;
			
			.header{
				display: flex;
				height: 40rpx;
				line-height: 40rpx;
				
				.title{
					margin-left: 30rpx;
					font-size: 35rpx;
					font-weight: bold;
					width: 200rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.time{
					margin-left: auto;
					color: rgba(0,0,0,0.4);
					font-size: 29rpx;
				}
			}
			
			.body{
				width: 95%;
				margin-left: 5%;
				border-left: 1px solid rgba(0,0,0,0.1);
				margin-top: 10rpx;
				padding-top: 60rpx;
				padding-bottom: 40rpx;
				
				.person{
					color: rgba(0,0,0,0.4);
					font-size: 30rpx;
					padding-left: 58rpx;
				}
				
				.name{
					color: rgba(0,0,0,0.4);
					font-size: 30rpx;
					margin-left: 58rpx;
					margin-top: 60rpx;
					border-bottom: 1px solid rgba(0,0,0,0.1);
					padding-bottom: 30rpx;
				}
			}
		}
	}
</style>
