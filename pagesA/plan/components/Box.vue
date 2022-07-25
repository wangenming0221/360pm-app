<template>
	<view class="plan-c-box">
		<view 
		v-for="(item,index) of list"
		:key="index"
		class="item">
			<view class="top">
				<view class="t-left">
					{{ item.taio_task_name }}
				</view>
					<view
					class="t-right" 
					:class="(item.taio_state == 2 || item.taio_state == 3)  
					? 'ongoing' : ((item.taio_state == 1 || item.taio_state == 6) 
					? 'delay':'finish')">
						{{ item.taio_state == 1 ? '未开始'
						:(item.taio_state == 2 ? '进行中'
						:(item.taio_state == 3 ? '已完成'
						:(item.taio_state == 4 ? '已超期'
						:(item.taio_state == 5 ? '已预警'
						:(item.taio_state == 7 ? '已提交':'已取消'))))) }}
					</view>
			</view>
			<view class="bottom">
				<view>
					{{ item.taio_begin_time }}～{{ item.taio_end_time }}
				</view>
				<view class="b-right">
					{{ item.taio_describe }}
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
	.plan-c-box{
		margin-bottom: 80rpx;
		
		.item{
			margin-top: 20rpx;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			
			.top{
				display: flex;
				padding: 0 40rpx 0 40rpx;
				font-size: 36rpx;
				height: 65rpx;
				line-height: 65rpx;
				
				.t-left{
					max-width: 65%;
					overflow: hidden;
					text-overflow: ellipsis;
					flex-wrap: nowrap;
				}
				.t-right{
					margin-left: auto;
					width: 160rpx;
					text-align: center;
					border-radius: 16rpx;
					font-size: 30rpx;
				}
				.ongoing{
					border:1px solid #19BE6B;
					color:#19BE6B;
					background-color: #E7F4EE;
				}
				.delay{
					border:1px solid #FF9900;
					color:#FF9900;
					background-color: #FFF7EB;
				}
				.finish{
					border:1px solid #409EFF;
					color:#409EFF;
					background-color: #F0F7FF;
				}
			}
			.bottom{
				padding: 0 40rpx 0 40rpx;
				height: 150rpx;
				line-height: 150rpx;
				display: flex;
				font-size: 32rpx;
				color: rgba(0,0,0,0.4);
				
				.b-right{
					margin-left: auto;
				}
			}
		}
	}
</style>
