<template>
	<view class="modeDetail-c-file">
		<view class="menus">
			<view 
				class="item" 
				v-for="(item,index) of menus" 
				:key="index"
				:class="actived === index ? 'actived':''"
				@click="change(index)">
				{{ item }}
			</view>
		</view>
		
		<v-steps v-show="actived === 0"></v-steps>
		<v-list v-show="actived === 1"></v-list>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import vSteps from './Steps';
	import vList from './List';

	const actived = ref(0)
	const menus = ['进展','文件'];

	const change = (index) => {
		actived.value = index;
	};
</script>

<style lang="scss">
	.modeDetail-c-file{
		min-height: 400rpx;
		
		.menus{
			line-height: 80rpx;
			height: 80rpx;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			display: flex;
			justify-content: space-between;
			
			.item{
				text-align: center;
				width: 50%;
				font-size: 34rpx;
				color: rgba(0,0,0,0.4);
			}
			
			.actived{
				color: #5882FF;
				border-bottom: 1px solid #5882FF;
			}
		}
	}
</style>
