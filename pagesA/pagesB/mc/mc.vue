<template>
	<view class="mc">
		<v-header :getMenus="false"></v-header>
		<view class="box">
			<vBox :list="list" :type="type"></vBox>
		</view>
		<v-no-data v-show="noShow"></v-no-data>
		<uni-load-more v-if="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import vHeader from '@/components/Menus';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';

	const archives_fkid =ref('');
	const taio_state = ref('');
	const created_by = ref('');
	const type = ref('');
	// 全局混入
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

	// watch(
	// 	() => [archives_fkid, taio_state],
	// 	(newVal, oldVal) => {
	// 		if(archives_fkid.value) {
	// 			getList();
	// 		}
	// 	},
	// 	{deep:true, immediate:true}
	// );

	const getList = async() => {
				const params = {
					data:{
						company_task_type:taio_state.value,
						archives_fkid:archives_fkid.value,
						created_by:type.value == '2' ? created_by.value : '',
						current:page.value,
						size:size.value,
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/selectCompanyList'
				};
				await get(params)
						.then(res => {
							if(res.data){
								total.value = res.data.total
								if(res.data.records.length >0){
									list.value = [...list.value,...res.data.records];
								} else {
									noShow.value = true
								}
							}
						})
						.finally(()=>{
							status.value = 'more';
						});
	};

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		timer.value = null;
	});

	onLoad((options) => {
		archives_fkid.value = options.archives_fkid;
		type.value = options.type;
		if(options.created_by) {
			created_by.value = options.created_by;
		}
		uni.setNavigationBarTitle({
			title:options.title
		});
		getList();
	});
</script>

<style lang="scss">
	.mc{
		
		.box{
			width: 90%;
			margin: 0 auto;
			background-color: #FFFFFF;
			min-height: 600rpx;
		}
	}
</style>
