<template>
	<view class="modeDetail-c-list">
		<view 
			class="item"  
			v-for="(item,index) of modeInfo.taskActualFiles" 
			:key="index">
			<uni-icons type="upload-filled" size="30"></uni-icons>
			<text>{{ item.tahl_file_name }}</text>
		</view>
	</view>
</template>

<script setup>
	import { computed } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';

	const store = mainDataStore();
	const { modeInfo } = storeToRefs(store);

</script>

<style lang="scss">
	.modeDetail-c-list{
		text-align: center;
		padding-top: 30rpx;
		padding-bottom: 50rpx;
		
		.item{
			margin-top: 30rpx;
			font-size: 32rpx;
			color: #666666;
			display: flex;
			align-items: center;
			
			text{
				margin-left: 30rpx;
			}
		}
	}
</style>
