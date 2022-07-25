<template>
	<uni-popup
	background-color="#FFFFFF"
	ref="unip" 
	type="center"
	:round="12">
	<view class="commissionLoad-c-popup">
		<uni-forms
			:labelStyle="labelStyle"
			:errShowType="errorType"
			labelWidth="auto"
			labelPosition="left"
			:modelValue="model"
			ref="uForm"
			:border="true">	

			<uni-forms-item 
				:required="required" 
				label="转办人姓名" 
				v-if="classify === 'Transfer'">
				<view style="padding-top: 20rpx;">
					{{ messagesInfo.nick_name }}
				</view>
			</uni-forms-item>

			<uni-forms-item 
				:required="required"
				label="接收人姓名"
				name="user_name_tramsfer" 
				v-if="classify === 'Transfer'">
				<uni-easyinput 
					disabled
					v-model="model.user_name_tramsfer" 
					:inputBorder="false" 
					placeholder="请输入接收人姓名"
				/>
			</uni-forms-item>

		</uni-forms>
		<view class="submit">
			<button  type="primary" size="mini" @click="submit">确定</button>
		</view>
	</view>
	    <!-- <view class="commissionLoad-c-popup">
			<view class="header">
				<view class="item" @click="show = false">取消</view>
				<view class="item">审批通过</view>
				<view class="item">通过</view>
			</view>
			<view class="area-box">
				<textarea
					class="mtextarea"
					:maxlength="300"
					:adjust-position="false"
					v-model="opinion" 
					placeholder="请输入审批意见">
				</textarea>
			</view>
	        <view class="bottom" v-if="!type">
				<uni-data-checkbox v-model="groupVal" :localdata="radiolist"/>
			</view>
	    </view> -->
	</uni-popup>
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import { jsonPost } from '@/api/request.js';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	
	const store = mainDataStore();
	const { userInfo,taskList } = storeToRefs(store);
	const unip = ref();
	const messagesInfo = ref({});
	const status = ref(false);	
	const classify = ref('');
	const errorType = 'undertext';
	const required = ref(true);
	const uForm = ref();
	const model = reactive({
		user_name_tramsfer:userInfo.value.user.nickName
	});

	const submit = () => {
		if(classify.value === 'Transfer') {
			if(model.user_name_tramsfer == '' || !model.user_name_tramsfer) {
				uni.showToast({
					title:'请将表单填写完整',
					icon:'error'
				});
				return;
			}
		}
			const params = {
				data:{
					taio_alt4:status.value ? messagesInfo.value.taio_alt4 : '',
					taio_pkid:messagesInfo.value.taio_pkid, //任务主键
					user_name:messagesInfo.value.nick_name, //转办人
					user_name_tramsfer:model.user_name_tramsfer, //接收人
					user_fkid:messagesInfo.value.user_fkid, //转办人ID
					project_name:messagesInfo.value.project_name, //项目名
					task_name:messagesInfo.value.taio_task_name, //任务名
				},	
				url:status.value ? '/360-manage-core-operatemanage/TaskOperation/modify/TaskTransferYes' : '/360-manage-core-operatemanage/TaskOperation/modify/TaskTransferNo',
			};
			jsonPost(params)
				.then(res => {
					if(res.success) {
						uni.showToast({
							title:res.msg,
							icon:'success'
						});
						taskList.value = [];
						store.getTaskList(); //代办任务列表
						setTimeout(() => {
							uni.switchTab({
								url:`/pages/commission/commission`
							});
						},1500);
					} else {
						uni.showToast({
							title:'提交失败',
							icon:'error'
						})
					}
				});
	};
	
	const groupVal = ref(0);
	const opinion = ref('');

	const radiolist = [
		{
			text: '驳回到执行人',
			value:0,
		},
		{
			text: '审批回退',
			value:1,
		},
	];

	const getInfo = (prostatus, proclassify, info) => {
		status.value = prostatus;
		classify.value = proclassify;
		messagesInfo.value = Object.assign({}, info);
		unip.value.open();
	};

	defineExpose({
		getInfo
	});
</script>

<style lang="scss">
	.commissionLoad-c-popup{
		width: 600rpx;
		padding: 30rpx;
		border-radius: 12rpx;
		
		
		.submit{
			text-align: right;
		}
	}
</style>
