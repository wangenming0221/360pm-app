<template>
 	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view>
		<v-header @custom="custom"></v-header>
		<v-menus ref="menus" @menuChange="menuChange"></v-menus>
		<v-box :list="taskList"></v-box>
		<v-no-data v-show="taskList.length === 0 && taskHas"></v-no-data> 
		<uni-load-more v-show="taskTotal > 15" :status="taskStatus" />
		<v-popup @reset="reset"  @scrollShow="scrollShow"></v-popup>
	</view>
</template>

<script setup>
	import { ref, reactive, onUnmounted, watch } from "vue";
	import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { get } from '@/api/request.js';
	import vHeader from './components/Header.vue';
	import vMenus from './components/Menus';
	import vBox from './components/Box';
	import vPopup from './components/Popup';
 	import vNoData from '@/components/NoData';
	import ourLoading from '@/components/our-loading/our-loading';
	
	const store = mainDataStore();
	const { 
		taskList, 
		taskHas, 
		taskTotal,
		taskStatus,
		agency_flag,
		taskQuery
	} = storeToRefs(store); //pinia中的代办信息
	const show = ref(false); //模态框显示隐藏
	const timer = ref(null);	
	const page = ref(1); //页数
	const size = ref(10); //行数
	const queryType = ref('') //延期
	const menus = ref(null); //菜单组件
	let query = reactive({
		ctio_form:'',
		order_flag:1,
		user_fkid:uni.getStorageSync('user_fkid'),
		taio_state:'',
		taio_task_name:'', //任务名
	});

	const scrollShow = (e,data) => {
		if(e === false) {
			switch(data.taio_is) {
				case 0: //全部
					queryType.value = ''
				break;
				case 1: //已延期
					queryType.value = '2'
				break;	
			};
			query.ctio_form = data.ctio_form;
			query.order_flag = data.order_flag;
			// agency_flag.value = '1';
			taskHas.value = false;
			taskList.value = [];
			page.value = 1;
			getList();
			// menus.value.callBack();
		}
        show.value = e;
    };	
	// 菜单选择
	const menuChange = (e) => {
		agency_flag.value = e;
		taskHas.value = false
		taskList.value = [];
		page.value = 1;
		getList();
	};
	   // 列表
	const getList = async() => {
		let params = {};
		switch(agency_flag.value) {
			case '1': //全部
				query.taio_state = queryType.value;
				params = Object.assign({}, {
					data:Object.assign({
						current:page.value,
						size:size.value
					}, query),
					url: '/360-manage-core-operatemanage/TaskActualHistory/selectAppWholeHistoryIPage'
				});
				
			break;
			case '2': //待执行
				query.taio_state = '2,4';
				params = Object.assign({}, {
					data:Object.assign({
						current:page.value,
						size:size.value,
						}, query),
					url: '/360-manage-core-operatemanage/TaskActualHistory/selectAppConductDelayHistoryIPage'
				});
			break;	
			case '3': //待审批
				query.taio_state = queryType.value;
				params = Object.assign({}, {
					data:Object.assign({
						current:page.value,
						size:size.value,
						}, query),
					url: '/360-manage-core-operatemanage/TaskActualHistory/selectExamineHistoryIPage'
				});
			break;
			case '4': //待接受
				query.taio_state = queryType.value;
				params = Object.assign({}, {
					data:Object.assign({
						current:page.value,
						size:size.value,
						}, query),
					url: '/360-manage-core-operatemanage/TaskActualHistory/selectReceivedHistoryIPage'
				});
			break;
		}
		taskQuery.value = Object.assign({}, params);
		store.getTaskList(); //代办任务列表
		setTimeout(() => {
			uni.stopPullDownRefresh();
		},1000)
	};

	 const nextPage = () => {
		page.value ++;
		taskStatus.value = 'loading';
		timer.value = setTimeout(() => {
			getList()
		},500);
	};

	const custom = (val) => {
		query.taio_task_name = val;
		taskHas.value = false;
		taskList.value = [];
		page.value = 1;
		getList()
	};

	const handleBottom = () => {
		if(taskStatus.value == 'loading'){
			return false;
		};
		if(page.value >= (taskTotal.value/size.value)){
			taskStatus.value = 'noMore';
			return false;
		};
	   nextPage();
	};
	

	
	const reset = () => {
		query = {
			ctio_form:'',
			order_flag:1,
			user_fkid:uni.getStorageSync('user_fkid'),
			taio_state:'',
			taio_task_name:'', //任务名
		};
	};

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});
	
	onPullDownRefresh(() => {
		taskList.value = [];
		page.value = 1;
		taskStatus.value = 'more';
		getList();
		store.getCommission(); //代办下标
	});

	onLoad(() => {
		taskList.value = [];
		getList();
	});
	
	onShow(() => {
		store.getCommission(); //代办下标
	});
	

</script>

<style>

</style>
