<template>
	<uni-drawer
		ref="showRight" 
		mode="right" 
		:width="260"
		:mask-click="true"
		@change="scrollShow"
	>
		<scroll-view style="height: 100%;padding: 20rpx;" scroll-y="true" v-if="type === 1">
			<view
			    class="item"
			    v-for="(item,index) of planList"
			    :key="index">
			    <view class="name">
			        {{ item.baseProcessesName }}
			    </view>
			    <view class="phone"> </view>
			    <view class="checkbox" @click="lookDetail(item)">
			      查看
			    </view>
			</view>
		</scroll-view>
		<scroll-view
		 @scrolltolower="handleBottom"
		style="height: 100%;padding: 20rpx;" 
		scroll-y="true" 
		v-if="type === 2">
			<view v-if="childList.children">
				<view v-for="(item,index) of childList.children" :key="index">
					<view
						class="item">
						<view class="name">
							{{ item.name }}
						</view>
						<view class="phone"> </view>
						<view class="checkbox" @click="lookChild(item)">
						  查看
						</view>
					</view>
				</view>
			</view>
			<view class="listEmpty" v-if="!childList.children">
			    <uni-icons type="mail-open" size="40" color="rgba(0,0,0,0.4)"></uni-icons>
			    <text>暂无数据。。。</text>
			</view>
	
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
	import { ref, watch, onUnmounted } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { get, post } from '@/api/request.js';
	
	const props = defineProps({
		processId:{
			type:String,
			default:() => ''
		},
	});

	const planList = ref([]);
	const childList = ref([]);
	const store = mainDataStore();
	const { projectInfo } = storeToRefs(store);
	
	// 一级
	const getPlan = async() => {
				const params = {
					data:{
						project_code:projectInfo.value.projectCode ? projectInfo.value.projectCode : '',
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
					});
	};
	//子节点
	const getChild = async() => {
				const params = {
					data:{
						project_code:projectInfo.value.projectCode ? projectInfo.value.projectCode : '',
						id:props.processId,
					},
					url:'/360-manage-core-operatemanage/baseProcesses/getbaseprocess'
				};
				await post(params)
					.then(res => {
						if(res.data){
							childList.value = res.data;
						};
					});
	};
	
	const showRight = ref(null);
	const type = ref(1);
	
	const open = (e) => {
		type.value = e;
		switch(e) {
			case 1:
				getPlan();
			break;	
			case 2:
				getChild();
			break;	
		}
		showRight.value.open();
	};

	const emits = defineEmits(['scrollShow','lookDetail','lookChild'])
	
	const scrollShow = (e) => {
        emits('scrollShow', e);
    };
	
	const lookDetail = (options) => {
		emits('lookDetail', options);
		showRight.value.close();
	};
	const lookChild = (options) => {
		emits('lookChild', options);
		showRight.value.close();
	};
	
	defineExpose({
	    open
	});

</script>

<style lang="scss">
		.item{
            width: 90%;
            margin: 0 auto;
            height: 120rpx;
            display: flex;
            align-items: center;
            border-top: 1px solid #E3E3E3;
            color: #49496A;
            font-size: 32rpx;

            .header{
                height: 65rpx;
                width: 65rpx;
                margin-right: 40rpx;
            }
            .name{
                width: 75%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .checkbox{
             font-size: 30rpx;
             color: #17C977;
             display: flex;
             align-items: center;
            }
        }
</style>
