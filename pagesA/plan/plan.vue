<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="plan">
		<v-ring-header />
		<view class="plan-c-info">
			<v-title @changeAction="changeAction" :title="processName" action="切换一级节点"/>
			<v-info :processName="processName" :process="process" />
		</view>
		<view class="gap"></view>
		<view class="menus-title">
			<v-title @changeAction="changeAction" :title="title" action="切换子节点" :bp_fkid="bp_fkid"/>
		</view>
		<v-menus @change="change"/>
		<v-box :list="list"/>
		<v-no-data v-show="noShow && list.length > 0"></v-no-data>
		<uni-load-more v-show="total > 15" :status="status" />
		<v-popup 
			ref="popup"
			:processId="processId"
			@scrollShow="scrollShow"
			@lookDetail="lookDetail"
			@lookChild="lookChild">
		</v-popup>
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import vRingHeader from '@/components/RingHeader';
	import vInfo from './components/Info';
	import vMenus from './components/Menus';
	import vTitle from './components/Title';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';
	import vPopup from './components/model';

	const taio_state = ref('');
	const processName = ref('');
	const process = ref({});
	const bp_fkid = ref('');
	const processId = ref('');
	const show = ref(false);
	const popup = ref(null);
	const title = ref('任务列表');
	// 全局混入
	const total = ref(0);
	const timer = ref(null);
	const timer2 = ref(null);
	const noShow = ref(false);
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);
	
	const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
			getList(bp_fkid.value)
		},500);
	};
	
	const scrollShow = (e) => {
	    show.value = e;
	};
	
	const lookDetail = (options) => {
		processName.value = options.processName;
		bp_fkid.value = options.bp_fkid;
		processId.value = options.processId;
		noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
		page.value = 1;
		list.value = [];
		timer2.value = setTimeout(() => {
			if(list.value.length === 0){
				noShow.value = true
			}
		},1000);
		getInfo(options.bp_fkid);
		getList(options.bp_fkid);
	};
	
	const lookChild = (options) => {
		bp_fkid.value = options.code;
		title.value = options.name;
		noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
		page.value = 1;
		list.value = [];
		timer2.value = setTimeout(() => {
			if(list.value.length === 0){
				noShow.value = true
			}
		},1000);
		getList(options.code);
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

	// 获取信息
	const getInfo = async(bp_fkid) => {
		const params = {
			data:{
				bp_fkid:bp_fkid
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectProjectAnalysis'
		};
		await get(params)
			.then(res => {
				if(res.data){
					process.value = Object.assign({}, res.data);
				}
			})
			.finally(()=>{
				status.value = 'more';
			});
	};
	// 任务列表
	const getList = async(bp_fkid) => {

		const params = {
				data:{
					bp_fkid:bp_fkid,
					taio_state:taio_state.value,
					current:page.value,
					size:size.value,
				},
				url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectPlanChildNodeList'
			};
	
		await get(params)
			.then(res => {
				if(res.data){
					total.value = res.data.total
					if(res.data.records.length > 0){
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

	watch(taio_state, (val) => {
		getList(bp_fkid.value);
	},{deep:true});

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

	const changeAction = (e) => {
		popup.value.open(e);
	};
	
	onLoad((options) => {
		processName.value = options.processName;
		bp_fkid.value = options.bp_fkid;
		processId.value = options.processId;
		getInfo(options.bp_fkid);
		getList(options.bp_fkid);
	});

	onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null
	});
	
</script>

<style lang="scss">
	.plan{
		padding-bottom: 40rpx;
		
		.plan-c-info{
			width: 90%;
			margin: 0 auto;
			background-color: #FFFFFF;
			padding-left: 20rpx;
			padding-bottom: 30rpx;
		}
		.gap{
			width: 90%;
			margin: 0 auto;
		}
		.menus-title{
			width: 90%;
			margin: 0 auto;	
			padding-left: 20rpx;
		}
	}
</style>
