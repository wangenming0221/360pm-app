<template>
	<view class="compare-c-table">
		<view class="header">
			<viwe class="child" v-for="(item,index) in headers" :key="index">
				{{ item }}
			</viwe>
		</view>
		<view class="box">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view>{{ index + 1 }}</view>
				<view>{{ item.nick_name }}</view>
				<view>{{ item.approveNum }}</view>
				<view>{{ item.exceedNum }}</view>
				<view>{{ item.num }}</view>
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
	
	const headers = ['排名','人员','执行延误','审批延误','总计延误'];
</script>

<style lang="scss">
	.compare-c-table{
		width: 94%;
		margin: 0 auto;
		margin-top: 20rpx;
		font-size: 30rpx;
		margin-bottom: 30rpx;
		
		.header{
			background-color: #F9F9F9;
			height: 90rpx;
			line-height: 90rpx;
			display: flex;
			justify-content: space-between;
			font-weight: bold;
			
			.child{
				text-align: center;
				width: 130rpx;
			}
		}
		.box{
			
			.item{
				display: flex;
				justify-content: space-between;
				height: 90rpx;
				line-height: 90rpx;
				font-size: 29rpx;
				
				view{
					width: 130rpx;
					text-align: center;
					white-space:nowrap;
					overflow-x: auto;
				}
			}
		}
	}
</style>
