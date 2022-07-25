<template>
	<view class="commission-c-header">
		<view class="top">
			待办任务
		</view>
		<view class="bottoom">
			<view class="input">

				<input 
				class="uni-selech-my"
				placeholder="请输入任务名称" 
				type="text" 
				@confirm="search" 
				:auto-blur="true"
				:adjust-position="false"
				confirm-type="搜索"/>

			</view>
			<view class="icon" @click="open">
				<image :src="icon1" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { mainDataStore } from '@/store/pinia';
	import bus from '@/common/bus.js';

	const store = mainDataStore();
	const icon1 = `${store.baseUrl}/syty360pm/appPicture/commission/icon1.png`;

	const open = () => {
		bus.emit('popupOpen');
	};

	const emits = defineEmits(['custom']);

	const search = (e) => {
		emits('custom',e.detail.value)
	};

</script>

<style lang="scss">
	.commission-c-header{
		
		.top{
			padding-left: 30rpx;
			height: 250rpx;
			line-height: 300rpx;
			background:linear-gradient(#BED7F5, #EFF3FC, #F5FBFB, #FFFFFF);
			font-weight: bold;
			font-size: 42rpx;
			letter-spacing: 4rpx;
		}
		.bottoom{
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			height: 100rpx;
			
			.input{
				width: 90%;
				
				.uni-selech-my{
					width: 95%;
					background-color: #f5f8fb;
					padding: 25rpx;
				}
			}
			
			.icon{
				width: 15%;
				display: flex;
				justify-content: center;
				align-items: center;
				
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}
</style>
