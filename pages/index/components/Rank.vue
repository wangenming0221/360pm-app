<template>
	<view>
		<uni-transition mode-class="zoom-in" :show="list.length > 0">
			<view class="index-c-rank">
				<view class="icr_one">
					<image class="header" :src="rank2" mode="" v-if="list[1]"></image>
					<view class="name" v-if="list[1]">
						{{ list[1].nick_name }}
					</view>	
					<view class="type">
						<text v-if="list[1]">{{ list[1].role_name }}</text>
					</view>
					<view class="finished" v-if="list[1]">
						完成率：{{ list[1].rate }}
					</view>
				</view>
				<view class="icr_two">
					<image class="header" :src="rank1" mode="" v-if="list[0]"></image>
					<view class="name" v-if="list[0]">
						{{ list[0].nick_name }}
					</view>		
					<view class="type" v-if="list[0]">
						<text v-if="list[0]">{{ list[0].role_name }}</text>
					</view>
					<view class="finished" v-if="list[0]">
						完成率：{{ list[0].rate }}
					</view>
				</view>
				<view class="icr_three">
					<image class="header" :src="rank3" mode="" v-if="list[2]"></image>
					<view class="name" v-if="list[2]">
						{{ list[2].nick_name }}
					</view>		
					<view class="type" v-if="list[2]">
						<text v-if="list[2]">{{ list[2].role_name }}</text>
					</view>
					<view class="finished" v-if="list[2]">
						完成率：{{ list[2].rate }}
					</view>	
				</view>
			</view>
		</uni-transition>
		<v-no-data v-show="list.length === 0"></v-no-data>  
	</view>
</template>

<script setup>
	import { mainDataStore } from '@/store/pinia';
	import vNoData from '@/components/NoData';

	const store = mainDataStore();
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});
	const rank1 = `${store.baseUrl}/syty360pm/appPicture/index/rank1.png`;
	const rank2 = `${store.baseUrl}/syty360pm/appPicture/index/rank2.png`;
	const rank3 = `${store.baseUrl}/syty360pm/appPicture/index/rank3.png`;

</script>

<style lang="scss">
	.index-c-rank{
		display: flex;
		justify-content: space-between;
		text-align: center;
		padding-bottom: 100rpx;
		
		.icr_one{
			width: 180rpx;
			margin-top: 50rpx;
			
			.header{
				height: 180rpx;
				width: 180rpx;
				border-radius: 999rpx;
			}
			.name{
				width: 180rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #FFB902;
			}
		}
		.icr_two{
			width: 200rpx;
			
			.header{
				width: 200rpx;
				height: 230rpx;
				border-radius: 999rpx;
			}
			
			.name{
				width: 200rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #FFB902;
			}
		}
		.icr_three{
			width: 180rpx;
			margin-top: 50rpx;
			
			.header{
				height: 180rpx;
				width: 180rpx;
				border-radius: 999rpx;
			}
			
			.name{
				width: 180rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #FFB902;
			}
		}
		
		.name{
			font-weight: bold;
			letter-spacing: 4rpx;
			font-size: 34rpx;
			margin-top: 10rpx;
			width: 180rpx;
			height: 40rpx;
			line-height: 40rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.type{
			color: rgba(0,0,0,0.4);
			font-size: 28rpx;
			height: 40rpx;
			line-height: 40rpx;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.finished{
			font-size: 22rpx;
			display: flex;
		}
	}
</style>
