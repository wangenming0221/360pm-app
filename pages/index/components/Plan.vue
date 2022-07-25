<template>
	<view class="index-c-plan" :style="{height:planFin ? '500rpx':'auto'}">
		  <qiun-data-charts
			v-if="planFin"
			@getIndex="handleClick"
		    type="column"
		    :chartData="chartData"
			:disableScroll="true"
		  	:ontouch="true"
			background="none"
			:canvas2d="true"
      		canvasId="plan_charts"
		  />
		<v-no-data v-else></v-no-data> 
	</view>
</template>

<script setup>
	import { watch, ref, reactive } from 'vue';
	import vNoData from '@/components/NoData';

	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});

	const planFin = ref(false);

	const chartData = reactive({
		categories:[],
		 series:[
			{
				"name": "目标值",
				 "data": []
			},
		],
	});

	watch(
		() => props.list,
		(newVal, oldVal) => {
			if(newVal.length > 0) {
				chartData.categories = [];
				chartData.series[0].data = [];
				newVal.map(item => {
					chartData.categories.push(item.baseProcessesName);
					chartData.series[0].data.push(item.num);
				});
				planFin.value = true;
			} else {
				planFin.value = false;
			}
		},
		{
			deep:true,
			immediate:true
		}
	);
	const handleClick = (e) => {
		if(e){
			const index = e.currentIndex.index;
			const bp_fkid = props.list[index].baseProcessesCode;
			const baseProcessesName = props.list[index].baseProcessesName;
			const processId = props.list[index].processId;
			uni.navigateTo({
				url:`/pagesA/plan/plan?bp_fkid=${bp_fkid}&processName=${baseProcessesName}&processId=${processId}`
			});
		}
	};
</script>

<style lang="scss">
	.index-c-plan{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		width: auto;
		padding-bottom: 40rpx;
	}
</style>
