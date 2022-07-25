<template>
	<view class="modeDetail-c-status">
		<view class="item">
			<view class="top">
				<view class="dot" style="background-color: #58A3F7;"></view>
				<view class="font">执行人</view>
			</view>
			<view class="admin">
				{{ info.nick_name }}
			</view>
		</view>
		<view class="item">
			<view class="top">
				<view class="dot" style="background-color: #FFA94C;"></view>
				<view class="font">完成时间</view>
			</view>
			<view class="admin">
				{{ info.taio_finsh_time }}
			</view>
		</view>
		<view class="item">
			<view class="top">
				<view class="dot" style="background-color:#FB6260;"></view>
				<view class="font">任务状态</view>
			</view>
			<view class="admin">
				{{ info.taio_state == 1 ? '未开始'
				:(info.taio_state == 2 ? '进行中'
				:(info.taio_state == 3 ? '已完成'
				:(info.taio_state == 4 ? '已超期'
				:(info.taio_state == 5 ? '已预警':'已取消')))) }}
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		info:{
			type:Object,
			default:() => {}
		},
	});
</script>

<style lang="scss">
	.modeDetail-c-status{
		display: flex;
		justify-content: space-around;
		padding-bottom: 20rpx;
		
		.item{
			width: 30%;
			height: 180rpx;
			border-radius: 6rpx;
			border: 1px solid rgba(0,0,0,0.1);
			
			.top{
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				align-items: center;
				padding-left: 40rpx;
				
				.dot{
					width: 25rpx;
					height: 25rpx;
					border-radius: 999rpx;
				}
				.font{
					font-size: 32rpx;
					color: rgba(0,0,0,0.4);
					margin-left: 13rpx;
				}
			}
			
			.admin{
				text-align: center;
				font-size: 36rpx;
				font-weight: bold;
				color: #666666;
				width: 100%;
				overflow:hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
