<template>
	<view>
		<uni-transition mode-class="zoom-in" :show="list.length > 0">
		<view class="index-c-roles">
			<view class="item" v-for="(item,index) of list" :key="index">
				<image class="left" :src="icon" mode=""></image>
				<view class="right">
					<view class="a">
						<text>{{ item.num }}</text><text></text>
					</view>
					<view class="b">
						{{ item.role_name }}
					</view>
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

	const icon = `${store.baseUrl}/syty360pm/appPicture/index/icon4.png`;
</script>

<style lang="scss">
	.index-c-roles{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.item{
			width: 40%;
			height: 100rpx;
			margin-bottom: 50rpx;
			display: flex;
			align-items: center;
			
			
			.left{
				width: 90rpx;
				height: 90rpx;
			}
			.right{
				margin-left: 20rpx;
				color: rgba(0,0,0,0.4);
				width: 55%;
				
				.a{
					text:nth-child(1){
						color: #FA321D;
						font-weight: bold;
					}
					text:nth-child(2){
						font-size: 24rpx;
					}
				}
				
				.b{
					font-size: 28rpx;
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
