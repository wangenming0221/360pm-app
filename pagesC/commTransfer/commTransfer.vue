<template>
 <our-loading isFullScreen :active="allFinished" text="loading..." />
	<view class="commRefer">
		<uni-forms
				:labelStyle="labelStyle"
				:errorType="errorType"
				labelWidth="auto"
				labelPosition="top"
				:modelValue="model"
				:rules="rules"
				ref="uForm"
				:border="true">

                <uni-forms-item :required="required" label="执行人" name="user_name_old" label-position="left">
					<view class="forms_item_view">
						{{ model.user_name_old }}
					</view>
				</uni-forms-item>
			
				<uni-forms-item :required="required" label="转办人" name="user" label-position="left">
					<view
						@click="handleReview" 
						v-if="JSON.stringify(model.user) == '{}'"
                        class="forms_item_view"  
						style="color:rgba(0,0,0,0.4);">
						请选择
					</view>
					<view class="forms_item_view" @click="handleReview" v-else>
						{{ model.user.nickName }}
					</view>
				</uni-forms-item>

       
		</uni-forms>
		<view class="button">
			<button type="primary" @click="submit">提交转办</button>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, computed } from 'vue';
    import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
    import { onLoad } from '@dcloudio/uni-app';
    import { get, jsonPost } from '@/api/request.js';
    import ourLoading from '@/components/our-loading/our-loading';

    const store = mainDataStore();
	const { reviewObj, userInfo,taskList } = storeToRefs(store);
	const uForm = ref();
	const errorType = 'undertext';
    const required = ref(true);
    const allFinished = ref(false);
	
	const model = reactive({
		id_fkid:'',
        user:computed({
			get() {
				return reviewObj.value
			},
			set(value) {}
		}), //被转办人
        user_name_old:'', //转办人名称
        user_fkid_old:'', //转办人id
        task_type:'2', //任务类型
        task_state: '', //任务状态
        task_code: '', //任务编码
        task_name: '', //任务名称
        projectCode: '', //项目名称编码
		task_firing_time:'', //开始时间
		task_finish_time:'', //结束时间
        project_name: '请选择', //项目名称
	});
    const rules = ref({	
    });

   
    //选择被转办人
    const handleReview = () => {
        uni.navigateTo({
            url:`/pagesB/review/review`
        });
    };

	const submit = () => {
		uForm.value.validate()
			.then(res => {
				if(JSON.stringify(model.user) == '{}') {
					uni.showToast({
						title:'请选择被转办用户',
						icon:'none'
					});
					return	
				}
				allFinished.value = true;
				const params = {
					data:{
						id_fkid:model.id_fkid, //任务主键
						user_fkid_old:model.user_fkid_old,	//转办用户
						user_name_old:model.user_name_old, //转办用户名
						user_fkid:model.user.userId+'', //被转办用户
						user_name:model.user.nickName, //被转办用户名
						task_type:model.task_type, //任务类型
						task_state:model.task_state, //任务状态
						task_code:model.task_code, //task_state
						task_name:model.task_name, //任务名称
						project_name:model.project_name, //项目名称
						task_firing_time:model.task_firing_time, //开始时间
						task_finish_time:model.task_finish_time, //结束时间
					},	
					url:'/360-manage-core-operatemanage/TaskOperation/modify/TaskTransfer',
				};	
				jsonPost(params)
					.then(res => {
						if(res.success) {
							uni.showToast({
								title:'转办成功',
								icon:'success'
							});
							reviewObj.value = {};
							taskList.value = [];
							store.getTaskList(); //代办任务列表
							allFinished.value = false;
							setTimeout(() => {
								uni.switchTab({
									url:`/pages/commission/commission`
								});
							},1000);
						} else {
							allFinished.value = false;	
							uni.showToast({
								title:'提交失败',
								icon:'error'
							})
						}
					});
			}).catch(error => {
				allFinished.value = false;
				uni.showToast({
					title:'请将表单填写完整',
					icon:'none'
				})
			})

		
	};

    onLoad((options) => {
        if(options.messagesInfo) {
			model.id_fkid = JSON.parse(options.messagesInfo).taio_pkid;
            model.task_state = JSON.parse(options.messagesInfo).taio_state;
			model.task_type = JSON.parse(options.messagesInfo).ctio_form;
			model.project_name = JSON.parse(options.messagesInfo).project_name;
			model.user_name_old = JSON.parse(options.messagesInfo).nick_name;
			model.user_fkid_old = JSON.parse(options.messagesInfo).user_fkid;
            model.task_code = JSON.parse(options.messagesInfo).taio_task_code;
			model.task_firing_time = JSON.parse(options.messagesInfo).taio_begin_time;
			model.task_name = JSON.parse(options.messagesInfo).taio_task_name;
		    model.task_finish_time = JSON.parse(options.messagesInfo).taio_end_time;
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

        .forms_item_view{
            display: flex;
            flex-wrap:wrap;
            align-items:center;
            height: 100%;
        }
	}
</style>
