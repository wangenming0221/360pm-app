<template>
	<view class="calendar">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<view class="box" :style="{'height':isShow ? 'auto':'250rpx'}">
			<v-calendar @getCalendar="getCalendar" titleColor="#ffffff"  dayColor="#ffffff"></v-calendar>
		</view>
		<view class="control">
			<view class="child" @click="control">
				<uni-icons :type="isShow ? 'top':'bottom'" size="18" color="#c4c6c9"></uni-icons>
			</view>
		</view>
		
		<v-box :list="list"></v-box>
		<v-no-data v-show="noShow"></v-no-data> 
		<uni-load-more v-show="total > 15" :status="status" />
	</view>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { onReachBottom } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import ourLoading from '@/components/our-loading/our-loading';
	import vCalendar from '@/components/Calendar';
	import vBox from './components/Box';
	import vNoData from '@/components/NoData';
     
	const allFinished = ref(true);
	const isShow = ref(false);
	const mDate = ref('');
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
	// 获取任务日历
	const getList = async() => {
		const params = {
			data:{
				taskData:mDate.value,
				urrent:page.value,
				size:size.value,
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectCalendarList'
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
					timer2.value = setTimeout(() => {
						if(list.value.length === 0){
							noShow.value = true
						}
					},1000);
				}
			})
			.finally(()=>{
				status.value = 'more';
				allFinished.value = false;
			});
	};

	const control = () => {
		isShow.value = !isShow.value;
	};

	const getCalendar = (date) => {
		allFinished.value = true;
		mDate.value = date;
	};

	onReachBottom(() => {
		handleBottom();
	});

	watch(mDate, (val) => {
		if(val){
			list.value = [];
			page.value = 1;
			noShow.value = false
			clearTimeout(timer2.value);
			timer2.value = null
			getList();

		}
	},{deep:true});

	onUnmounted(() => {
		clearTimeout(timer.value);
		clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null;
	});
	
</script>

<style lang="scss" scoped>
	.calendar{
		padding-bottom: 40rpx;
		
		.box{
			width: 100%;
			overflow: hidden;
		}
		.control{
			
			.child{
				width: 150rpx;
				height: 50rpx;
				margin: 0 auto;
				background-color: #5882FF;
				border: 1px solid #ffffff;
				border-radius: 12rpx 12rpx 0 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
