<template>
	<view class="rankDetail">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<v-box :taio_state="taio_state" :list="list"></v-box>
		<v-no-data v-if="list.length === 0"></v-no-data>
		<uni-load-more v-if="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import ourLoading from '@/components/our-loading/our-loading';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';
	
	const allFinished = ref(true);
	const user_fkid = ref('');
	const taio_state = ref('');
	// 全局混入
	const total = ref(0);
	const timer = ref(null);	
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);
	
	// 获取任务列表
	const getList = async() => {
		console.log(taio_state.value)
		const params = {
			data:{
				user_fkid:user_fkid.value,
				taio_state:taio_state.value,
				current:page.value,
				size:size.value,
				ctio_form:'0'
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectAll'
		};
		await get(params)
			.then(res => {
				if(res.data){
					total.value = res.data.total
					if(res.data.records.length > 0){
						list.value = [...list.value ,...res.data.records];
					}
				}
			})
			.finally(()=>{
				status.value = 'more';
				allFinished.value = false;
			});
	};
	
	
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
	
	watch(
		() => [user_fkid, taio_state],
		(val) => {
			if(user_fkid.value && taio_state.value) {
				getList();
			}
		},
		{
			deep:true, 
			immediate:true,
		}
	);
			
	onReachBottom(() => {
		handleBottom();
	});
	
	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});
	
	onLoad((options) => {
		uni.setNavigationBarTitle({
			title:`${options.type}列表`
		});
		user_fkid.value = options.user_fkid;
		taio_state.value = options.taio_state;
	});
	
</script>

<style lang="scss">
	.rankDetail{
		padding-bottom: 40rpx;
	}
</style>
