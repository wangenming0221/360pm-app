<template>
	<view class="triggering">
		<v-ring-header />
		<view class="publish" >
			<view >
				<uni-data-picker
					:localdata="columns"
					:border="false"
					:map="map"
					:clear-icon="false"
					@change="selectChange">
				</uni-data-picker>
			</view>
			<view @click="handlePublish">
				发布
			</view>
		</view>
		<v-model :firstInfo="firstInfo" :selected="selected" ref="model"/>
		
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import vRingHeader from '@/components/RingHeader';
	import vModel from './components/Model';

	const model = ref();
	const firstInfo = ref({});
	const selected = ref('选择任务类型');
	const map = {
		text:'name',
		value:'id'
	};
	const columns = [
		{
			name:'一次性任务',
			id:0
		},
		{
			name:'周期性任务',
			id:1
		}
	];

	const selectChange = (e) => {
		selected.value = e.detail.value[0].text;
	};
	// 发布
	const handlePublish = () => {
		model.value.submit();
	};

	onLoad((options) => {
		if(options.firstInfo){
			firstInfo.value = Object.assign({},JSON.parse(options.firstInfo));
		}
	});

</script>

<style lang="scss">
	.triggering{
		padding-bottom: 80rpx;
		
		.publish{
			height: 100rpx;
			line-height: 100rpx;
			width: 90%;
			margin: 0 auto;
			font-size: 36rpx;
			color: #FFFFFF;
			font-weight: bold;
			letter-spacing: 6rpx;
			display: flex;
			justify-content: space-between;
			
		}
	}
</style>
