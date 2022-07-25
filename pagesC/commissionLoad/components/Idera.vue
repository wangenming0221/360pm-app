<template>
	<uni-popup ref="myIdea" :mask-click="false">
		<view class="commissionLoad-c-buttons">
			<view class="ccb-header">
				<view @click="close">
					取消
				</view>
				<view>
					{{ isType === 0 ? '审批通过':'审批驳回' }}
				</view>
				<view @click="TaskApp">
					确定
				</view>
			</view>
			<view class="ccb-textarea">
				<uni-easyinput
					type="textarea"
					 :inputBorder="false"
					v-model="describe" 
					:maxlength="300"
					placeholder="请输入审批意见" />
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { ref } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { jsonPost } from '@/api/request.js';
	
	
	const store = mainDataStore();
	const { userInfo, taskList } = storeToRefs(store);
	const myIdea = ref();
	const describe = ref('');
	const isType = ref(0);
	const isMessagesInfo = ref({});
	
	const open = (type, messagesInfo) => {
		isType.value = type;
		isMessagesInfo.value = Object.assign({}, messagesInfo);
		myIdea.value.open('center')
	};
	
	const close = () => {
		describe.value = '';
		myIdea.value.close();
	};
	
	const TaskApp = () => {
		// if(props.messagesInfo.taio_state != '3') {
		// 	uni.showToast({
		// 		title:'任务完成后才可审批!',
		// 		icon:'none'
		// 	});
		// 	return;
		// }
		const {
			examine_user_fkid, 
			taio_task_name,
			common_file,
			taio_pkid,
			user_fkid,
			user_name,
			nick_name,
			project_name,
			task_name
		} = isMessagesInfo.value;
		const params = {
			data:{
				user_id_nowapp:examine_user_fkid,//审批人id
				user_name_nowapp:userInfo.value.user.nickName, //当前账号的姓名,审批人姓名
				progress_describe:describe.value, //描述
				progress_title:taio_task_name, //标题
				fileList:common_file, //附件
				taio_pkid:taio_pkid, //任务ID
				user_fkid:user_fkid, //任务执行ID
				user_name:nick_name, //任务执行人姓名
				project_name:project_name, //项目名
				task_name:taio_task_name, //任务名
			},
			url:`/360-manage-core-operatemanage/TaskOperation/modify/${isType.value === 0 ? 'TaskAppYes' : 'TaskAppNo'}`
		};
		jsonPost(params)
			.then(res => {
				if(res.success) {
					close();
					uni.showToast({
						title:'成功',
						icon:'success'
					});
					taskList.value = [];
					store.getTaskList(); //代办任务列表
					setTimeout(() => {
						uni.switchTab({
							url:`/pages/commission/commission`
						});
					},1000);
				} else {
					uni.showToast({
						title:'失败',
						icon:'error'
					});
				}
			});
	};
	
	defineExpose({
		open
	});
	
</script>

<style lang="scss">
	.commissionLoad-c-buttons{
		width: 600rpx;
		background-color: #fff;
		border-radius: 12rpx 12rpx 0 0;
		
		.ccb-header{
			border-bottom: 1px solid rgb(233, 233, 233);
			padding: 30rpx;
			font-size: 32rpx;
			display: flex;
			justify-content: space-between;
			color: #409EFF;
			
			view:nth-child(2) {
				color: #333;
				font-weight: bold;
			}
		}
		.ccb-textarea{
			width: 90%;
			margin: 0 auto;
		}
	}
</style>