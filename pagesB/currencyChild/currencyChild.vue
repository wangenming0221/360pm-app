<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<our-loading isFullScreen :active="allFinished" text="loading..." />
	<view class="currency_child">
		<v-search :dtgx="dtgx" :xmgx="xmgx" :show="show" @select="select" @confirm="confirm"></v-search>
		<v-popup 
		:selectInfo="selectInfo" 
		:archives_fkid="archives_fkid"
		@scrollShow="scrollShow" 
		ref="popup"
		@handle_dt="handle_dt"
		@handle_xm="handle_xm"
		@handleArchives="handleArchives"
		@handleWsio="handleWsio"
		@handleTaskType="handleTaskType"></v-popup>
		<v-box :list="list"></v-box>
		<v-no-data v-show="noShow"></v-no-data>
		<uni-load-more v-show="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, reactive, onUnmounted, watch } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import { get, post } from '@/api/request.js';
	import vSearch from './components/Search';
	import vPopup from './components/Popup';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';
	
	const selectInfo = reactive({
		tableList_dt:[], //单体工序
		tableList_xm:[], //项目工序
		serviceList:[], //业务线
		menus:[], //工艺
		types:[
			{
				name:'一次性任务',
				id:'0'
			},
			{
				name:'周期任务',
				id:'1'
			}
		]
	});
	const gx = reactive({
		id:'',
		ctio_task_type:''
	});
	const dtgx = ref('');
	const xmgx = ref('');
	const ctio_task_name = ref('');
	const archives_fkid = ref('');
	const wsio_fkid = ref('');
	const ctio_task_tm = ref('');
	const menuType = ref(0);
	const popup = ref();
	const show = ref(false);	
	// 全局混入
	const timer2 = ref(null);
	const noShow = ref(false);
	const total = ref(0);
	const timer = ref(null);	
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);
	const allFinished = ref(true);
	
	const select = (index) => {
		menuType.value = index;
		popup.value.open(index);
	};
	//搜索
	const confirm = (val) => {
		ctio_task_name.value = val;
	};
	//单体工序
	const handle_dt = (val) => {
		gx.id = val.id;
		dtgx.value = val.name;
		gx.ctio_task_type = val.ctio_task_type
	};
	//项目工序
	const handle_xm = (val) => {
		gx.id = val.id;
		xmgx.value = val.name;
		gx.ctio_task_type = val.ctio_task_type
	};
	//业务线
	const handleArchives = (val) => {
		archives_fkid.value = val;
	};
	//工艺
	const handleWsio = (val) => {
		wsio_fkid.value = val;
	};
	//任务类别
	const handleTaskType = (val) => {
		ctio_task_tm.value = val;
	};
	
	const scrollShow = (e) => {
	    show.value = e;
	};
	// 获取任务列表
	const getList = async() => {
				allFinished.value = true;
				const params = {
					data:{
						ctio_task_name:ctio_task_name.value, //名称
						archives_fkid:archives_fkid.value, //业务线
						wsio_fkid:wsio_fkid.value, //工艺
						ctio_task_tm:ctio_task_tm.value, //任务类别
						bp_fkid:gx.id, //工序
						ctio_task_type:gx.ctio_task_type, //任务类别0项目级1单体
					},
					url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectAll'
				};
				await get(params)
					.then(res => {
						if(res.data){
							total.value = res.data.total
							if(res.data){
								const arr = [];
								res.data.records.map(item => {
									arr.push(
										Object.assign(item, {actived:false})
									)
								});
								list.value = [...list.value,...arr];
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
	// 下一页
	const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
			getList();
		},500);
	};
	//触底
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
	onReachBottom(() => {
		handleBottom();
	});
	// 获取业务线
	const getService = async() => {
		const params = {
			data:{},
			url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectYwx'
		};
		await get(params)
			.then(res => {
				if(res.data){
					selectInfo.serviceList = res.data;
				}else {
					uni.showToast({
						title:'无业务线',
						icon:'error'
					});
				}
			});
	};
	// 获取单体工序
	const getProcess = async() => {
		const params = {
			data:{
				isProject:0
			},
			url:'/360-manage-core-operatemanage/baseProcesses/listbaseprocess'
		};
		await post(params)
			.then(res => {
				if(res.data){
					selectInfo.tableList_dt = handleTree(
						res.data,
						"code",
						"pcode",
						"children"
					);
				}else {
					uni.showToast({
						title:'无单体工序',
						icon:'error'
					});
				}
			});
	};
	// 获取项目工序
	const getProcess_xm = async() => {
		const params = {
			data:{
				isProject:1
			},
			url:'/360-manage-core-operatemanage/baseProcesses/listbaseprocess'
		};
		await post(params)
			.then(res => {
				if(res.data){
					selectInfo.tableList_xm = handleTree(
						res.data,
						"code",
						"pcode",
						"children"
					);
				}else {
					uni.showToast({
						title:'无项目工序',
						icon:'error'
					});
				}
			});
	};
	//获取工艺标准
	const getGybz = async() => {
		const params = {
			data:{},
			url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectGy'
		};
		await get(params)
			.then(res => {
				if(res.data){
					selectInfo.menus = res.data;
				}else {
					uni.showToast({
						title:'无工艺',
						icon:'error'
					});
				}
			});
	};
	// 销毁时间函数
	onUnmounted(() => {
		clearTimeout(timer.value);
		clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null;
	});
	//修改数组
	const handleTree = (data, id, parentId, children) => {
	  let config = {
	    id: id || 'id',
	    parentId: parentId || 'parentId',
	    childrenList: children || 'children'
	  };
	
	  var childrenListMap = {};
	  var nodeIds = {};
	  var tree = [];
	  for (let d of data) {
	    let parentId = d[config.parentId];
	    if (childrenListMap[parentId] == null) {
	      childrenListMap[parentId] = [];
	    }
	    nodeIds[d[config.id]] = d;
	    childrenListMap[parentId].push(d);
	  }
	
	  for (let d of data) {
	    let parentId = d[config.parentId];
	    if (nodeIds[parentId] == null) {
	      tree.push(d);
	    }
	  }
	
	  for (let t of tree) {
	    adaptToChildrenList(t);
	  }
	
	  function adaptToChildrenList(o) {
	    if (childrenListMap[o[config.id]] !== null) {
	      o[config.childrenList] = childrenListMap[o[config.id]];
	    }
	    if (o[config.childrenList]) {
	      for (let c of o[config.childrenList]) {
	        adaptToChildrenList(c);
	      }
	    }
	  }
	  return tree;
	}
	
	watch(
		() => [ctio_task_name, archives_fkid, wsio_fkid, ctio_task_tm, gx],
		(val) => {
			noShow.value = false
			clearTimeout(timer2.value);
			timer2.value = null
			page.value = 1;
			list.value = [];
			getList();
			timer2.value = setTimeout(() => {
				if(list.value.length === 0){
					noShow.value = true
				}
			},1000);
		},
		{deep:true}
	);
	
	onLoad((options) => {
		getProcess();
		getProcess_xm();
		getService();
		getGybz();
		archives_fkid.value = options.archives_pkid;
	});
</script>

<style lang="scss">
	page{
		background-color: #F2F6F8;
	}
	.currency_child{
		
	}
</style>
