<template>
	<view class="modeDetail">
		<view class="title">{{ modeInfo.taio_task_name }}</view>
		<v-status :info="modeInfo"></v-status>
		<view class="gap"></view>
		<v-info :info="modeInfo"></v-info>
		<view class="gap"></view>
		<v-file></v-file>
	</view>
</template>

<script setup>
	import { computed } from "vue";
	import { mainDataStore } from "@/store/pinia";
	import { storeToRefs } from 'pinia';
	import { onLoad } from "@dcloudio/uni-app";
	import vStatus from './components/Status';
	import vInfo from './components/Info';
	import vFile from './components/File';

	const store = mainDataStore();
	const { modeInfo } = storeToRefs(store);

	onLoad((options) => {
		store.getMode(options.taioPkid)
	}); 

</script>

<style lang="scss">
	.modeDetail{
		
		.title{
			height: 110rpx;
			line-height: 110rpx;
			font-size: 34rpx;
			font-weight: bold;
			padding-left: 20rpx;
		}
	}
</style>
