<template>
	<v-ring-header>
		<view class="right" @click="goCompare">
			指标比对
		</view>
		<viwe class="list">
			<view 
				class="item" 
				:class="actived === index ? 'actived':'' "
				v-for="(item,index) of list" 
				:key="index"
				@click="changed(index)">
				{{ item.title }}
			</view>
		</viwe>
	</v-ring-header>
</template>

<script setup>
	import { ref } from 'vue';
	import vRingHeader from '@/components/RingHeader';

	const actived = ref(0);
	const list = [
		{
			title:'执行延期'
		},
		{
			title:'审批延期'
		}
	];

	const emits = defineEmits(['change']);

	const changed = (index) => {
		actived.value = index;
		emits('change',index);
	};
	const goCompare = () => {
		uni.navigateTo({
			url:'/pagesA/compare/compare'
		});
	};
</script>

<style lang="scss">
	.right{
		float: right;
		font-size: 32rpx;
		color: #FFFFFF;
		padding-right: 20rpx;
	}
	
	.list{
		width: 90%;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		padding-top: 30rpx;
		
		.item{
			font-size: 30rpx;
			color: #A0A0B5;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			width: 25%;
		}
		.actived{
			background-color: #FFFFFF;
			color: #5882FF;
			border-radius: 999rpx;
		}
	}
</style>
