<template>
	<view class="index-c-defer">
		<view class="charts-box" v-if="finished">
			<qiun-data-charts
			    type="defer"
			    :chartData="chartData"
			    background="none"
				:canvas2d="true"
      			canvasId="defer_charts"
			  />
		</view>
		<view class="tools" v-if="finished">
			<view class="item">
				<view class="tool" style="background-color: #FFC836;"></view>
				<view class="status">已完成</view>	
				<view class="num">{{ chartData.taskDelayApprove }}个</view>
			</view>
			<view class="item">
				<view class="tool" style="background-color: #EFEFEF;"></view>
				<view class="status">未完成</view>	
				<view class="num">{{ chartData.taskDelayExecute }}个</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
			chartData:{
				type:Object,
				default:() => {}
			},
			finished:{
				type:Boolean,
				default:() => false
			},
	});
</script>

<style lang="scss">
	.index-c-defer{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		width: 100%;
		padding-bottom: 40rpx;
		
		.charts-box{
			width: 60%;
			margin: 0 auto;
			height: 400rpx;
		}
		
		.tools{
			width: 95%;
			margin: 0 auto;
			height: 35rpx;
			line-height: 35rpx;
			display: flex;
			justify-content: space-between;
			
			.item{
				display: flex;
				
				.tool{
					width: 70rpx;
					border-radius: 24rpx;
				}
				
				.status{
					color: rgba(0,0,0,0.4);
					margin-left: 15rpx;
					font-size: 26rpx;
				}
				
				.num{
					font-size: 30rpx;
					margin-left: 15rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>
