<template>
	<view class="compare">
		<v-charts></v-charts>
		<v-table :list="list"></v-table>
		<v-no-data v-if="list.length === 0"></v-no-data>
		<uni-load-more v-if="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { onUnmounted, ref } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import vCharts from './components/Charts';
	import vTable from './components/Table';
	import vNoData from '@/components/NoData';

	// 全局混入
	const total = ref(0);
	const timer = ref(null);	
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);
	
	const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
			getList();
		},500);
	};
	
	const handleBottom = () => {
		if(status.value == 'loading'){
			return false;
		};
		if(page.value >= (total.value/size.value)){
			status.value = 'noMore';
			return false;
		};
	   nextPage();
	};

	// 获取指标比对列表
	const getList = async() => {
		const params = {
			data:{
				current:page.value,
				size:size.value,
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectIndexComparisonList'
		};
		await get(params)
			.then(res => {
				if(res.data){
					total.value = res.data.total
					if(res.data.records.length > 0){
						list.value = [...list.value,...res.data.records];
					}
				}
			})
			.finally(()=>{
				status.value = 'more';
			});
	}

	onLoad(() => {
		getList();
	});

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});
	
</script>

<style lang="scss">
	.compare{
		padding-bottom: 30rpx;
	}
</style>
