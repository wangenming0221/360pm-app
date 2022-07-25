<template>
	<view class="roleDetail">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<role-list :list="list"></role-list>
		<v-no-data v-if="list.length === 0"></v-no-data>
		<uni-load-more v-if="total > 15" :status="status" />

	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { get } from '@/api/request.js';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import ourLoading from '@/components/our-loading/our-loading';
	import RoleList from './components/RoleList';
	import vNoData from '@/components/NoData';
	
	const allFinished = ref(true);
	const user_fkid = ref('');
	const role_fkid = ref('');
	const taio_state = ref('');
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

	onLoad((options) => {
		taio_state.value = options.taio_state;
		user_fkid.value = options.user_fkid;
		role_fkid.value = options.role_fkid;
	});

	// 获取任务列表
	const getList = async() => {
		const params = {
			data:{
				user_fkid:user_fkid.value,
				role_fkid:role_fkid.value,
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

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});

	watch(
        () => [taio_state, user_fkid, role_fkid],
        () => {
			if(user_fkid.value && role_fkid.value) {
				getList();
			}
        },
		{
			deep:true,
			immediate:true
		}
    );

</script>

<style lang="scss">
	.roleDetail{
		padding-bottom: 40rpx;
	}
</style>
