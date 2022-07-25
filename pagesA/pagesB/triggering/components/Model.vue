<template>
	<view class="triggering-c-model">
		<view class="box">
			<uni-forms
					:errShowType="errorType"
					labelWidth="auto"
					labelPosition="left"
					:modelValue="model"
					:rules="rules"
					ref="uForm"
					:border="true">				
				<uni-transition mode="fade" :show="selected == '一次性任务'">
				<v-headLine v-if="selected == '一次性任务'" title="一次性任务" />	
				<view class="itemView">

					<uni-forms-item :required="required" v-if="selected == '一次性任务'" label="计划开始时间" name="startTime" >
						<picker
							mode="date" 
							:value="model.startTime" 
							@change="startChange">
							<view style="display: flex;align-items:center;">
								<text 
									:style="{color:model.startTime ? '#273052':'#C0C5D4'}">
									{{ model.startTime ? model.startTime : '请选择计划开始时间' }}
								</text>
								<view style="margin-left: auto;">
									<uni-icons type="forward"></uni-icons>
								</view>
							</view>
						</picker>
					</uni-forms-item>
					
					<uni-forms-item :required="required" v-if="selected == '一次性任务'" label="计划结束时间" name="endTime" >
						<picker	
							mode="date" 
							:value="model.endTime" 
							@change="endChange">
							<view style="display: flex;align-items:center;">
								<text 
									:style="{color:model.endTime ? '#273052':'#C0C5D4'}">
									{{ model.endTime ? model.endTime : '请选择计划结束时间' }}
								</text>
								<view style="margin-left: auto;">
									<uni-icons type="forward"></uni-icons>
								</view>
							</view>
						</picker>
					</uni-forms-item>
				</view>
				</uni-transition>
				
				<uni-transition mode="fade" :show="selected == '周期性任务'">
				<vHeadLine v-if="selected == '周期性任务'" title="周期性任务" />	
				<view class="itemView">
					<uni-forms-item :required="required" v-if="selected == '周期性任务'" label="触发规则" name="ctio_pro_time_tm" >
						<picker	
							mode='selector'
							:range="rule"
							range-key="name"
							@change="handleSelect">
							<view style="display: flex;align-items:center;">
								<text 
									:style="{color:model.ctio_pro_time_tm ? '#273052':'#C0C5D4'}">
									{{ model.rule }}
								</text>
								<view style="margin-left: auto;">
									<uni-icons type="forward"></uni-icons>
								</view>
							</view>
						</picker>
					</uni-forms-item>

					
					<uni-forms-item :required="required" v-if="selected == '周期性任务'" label="发送时间" name="startTime" >
						<picker
							mode="date" 
							:value="model.startTime" 
							@change="startChange">
							<view style="display: flex;align-items:center;">
								<text 
									:style="{color:model.startTime ? '#273052':'#C0C5D4'}">
									{{ model.startTime ? model.startTime : '请选择发送时间' }}
								</text>
								<view style="margin-left: auto;">
									<uni-icons type="forward"></uni-icons>
								</view>
							</view>
						</picker>
					</uni-forms-item>
					
					
					<uni-forms-item :required="required" v-if="selected == '周期性任务'" label="完成时限（小时）" name="limit" >
						<uni-number-box :min="0" v-model="model.limit"></uni-number-box>
					</uni-forms-item>
					
					
					<uni-forms-item :required="required" v-if="selected == '周期性任务'" label="结束时间" name="endTime" >
						<picker	
							mode="date" 
							:value="model.endTime" 
							@change="endChange">
							<view style="display: flex;align-items:center;">
								<text 
									:style="{color:model.endTime ? '#273052':'#C0C5D4'}">
									{{ model.endTime ? model.endTime : '请选择结束时间' }}
								</text>
								<view style="margin-left: auto;">
									<uni-icons type="forward"></uni-icons>
								</view>
							</view>
						</picker>
					</uni-forms-item>
				</view>
				</uni-transition>
				
				<uni-forms-item :required="required" label="提醒方式" prop="remind_mode" >
					<uni-data-checkbox v-model="model.remind_mode" :localdata="radiolist" />
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch, reactive } from 'vue';
	import vHeadLine from '@/components/HeadLine';
	import { jsonPost } from '@/api/request.js';

	const props = defineProps({
		selected:{
			type:String,
			default:() => ''
		},
		firstInfo:{
			type:Object,
			default:() => {}
		},
	});
	const required = ref(true);
	const uForm = ref();
	const rule = [
		{
			name:'月',
			id:0,
		},
		{
			name:'周',
			id:1,
		},
		{
			name:'天',
			id:2,
		}
	];
	const map = {
		text:'name',
		value:'id'
	};
	const radiolist = [
		{
			text: '手机',
			value:0,
		},
		{
			text: '微信',
			value:1,
		},
		{
			text: '全部',
			value:2,
		},
	];
	const errorType = 'undertext';

	const model = reactive({
		rule:'请选择',
		ctio_pro_time_tm:'',
		limit:'',
		startTime:'',
		endTime:'',
		remind_mode:0,
	});
	const rules = ref({});

	watch(
		() => props.selected,
		(newVal, oldVal) => {
			rules.value = {};
			var obj = {};
			if(newVal == '一次性任务') {
				obj = {
					startTime: {
						rules: [{
							required: true,
							errorMessage: '请选择开始时间'
						}]
					},
					endTime: {
						rules: [{
							required: true,
							errorMessage: '请选择结束时间'
						}]
					},
				};
			} else {
				obj = {
					startTime: {
						rules: [{
							required: true,
							errorMessage: '请选择开始时间'
						}]
					},
					endTime: {
						rules: [{
							required: true,
							errorMessage: '请选择结束时间'
						}]
					},
					ctio_pro_time_tm: {
						rules: [{
							required: true,
							errorMessage: '请选择触发规则'
						}]
					},
					limit: {
						rules: [{
							required: true,
							errorMessage: '请输入完成时限'
						}]
					},
				};
			};
			rules.value = Object.assign({}, obj);
		},
		{deep:true}
	);
	// 选择规则
	const handleSelect = (e) => {
		model.rule = rule[e.detail.value].name;
		model.ctio_pro_time_tm = rule[e.detail.value].id;
	};
	const startChange = (e) =>{
		model.startTime = e.detail.value
	};
	const endChange = (e) =>{
		model.endTime = e.detail.value
	};
	// 提交
	const submit = () => {
				if(props.selected == '选择任务类型'){
					uni.showToast({
						title:'请选择任务类型',
						icon:'none'
					})
					return;
				};
				uForm.value.validate().then(res => {
					const { 
						taskName,
						projectId,
						user_id,
						company_import_degree,
						archives_pkid,
						approval,
						describe,
						annex
					} = props.firstInfo;
					
					const params = {
						data:{
							ctio_task_name:taskName, //任务名称
							ctio_remind_mode:model.remind_mode, //提醒方式
							project_code:projectId, //项目名称 当前java为项目编码
							user_id:user_id.toString(), //执行人员
							company_import_degree:company_import_degree, // 重要程度
							archives_fkid:archives_pkid, // 业务线
							ctio_form:1, //默认传1
							ctio_is_approve:approval == true ? '0':'1', //是否审批
							ctio_describe:describe, //任务描述
							List:annex, //附件
							ctio_task_tm:props.selected == '一次性任务' ? '0':'1', // 任务类型
							ctio_time_begin:model.startTime, // 计划开始时间
							ctio_time_end:model.endTime, // 计划开始结束
							ctio_pro_time_tm:model.ctio_pro_time_tm,// 触发规则
							ctio_finish_time:model.limit// 完成时限
						},
						url:'/360-mobile-api/CommonTaskInfo/new/insertPhoneProjectTask',
					};
					jsonPost(params)
						.then(res => {
							if(res.success) {
								uni.showToast({
									title:'发布成功!',
									icon:'success'
								})
								checkList.value = [];
								reviewObj.value = {};
							}
							setTimeout(() => {
								uni.switchTab({
									url:'/pages/index/index'
								});
							},1000);
						});
				}).catch(error => {
					uni.showToast({
						title:'请将表单填写完整',
						icon:'none'
					})
				})
	};

	defineExpose({
		submit
	});

</script>

<style lang="scss">
	.triggering-c-model{
		width: 95%;
		margin: 0 auto;
		background-color: #FFFFFF;

		text{
			color: #C0C5D4;
			font-size: 32rpx;
		}
		
		.box{
			width: 90%;
			min-height: 700rpx;
			margin: 0 auto;
			
			.itemView{
				padding-left: 20rpx;
			}
		}
	}
</style>
