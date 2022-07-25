<template>
	<view class="currency_c_header">
		<view class="c_title">
			全业务线任务
		</view>
		<view class="c_box">
			<view class="c_box_item">
				<view class="cbi_num">
					{{ info.total }}
				</view>
				<view class="cbi_name">
					总任务数(个)
				</view>
			</view>
			<view class="c_box_item">
				<view class="cbi_num">
					{{ info.workingProcedure }}
				</view>
				<view class="cbi_name">
					工序关联(个)
				</view>
			</view>
			<view class="c_box_item">
				<view class="cbi_num">
					{{ info.taskAssociation }}
				</view>
				<view class="cbi_name">
					任务关联(个)
				</view>
			</view>
			<view class="c_box_item">
				<view class="cbi_num">
					{{ info.timeAssociation }}
				</view>
				<view class="cbi_name">
					时间关联(个)
				</view>
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
	 })
</script>

<style lang="scss">
	.currency_c_header{
		border-radius: 14rpx;
		background: linear-gradient(to right,#629CFF,#0358FF);
		color: #FFFFFF;
		padding-bottom: 40rpx;
		width: 90%;
		margin: 0 auto;
		
		.c_title{
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			text-align: center;
		}
		.c_box{
			display: flex;
			
			.c_box_item{
				flex: 1;
				text-align: center;
				font-size: 26rpx;
				
				.cbi_num{
					font-size: 36rpx;
					font-weight: bold;
					margin-top: 20rpx;
				}
				.cbi_name{
					margin-top: 20rpx;
				}
			}
		}
	}
</style>