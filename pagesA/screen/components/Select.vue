<template>
	<view class="screen-c-select">
		<uni-search-bar
			style="width:100%;"
			placeholder="请输入组织名称/项目名称" 
			clearButton="auto"
			cancel-text="全部"
			@confirm="search"
			@cancel="goBack">
		</uni-search-bar>
	</view>
</template>

<script setup>
	import { mainDataStore } from '@/store/pinia';
	const emits = defineEmits(['custom']);

	const search = (e) => {
		if(e.value != '') {
			emits('custom',e.value)
		}
	};
	const store = mainDataStore();
	const goBack = () => {
		store.projectInfo = Object.assign({}, {});
		uni.navigateBack({
			delta:1
		});
	};
</script>

<style lang="scss">
	.screen-c-select{
		display: flex;
		align-items: center;
		padding: 20rpx;
	}
</style>
