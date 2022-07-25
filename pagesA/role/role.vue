<template>
	<view>
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<al-tabs :list="menuList" color="#66b1ff" @change="change"></al-tabs>
		<vBox :taio_state="taio_state" :list="list"></vBox>
		<v-no-data v-show="noShow"></v-no-data>
		<uni-load-more v-show="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import ourLoading from '@/components/our-loading/our-loading';
	import alTabs from '@/components/Menus';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';

	const allFinished = ref(true);
	const taio_state = ref('');
	const menuList = [
		{
			name:'全部',
			 id:''
		},
		{
			name:'未开始',
			id:1
		},
		{
			name:'进行中',
			id:2
		},
		{
			name:'已完成',
			id:3
		},
		{
			name:'已延期',
			id:4
		},
	];
	// 全局混入
	const timer2 = ref(null);
	const noShow = ref(false);
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

	const change = (e) => {
		noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
		page.value = 1;
		list.value = [];
		taio_state.value = e

		timer2.value = setTimeout(() => {
			if(list.value.length === 0){
				noShow.value = true
			}
		},1000);
		
	};

	// 获取角色分析列表
	const getList = async() => {
				allFinished.value = true;
				const params = {
					data:{
						taio_state:taio_state.value,
						current:page.value,
						size:size.value,
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectRoleAnalysisList'
				};
				await get(params)
					.then(res => {
						if(res.data){
							total.value = res.data.total
							if(res.data.records.length != 0){
								list.value = [...list.value,...res.data.records];
							} else {
								noShow.value = true
							}
						}
					})
					.finally(()=>{
						status.value = 'more';
						allFinished.value = false;
					});
	};

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null;
	});

	watch(taio_state, (val) => {
		getList();
	},{deep:true,immediate:true});

</script>

<style lang="scss">

</style>
