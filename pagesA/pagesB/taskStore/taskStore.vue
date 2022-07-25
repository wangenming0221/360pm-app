<template>
	<view class="task-store">
		<v-ring-header />
		<v-select @custom="custom"/>
		<vBox :list="list"/>
		<v-no-data v-if="list.length === 0"></v-no-data>  
		<uni-load-more v-if="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import vRingHeader from '@/components/RingHeader';
	import vSelect from './components/Select';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';
	
	const archives_name = ref('');

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

	onLoad(() => {
		uni.startPullDownRefresh();
	});

	onPullDownRefresh(() => {
		page.value = 1;
		list.value = [];
		getList();		
	});

	const custom = (e) => {
		archives_name.value = e;
	};

	const getList = async() => {
				const params = {
					data:{
						archives_name:archives_name.value,
						current:page.value,
						size:size.value,
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/selectTaskDetailedList'
				};
				await get(params)
						.then(res => {
							if(res.data){
								total.value = res.data.total
								if(res.data){
									list.value = [...list.value,...res.data.records];
								}
							}
						})
						.finally(()=>{
							status.value = 'more';
							uni.stopPullDownRefresh();
						});
	};

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});

	watch(archives_name, (val) => {
		page.value = 1;
		list.value = [];
		getList();
	},{deep:true});

</script>

<style lang="scss">

</style>
