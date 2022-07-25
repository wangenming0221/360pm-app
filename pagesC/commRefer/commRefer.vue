<template>
	<our-loading isFullScreen :active="allFinished" text="loading..." />
	<view class="commRefer">
		<uni-forms 
				:errorType="errorType"
				labelWidth="auto"
				labelPosition="top"
				:modelValue="model"
				:rules="rules"
				ref="uForm"
				:border="true">
				<!-- <uni-forms-item :required="required" label="标题" name="progress_title" >
					<uni-easyinput 
						v-model="model.progress_title" 
						:inputBorder="false" 
						placeholder="请输入标题"
					/>
				</uni-forms-item> -->
				<uni-forms-item :required="required" label="实际完成时间" name="taio_finsh_time" >
					<picker
					mode="date" 
					:value="model.taio_finsh_time" 
					@change="dateChange">
						<view style="display: flex;align-items:center;">
							<text 
								:style="{color:model.taio_finsh_time ? '#273052':'#C0C5D4'}">
								{{ model.taio_finsh_time ? model.taio_finsh_time : '请选择实际完成时间' }}
							</text>
							<view style="margin-left: auto;">
								<uni-icons type="forward"></uni-icons>
							</view>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item :required="required" label="反馈描述" name="progress_describe" >
					<uni-easyinput
						type="textarea"
						 :inputBorder="false"
						v-model="model.progress_describe" 
						:maxlength="300"
						placeholder="请输入反馈描述" />
				</uni-forms-item>

				<uni-forms-item :required="required" label="上传附件" name="annex" >
					<v-upload type="commRefer" :isSize="true" @changeList="changeList"></v-upload>
				</uni-forms-item>
		</uni-forms>
		<view class="button">
			<button type="primary" @click="submit">提交审核</button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { jsonPost } from '@/api/request.js';
	import vUpload from '@/components/Upload';
	import ourLoading from '@/components/our-loading/our-loading';
	
	const date = new Date();
	const year = date.getFullYear(); //当前年
	const month = date.getMonth()+1; //当前月
	const day = date.getDate(); //当前日
	const mDay = day < 10 ? `0${day}` : day;
	const mMonth = month < 10 ? `0${month}` : month;
	
	const store = mainDataStore();
	const { taskList } = storeToRefs(store);
	const uForm = ref();
	const errorType = 'undertext';
	const allFinished = ref(false);
	const required = ref(true);
	const model = reactive({
		taio_pkid:'',
		// progress_title:'',
		taio_finsh_time:`${year}-${mMonth}-${mDay}`,
		progress_describe:'',
		annex:[],
		project_code:'',
	});


	const rules = ref({
		// progress_title: {
		// 	rules: [{
		// 		required: true,
		// 		errorMessage: '请输入标题'
		// 	}]
		// },
		taio_finsh_time: {
			rules: [{
				required: true,
				errorMessage: '请选择完成时间'
			}]
		},
		progress_describe: {
			rules: [{
				required: true,
				errorMessage: '请输入描述'
			}]
		},
	});

	const dateChange = (e) => {
		model.taio_finsh_time = e.detail.value
	};
	// 获取图片列表
	const changeList = (list) => {
		model.annex = list;
	};
	// 提交
	const submit = () => {
		uForm.value.validate().then(res => {
			if(model.annex.length === 0) {
				uni.showToast({
					title:'请上传附件',
					icon:'none'
				});
				return	
			}
			allFinished.value = true;
			const params = {
				data: {
					taio_pkid:model.taio_pkid, //任务主键
					taio_finsh_time:model.taio_finsh_time, //完成时间
					progress_describe:model.progress_describe, //描述
					// progress_title:model.progress_title, //标题
					project_code:model.project_code,
					fileList:model.annex, //附件
				},
				url: '/360-manage-core-operatemanage/TaskOperation/modify/updateTask'
			};
			jsonPost(params)
				.then(res => {
					if(res.success) {
						allFinished.value = false;
						uni.showToast({
							title:'提交成功',
							icon:'success'
						});	
						taskList.value = [];
						store.getTaskList(); //代办任务列表
						setTimeout(() => {
							uni.switchTab({
								url:`/pages/commission/commission`
							});
						},1000)
					} else {
						allFinished.value = false;	
						uni.showToast({
							title:'提交失败',
							icon:'error'
						})
					}
				});
		}).catch(errors => {
			allFinished.value = false;	
			uni.showToast({
				title:'请完善表单',
				icon:'error'
			});
		});
	};

	onLoad((options) => {
        if(options.messagesInfo) {
			model.taio_pkid = JSON.parse(options.messagesInfo).taio_pkid;
			model.project_code = JSON.parse(options.messagesInfo).project_code;
        }
    });
</script>

<style lang="scss">
	.commRefer{
		width: 90%;
		margin: 0 auto;
		
		.button{
			margin-top: 100rpx;
			margin-bottom: 100rpx;
		}
	}
</style>
