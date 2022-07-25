<template>
	<view class="commission-c-box">
		<view
		@click="goDetail(item)" 
		class="item" 
		v-for="(item,index) of list" 
		:key="index">
			<image 
				class="left" 
				:src="(index%2  === 0 && index != 0) ? logo2
				:(index%3  === 0 ? logo3:logo1)" 
				mode="">
			</image>
			<view class="right">
				<view class="a">
					<view>{{ item.taio_task_name }}</view>
					<view><span>执行人:</span><span>{{ item.nick_name }}</span></view>
				</view>
				<view class="b">
					<span>{{ item.taio_begin_time }}</span>
					<span>-</span>
					<span>{{ item.taio_end_time }}</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { mainDataStore } from '@/store/pinia';
	const props = defineProps({
		list:{
			type:Array,
			default:()=>[]
		},
	});
	const store = mainDataStore();
	const logo1 = `${store.baseUrl}/syty360pm/appPicture/commission/logo1.png`;
	const logo2 = `${store.baseUrl}/syty360pm/appPicture/commission/logo2.png`;
	const logo3 = `${store.baseUrl}/syty360pm/appPicture/commission/logo3.png`;

	const goDetail = (item) => {
		uni.navigateTo({
			url:`/pagesC/commissionLoad/commissionLoad?pkid=${item.taio_pkid}&token=${uni.getStorageSync('token')}`
		});
	};
</script>

<style lang="scss">
	.commission-c-box{
		padding-bottom: 50rpx;
		width: 90%;
		margin: 0 auto;
		margin-top: 30rpx;
		
		.item{
			height: 100rpx;
			padding-bottom: 50rpx;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			display: flex;
			margin-top: 50rpx;
			
			.left{
				width: 100rpx;
				height: 100rpx;
				border-radius: 999rpx;
			}
			.right{
				margin-left: 40rpx;
				width: 75%;
				
				.a{
					display: flex;
					justify-content: space-between;
					height: 60rpx;
					line-height: 60rpx;
					
					view:nth-child(1){
						font-size: 32rpx;
						font-weight: bold;
						color: #000000;
						max-width: 60%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					view:nth-child(2){
						font-size: 24rpx;
						color: #A5A5A5;
						max-width: 30%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					span{
						margin-left: 20rpx;
					}
				}
				.b{
					font-size: 20rpx;
					color: #A5A5A5;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					height: 60rpx;
					line-height: 60rpx;
				}
			}
		}
	}
</style>
