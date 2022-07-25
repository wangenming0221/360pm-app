<template>
	<view class="commissionLoad-c-buttons">
		<view class="commissionLoad-c-buttons-box">
		<view class="item" v-if="taio_alt3 && status != '2'">	
			<button 
				type="primary" 
				size="mini"
				@click="goPath('/pagesC/commTransfer/commTransfer')">
				任务转办
			</button>
		</view>
		<view class="item" v-if="status == '1'">
			<button 
				type="primary" 
				size="mini"
				@click="goPath('/pagesC/commRefer/commRefer')">
				任务提交
			</button>
		</view>
		<view class="item" v-if="status == '1'">
			<button
				type="primary" 
				size="mini"
				@click="goPath('/pagesC/commProgress/commProgress')">
				进度反馈
			</button>
		</view>
		<view class="item" v-if="status == '3'">
			<button 
				type="primary" 
				size="mini"
				@click="Transfer(true)">
				接受
			</button>
		</view>
		<view class="item" v-if="status == '3'">
			<button 
				type="warn" 
				size="mini"
				@click="Transfer(false)">
				拒绝
			</button>
		</view>

		<view class="item" v-if="status == '2'">
			<button 
				type="primary" 
				size="mini"
				@click="TaskApp(0)"
				>
				任务通过
			</button>
		</view>
		<view class="item" v-if="status == '2'">
			<button 
				type="warn" 
				size="mini"
				@click="TaskApp(1)"
				>
				任务驳回
			</button>
		</view>
		</view>
		<v-popup ref="popup" />
		<v-idera ref="idera" />
	</view>
</template>

<script setup>
	import { ref, computed, watch } from 'vue';
	import vPopup from './Popup';
	import vIdera from './Idera';

	const props = defineProps({
		messagesInfo:{
			type:Object,
			default:() => {}
		}
	});
	
	const status = ref('');
	const popup = ref();
	const idera = ref();
	const taio_alt3 = ref('');

	const goPath = (e) => {
		uni.navigateTo({
			url:`${e}?messagesInfo=${JSON.stringify(props.messagesInfo)}`
		});
	};

	const Transfer = (e) => {
		popup.value.getInfo(e, 'Transfer', props.messagesInfo);
	};
	//任务通过
	const TaskApp = (type) => {
		idera.value.open(type, props.messagesInfo);
	};
	
	watch(
		() => props.messagesInfo,
		(newVal, oldVal) => {
			if(!newVal) return;
			taio_alt3.value = newVal.taio_alt3=='1' && newVal.taio_state !='3';
			const reg = RegExp(`${uni.getStorageSync('user_fkid')}`);
			if(newVal.taio_state == '7') { //已完成待审批任务
				if(newVal.examine_user_fkid && reg.exec(newVal.examine_user_fkid)) {
					status.value = '2';//待审批
					return;
				}
			}
			if(newVal.taio_state != '3') { //未完成任务
				if(newVal.taio_alt4 && reg.exec(newVal.taio_alt4)) {
						status.value = '3';//待接受
				} else {
						status.value = '1'; //待执行	1010577（进度反馈，任务提交
				}
			}else {
				status.value = '';
			}
		},
		{deep:true}
	);

</script>

<style lang="scss">
	.commissionLoad-c-buttons{
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
		
		.commissionLoad-c-buttons-box{
			padding: 40rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-around;
			color: #409EFF;
			
			view:nth-child(2){
				color: #333333;
				font-weight: bold;
			}
		}
	}
</style>
