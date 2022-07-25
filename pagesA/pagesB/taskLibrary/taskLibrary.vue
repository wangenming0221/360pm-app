<template>
	<view class="taskLibrary">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<v-ring-header />
		<view class="publish" @click="goPage">任务库清单</view>
		<view class="box">
			<vCharts @changeYear="changeYear" :chartData="chartData" :status="status"></vCharts>
			<u-gap height="15" bgColor="#EFF4F6"></u-gap>
			<view class="title">中心部门任务完成分析</view>
			<vProgress :list="list"></vProgress>	
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, watch } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import util from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js'
	import { get } from '@/api/request.js';
	import ourLoading from '@/components/our-loading/our-loading';
	import vRingHeader from '@/components/RingHeader';
	import vCharts from './components/Charts';
	import vProgress from './components/Progress';

	const allFinished = ref(true);
	const status = ref(false);
	const listShow = ref(false);
	const list = ref([]);
	const year = ref(new Date().getFullYear());
	const chartData = reactive({
				  categories:[],
				  series:[
					{
					    "data": [
					        {
					            "name": "延期进行",
					            "value": 0,
								"backgroundColor":'#FF7A8C',
								"num":''
					        },
					        {
					            "name": "正常进行",
					            "value": 0,
								"backgroundColor":'#FFC542',
								"num":''
					        },
					        {
					            "name": "未触发",
					            "value": 0,
								"backgroundColor":'#24D2D3',
								"num":''
					        },
					        {
					            "name": "已完成",
					            "value": 0,
								"backgroundColor":'#52C1F5',
								"num":''
					        }
					    ]
					}
				  ],
	});

	// 获取延期任务列表
	const getInfo = async(val) => {
				status.value = false;
				const params = {
					data:{
						year:val
					},
					url:'/360-manage-core-operatemanage/companytask/get/selectCompanyType'
				};
				await get(params)
						.then(res => {
							if(res.data){
								const ring = util.ring;
								chartData.series[0].data[0].value = res.data.delayNum;
								chartData.series[0].data[1].value = res.data.conductNum;
								chartData.series[0].data[2].value = res.data.notTriggeredNum;
								chartData.series[0].data[3].value = res.data.completeNum;
								ring.subtitle.name = `${res.data.totalNum}个`;
							}
						})
						.finally(()=>{
							status.value = true;
						});
	};
	const getList = async(val) => {
				const params = {
					data:{
						year:val
					},
					url:'/360-manage-core-operatemanage/companytask/get/selectCompleteAnalysis'
				};
				await get(params)
						.then(res => {
							if(res.data){
								list.value = res.data;
							}
						})
						.finally(()=>{
							listShow.value  = true;
						});
	};

	const changeYear = (e) => {
		year.value = e;
	};
	const goPage = () => {
		uni.navigateTo({
			url:'/pagesB/taskStore/taskStore'
		});
	};

	watch(
		() => [status, listShow],
		(newVal, oldVal) => {
			if(status.value && listShow.value){
				allFinished.value = false;
			}else{
				allFinished.value = true;
			};
		},
		{deep:true, immediate:true}
	);

	watch(year, (val) => {
		getInfo(val)
		getList(val)
	},{deep:true, immediate:true});


</script>

<style lang="scss">
	.taskLibrary{
		
		.publish{
			height: 100rpx;
			line-height: 100rpx;
			width: 90%;
			margin: 0 auto;
			font-size: 36rpx;
			text-align: right;
			color: #FFFFFF;
			font-weight: bold;
			letter-spacing: 6rpx;
		}
		
		.box{
			width: 90%;
			margin: 0 auto;
			background-color: #FFFFFF;
			
			.title{
				padding: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
			}
		}
	}
</style>
