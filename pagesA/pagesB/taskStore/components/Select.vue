<template>
	<view class="taskstore-c-select">
		<uni-search-bar
			class="uni-selech-my"
			placeholder="搜索中心部门名称" 
			cancelButton="none"
			clearButton="auto"
			@confirm="search">
		</uni-search-bar>
	</view>
</template>

<script setup>
	const emits = defineEmits(['custom']);

	const search = (e) => {
		emits('custom',e.value);
	};
</script>

<style lang="scss">
	.taskstore-c-select{
		display: flex;
		align-items: center;
		padding: 20rpx;
	}
</style>
