<template>
	<view class="delay-c-box">
		<view 
			class="item"
			v-for="(item,index) of list"
			:key="index">
			<view class="title">
				<view>{{ item.taio_task_name }}</view>
				<view
				v-if="item.days"
				class="delay">
					{{ `${actived === 0 ? '执行':'审批'}延期${item.days}天` }}
				</view>
			</view>
			<view class="content">
				<rich-text class="hid" :nodes="item.taio_describe"></rich-text>
			</view>
			<view class="admin">
				<view>执行人：{{ item.nick_name }}</view>
				<view v-if="item.taio_begin_time && item.taio_end_time">
					{{ item.taio_begin_time.substring(0,10) }}~{{ item.taio_end_time.substring(0,10) }}
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
		actived:{
			type:Number,
			default:() => 0
		},
	});
</script>

<style lang="scss">
	.delay-c-box{
		width: 90%;
		margin: 0 auto;
		margin-top: 150rpx;
		margin-bottom: 50rpx;
		border-top: 1px solid rgba(245,245,245,0.8);
		border-left: 1px solid rgba(245,245,245,0.8);
		border-right: 1px solid rgba(245,245,245,0.8);
		background-color: #FFFFFF;
		min-height: 500rpx;
		
		.item{
			border: 1px solid rgba(0,0,0,0.1);
			width: 95%;
			margin: 0 auto;
			padding-bottom: 30rpx;
			margin-top: 30rpx;
			
			.title{
				padding-left: 20rpx;
				padding-right: 20rpx;
				display: flex;
				justify-content: space-between;
				height: 110rpx;
				line-height: 110rpx;
				align-items: center;
				
				view:nth-child(1){
					font-size: 34rpx;
					font-weight: bold;
					max-width: 50%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				view:nth-child(2){
					height: 60rpx;
					padding: 0 20rpx 0 20rpx;
					line-height: 60rpx;
					font-size: 30rpx;
					border-radius: 12rpx;
					max-width: 45%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
			
			.content{
				padding-left: 20rpx;
				margin-top: 40rpx;
				font-size: 30rpx;
				color: rgba(0,0,0,0.4);
				
				.hid{ //文本第二行显示...
					overflow:hidden;
					text-overflow:ellipsis;
					display: -webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2; 
				}
			}
			
			.admin{
				padding-left: 20rpx;
				font-size: 24rpx;
				color: rgba(0,0,0,0.4);
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				
				view:nth-child(1){
					width: 300rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				view:nth-child(2){
					margin-left: auto;
					padding-right: 20rpx;
					width: 350rpx;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			
		}
	}
</style>
