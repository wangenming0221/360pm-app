<template>
	<view class="RoleList">
		<view class="item" v-for="(item,index) of list" :key="index">
			<view class="left">
				<view class="l-top">
					{{ item.taio_task_name }}
				</view>
				<view class="l-bottom">
					截止时间：{{ item.taio_end_time }}
				</view>
			</view>
			<view 
			:class="(item.taio_state == 2 || item.taio_state == 3)
			? 'ongoing' : ((item.taio_state == '1' || item.taio_state == '6') 
			? 'delay':'finish')"
			class="right">
				{{ item.taio_state == '1' ? '未开始'
				:(item.taio_state == '2' ? '进行中'
				:(item.taio_state == '3' ? '已完成'
				:(item.taio_state == '4' ? '已超期'
				:(item.taio_state == '5' ? '已预警':'已取消')))) }}
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
	.RoleList{
		width: 90%;
		margin: 0 auto;
		margin-bottom: 30rpx;
		
		.item{
			margin-top: 40rpx;
			height: 200rpx;
			box-shadow:#DCDCDC 0px 0px 3px; 
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			
			.left{
				margin-left: 20rpx;
				width: 70%;
				
				view{
					height: 100rpx;
					line-height: 100rpx;
				}
				
				.l-top{
					color: #666666;
					font-size: 30rpx;
					max-width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.l-bottom{
					color: rgba(0,0,0,0.4);
					font-size: 25rpx;
				}
			}
			.right{
				width: 150rpx;
				height: 150rpx;
				line-height: 150rpx;
				margin-left: auto;
				margin-right: 10rpx;
				text-align: center;
				border-radius: 999rpx;
				transform:rotate(45deg);
				font-size: 32rpx;
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
	}
</style>
