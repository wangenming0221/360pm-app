<template>
	<view class="index">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<v-header></v-header>
		<view class="body">
			<v-menus 
				v-if="Authorization" 
				:bannerList="bannerList" 
				:Authorization="Authorization">
			</v-menus>
			<v-title text="任务日历" :selectedShow="false" ></v-title>
			<v-calendar v-if="calendarCall" @getCalendar="getCalendar"></v-calendar>
			<uni-transition mode-class="zoom-in" :show="taskList.length > 0">
				<v-tasks :list="taskList"></v-tasks>
			</uni-transition>
			<v-title 
				@callMode="callMode"
				text="任务指标分析"
				name='mode' 
				:isShow="true"
				:selectedShow="false"
				path="/pagesA/mode/mode?type=1">
			</v-title>
			<uni-transition mode-class="zoom-in" :show="mqi">
				<v-mqi :finished="mqi" :chartData="mqiChartData"></v-mqi>
			</uni-transition>
			<v-title
				@callRole="callRole"
				name='role'
				text="角色任务分析" 
				:isShow="true"
				path="/pagesA/role/role"
				>
			</v-title>
			<v-roles :list="roleList"></v-roles>
			<v-title 
				text="项目任务分析" 
				name="project"
				:selectedShow="false"
				:isShow="true"
				path="/pagesA/mode/mode?type=2">
			</v-title>
			<v-project :projectInfo="projectInfos"></v-project>
			<v-title
				text="延期任务分析" 
				:selectedShow="false"
				:isShow="true"
				path="/pagesA/delay/delay"
				>
			</v-title>
			<v-defer :finished="defer" :chartData="deferChartData"></v-defer>
			<v-title
				@callPlan="callPlan"
				name='plan'
				text="计划节点任务分析" 
				>
			</v-title>
			<v-plan :list="planList"></v-plan>
			<v-title
				text="排行榜" 
				name='rank'
				@callRank="callRank"
				:isShow="true"
				path="/pagesA/rankList/rankList"
				>
			</v-title>
			<v-rank :list="RankList"></v-rank>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, watch, nextTick, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import util from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js'
	import { get } from '@/api/request.js';
	import ourLoading from '@/components/our-loading/our-loading';
	import vHeader from './components/Header';
	import vMenus from './components/Menus';
	import vTitle from '@/components/Title';
	import vCalendar from '@/components/Calendar';
	import vTasks from './components/Tasks';
	import vMqi from './components/Mqi';
	import vRoles from './components/Roles';
	import vProject from './components/Project';
	import vDefer from './components/Defer';
	import vPlan from './components/Plan';
	import vRank from './components/Rank';

	const store = mainDataStore();
	const { projectInfo, Authorization } = storeToRefs(store);
	const timer = ref(null);
	const timer2 = ref(null);
	const allFinished = ref(true);
	const Calendar = ref(false);
	const mqi = ref(false);
	const roles = ref(false);
	const project = ref(false);
	const defer = ref(false);
	const plan = ref(false);
	const rank = ref(false);
	const banners = ref(false);
	const calendarCall = ref(true);
	const projectCode = ref('');
	const m_taio_state = ref('');
	const taio_state = ref('');
	const c_taio_state = ref('');
	const r_taio_state = ref('');
	const taskList = ref([]);
	const roleList = ref([]);
	const projectInfos = ref({});
	const planList = ref([]);
	const RankList = ref([]);
	const bannerList = ref([]);
	const mqiChartData = reactive({
		categories:[],
		series:[
			{
				"name": "完成率",
				"data": 0,
				"color": "#309BFE",
				"legendShape":"circle"
			},
		],
		taskComplete:0,
		taskNotComplete:0,
	});
	const deferChartData = reactive({
		categories:[],
			series:[
				{
					"name": "延期任务数",
					"data": 0,
					"color": "#FFC836",
				},
			],
		taskDelayApprove:0,
		taskDelayExecute:0,
	});

	// 父组件回调
	const callMode = (e) => {
		m_taio_state.value = e;
	};
	const callRole = (e) => {
		taio_state.value = e;
	};
	const callPlan = (e) => {
		c_taio_state.value = e
	};
	const callRank = (e) => {
		r_taio_state.value = e
	};
	// 获取轮播
	const getBanner = async() => {
				const params = {
					data:{
						current:1,
						size:99999,	
					},
					url:'/360-manage-core-operatemanage/JournalismNotice/get/selectAll'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data.records.length > 0) {
								res.data.records.map(item =>{
									bannerList.value.push(item.journalism_rotation_url)
								});
							}
						}
					})
					.finally(()=> {
						banners.value = true;
					});
	};
	// 获取任务日历
	const getCalendar = async(date) => {
			const params = {
				data:{	
					project_code:projectCode.value,
					taskData:date,
					current:1,
					size:2,
					ctio_form:'0'
				},
				url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectAll'
			};
		await get(params)
			.then(res => {
				if(res.data){
					taskList.value = res.data.records || [];
				};
			})
			.finally(() => {
				Calendar.value = true;
			});
	};
	// 任务指标分析
	const getMqi = async() => {
		mqi.value = false;
		const params = {
			data:{
				project_code:projectCode.value,
				taio_state:m_taio_state.value
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectTaskAnalysis'
		};
		await get(params)
			.then(res => {
				if(res.data){
					const arcbar = util.arcbar;
					const { rates,taskComplete,taskNotComplete } = res.data;
					arcbar.title.name = `${rates}`;
					mqiChartData.series[0].data = Number(rates.slice(0,rates.length-1))/100;
					mqiChartData.taskComplete = taskComplete;
					mqiChartData.taskNotComplete = taskNotComplete;
				};
			})
			.finally(()=> {
				mqi.value = true;
			});
	};
	// 角色任务分析
		const getRoles = async() => {
				const params = {
					data:{
						project_code:projectCode.value,
						taio_state:taio_state.value
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectRoleAnalysis'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
								if(res.data) {
									if(res.data.length > 6) {
										for(let i = 0;i < 6;i++) {
											roleList.value[i] = res.data[i];
										}
									} else {
										roleList.value = res.data;
									}
								}
							};
						};
					})
					.finally(() => {
						roles.value = true;
					});
			};
	// 项目任务分析
		const getProject = async() => {
				const params = {
					data:{
						project_code:projectCode.value,
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectProjectAnalysis'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
								projectInfos.value = Object.assign({}, res.data);
							};
						};
					})
					.finally(() => {
						project.value = true;
					});
		};

	// 延期任务分析
		const getDefer = async() => {
				const params = {
					data:{
						project_code:projectCode.value
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectDelayAnalysis'
				};
				await get(params)
					.then(res => {
						if(res.data){
							
							const defer = util.defer;
							const { totalTaskDelay,taskDelayApprove,taskDelayExecute } = res.data;
							
							defer.title.name = `${totalTaskDelay}个`;
							
							deferChartData.series[0].data = taskDelayApprove/(taskDelayApprove+taskDelayExecute);
							
							deferChartData.taskDelayApprove = taskDelayApprove;
							deferChartData.taskDelayExecute = taskDelayExecute;
						};
					})
					.finally(()=> {
						defer.value = true;
					});
		};
	// 计划节点任务分析
		const getPlan = async() => {
				const params = {
					data:{
						project_code:projectCode.value,
						taio_state:c_taio_state.value
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectPlanNode'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
								planList.value = res.data;
							};
						};
					})
					.finally(() => {
						plan.value = true;
					});
		};
	// 排行榜
		const getRank = async() => {
				const params = {
					data:{
						project_code:projectCode.value,
						taio_state:r_taio_state.value
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectRankingList'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
								RankList.value = res.data || [];
							};
						};
					})
					.finally(() => {
						rank.value = true;
					});
		};
	// 监听
	watch(taio_state, (val) => {
		getRoles();
	},{deep:true,immediate:true});

	watch(c_taio_state, (val) => {
		getPlan();
	},{deep:true,immediate:true});

	watch(r_taio_state, (val) => {
		getRank();
	},{deep:true,immediate:true});

	watch(m_taio_state, (val) => {
		getMqi();
	},{deep:true,immediate:true});

	watch(
		() => projectInfo,
		(newVal, oldVal) => {
			if(newVal.value) {
				if(newVal.value.projectCode) {
					projectCode.value = newVal.value.projectCode
				} else {
					projectCode.value = ''
				}
				getMqi();
				getProject();
				getDefer();
				getRoles();
				getPlan();
				getRank();
				calendarCall.value = false;
				nextTick(() => {
					calendarCall.value = true;
				});
			}
		},
		{deep:true}
	);

	watch(
        () => [Calendar, roles, project, plan, rank, mqi, defer, banners],
        (newVal, oldVal) => {
			if(newVal[0].value && newVal[1].value && newVal[2].value && newVal[3].value && newVal[4].value && newVal[5].value && newVal[6].value && newVal[7].value) {
				allFinished.value = false;
			} else {
				allFinished.value = true;
			}
        },
		{
			deep:true,
			immediate:true
		}
    );

	onLoad(() => {	
		const query = {
			current:1,
			size:15,
			isTime:true
		};
		store.getMessages(query); //消息
		store.getCommission(); //代办下标
		timer.value = setInterval(() => {
			store.getMessages(query);
		},60000);//消息轮询
		timer2.value = setInterval(() => {
			store.getAuthorization(uni.getStorageSync('user_fkid'));
		},10000);//权限轮询
		getDefer();
		getProject();
		getBanner();
	});

	onUnmounted(() => {
		clearInterval(timer.value);
		clearInterval(timer2.value)
		timer.value = null;
		timer2.value = null;
	});

</script>

<style lang="scss">
.index{
		position: relative;
		
		.body{
			border-radius: 24rpx;
			background-color: #FFFFFF;
			padding: 40rpx;
			margin-top: -30rpx;
		}
	}
</style>
