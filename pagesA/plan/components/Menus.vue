<template>
	<view class="plan-c-menus">
		<view class="menus-control">
			<uni-segmented-control 
				:current="actived" 
				:values="items" 
				:style-type="styleType"
				:active-color="activeColor" 
				@clickItem="changed" 
			/>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	
	const actived = ref(0);
	const styleType = 'text';
    const activeColor = '#007aff';
	const items = ['全部','进行中','已完成','已延期','已取消'];
	const menuList = ['',2,3,4,6];

	const emits = defineEmits(['change'])

	const changed = (e) => {
		const id = menuList[e.currentIndex];
		emits('change',id);
	};
</script>

<style lang="scss">
	.plan-c-menus{
		
		.menus-control{
			padding-left: 0 10rpx 0 20rpx;
		}
	}
</style>
