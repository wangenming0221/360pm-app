<template>
    <view class="add-task">
    <our-loading isFullScreen :active="allFinished" text="loading..." />
       <uni-forms
			:errShowType="errorType"
			labelWidth="auto"
			labelPosition="top"
			:modelValue="model"
			:rules="rules"
			ref="uForm"
			:border="true">

            <uni-forms-item :required="required" label="任务名称" name="taskName" >
				<uni-easyinput 
					v-model="model.taskName" 
					:inputBorder="false" 
					placeholder="请输入任务名称"
				/>
			</uni-forms-item>

			<uni-forms-item :required="false" label="项目名称" name="projectCode" label-position="left">
					<picker	
						v-if="products.length !== 0"
						mode='selector'
						:range="products"
						range-key="name"
						@change="productSelect">
						<view style="display: flex;align-items:center;">
							<text 
								v-if="products.length !== 0" 
								:style="{color:model.projectCode ? '#273052':'#C0C5D4'}">
								{{ model.projectName }}
							</text>
							<view style="margin-left: auto;">
								<uni-icons type="forward"></uni-icons>
							</view>
						</view>
					</picker>
				</uni-forms-item>

            <uni-forms-item :required="required" label="业务线" name="archives_pkid" label-position="left">
				
				<picker	
					v-if="services.length !== 0"
					mode='selector'
					:range="services"
					range-key="name"
					@change="handleServices">
					<view style="display: flex;align-items:center;">
						<text 
							v-if="services.length !== 0" 
							:style="{color:model.archives_pkid ? '#273052':'#C0C5D4'}">
							{{ model.archives_name }}
						</text>
						<view style="margin-left: auto;">
							<uni-icons type="forward"></uni-icons>
						</view>
					</view>
				</picker>
			</uni-forms-item>

            <uni-forms-item :required="required" label="执行主体" name="mainBody" label-position="left">
				<view @click="handleMain" v-if="model.mainBody.length == 0" style="color:rgba(0,0,0,0.4);">
					请选择
				</view>
				<view @click="handleMain" v-else style="display: flex;flex-wrap:wrap;">
					<view
						v-for="(item,index) of model.mainBody"
						:key="index"
						style="margin-left: 20rpx;" 
						>
						{{ item.nickName }}
					</view>
				</view>
			</uni-forms-item>

            
            <uni-forms-item :required="required" label="是否审批" name="approval" label-position="left">
				<view style="text-align:right;">
					<switch color="rgba(64,158,255)" :checked="model.approval" @change="change" />
				</view>
			</uni-forms-item>

            <uni-transition mode-class="fade" :duration="0" :show="model.approval" >
				<uni-forms-item :required="required" label="审批人" name="operational" label-position="left">
					<view @click="handleReview" v-if="model.operational.length == 0" style="color:rgba(0,0,0,0.4);">
						请选择
					</view>
					<view @click="handleReview" v-else style="display: flex;flex-wrap:wrap;">
						<view
							v-for="(item,index) of model.operational"
							:key="index"
							style="margin-left: 20rpx;" 
							>
							{{ item.nickName }}
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item :required="required" label="审批方式" name="operational">
					<view style="display: flex;align-items:center;justify-content: center;">
						<uni-data-checkbox v-model="model.apio_type" :localdata="radiolist" />
					</view>
				</uni-forms-item>
            </uni-transition>

            <uni-forms-item :required="required" label="重要程度" name="company_import_degree" label-position="left">
				<picker	
					mode='selector'
					:range="important"
					range-key="name"
					@change="importSelect">
					<view style="display: flex;align-items:center;">
						<text 
							:style="{color:model.company_import_degree ? '#273052':'#C0C5D4'}">
							{{ model.important }}
						</text>
						<view style="margin-left: auto;">
							<uni-icons type="forward"></uni-icons>
						</view>
					</view>
				</picker>
			</uni-forms-item>
			<view class="gap" style="height:40rpx;"></view>
            <!-- 一次性任务 -->
            <view v-if="type == '0'">
                <uni-forms-item :required="required" label="计划开始时间" name="startTime" label-position="left">
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

                <uni-forms-item :required="required" label="计划结束时间" name="endTime" label-position="left">
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
			<view v-else>
				<uni-forms-item :required="required" label="触发类型" name="ctio_pro_time_tm" label-position="left">
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

				<uni-forms-item 
					:required="required" 
					label="发送时限" 
					name="ctio_pro_time" 
					label-position="left" 
					v-if="model.ctio_pro_time_tm == '0' || model.ctio_pro_time_tm == '1'">
							<picker
								mode='selector'
								:range="proTimeList"
								range-key="name"
								@change="handleProTime">
								<view style="display: flex;align-items:center;">
									<text
										v-if="model.ctio_pro_time_tm == '0'"
										:style="{color:model.ctio_pro_time ? '#273052':'#C0C5D4'}">
										{{ model.ctio_pro_time ? `${model.ctio_pro_time}天` : '请选择' }}
									</text>
									<text
										v-if="model.ctio_pro_time_tm == '1'"
										:style="{color:model.ctio_pro_time ? '#273052':'#C0C5D4'}">
										{{ 
											model.ctio_pro_time == '1'
											? '周一'
											: (model.ctio_pro_time == '2' 
											? '周二'
											: (model.ctio_pro_time == '3'
											? '周三'
											: (model.ctio_pro_time == '4'
											? '周四'
											: (model.ctio_pro_time == '5'
											? '周五'
											: (model.ctio_pro_time == '6'
											? '周六'
											: (model.ctio_pro_time == '7'
											? '周天':'请选择'))))))
										}}
									</text>
									<view style="margin-left: auto;">
										<uni-icons type="forward"></uni-icons>
									</view>
								</view>
							</picker>
							<!-- <uni-transition mode-class="slide-left" :show="model.ctio_pro_time_tm == '1'">
								<text>星期</text>
							</uni-transition>	
							<uni-number-box
								:disabled="model.ctio_pro_time_tm == '2'" 
								:min="1" 
								:max="model.ctio_pro_time_tm == '0' 
								? 31:(model.ctio_pro_time_tm == '1' 
								? 7:1)" 
								v-model="model.ctio_pro_time">
							</uni-number-box>
							<uni-transition mode-class="slide-right" :show="model.ctio_pro_time_tm == '0'">
								<text>日</text>
							</uni-transition>
							<uni-transition mode-class="slide-right" :show="model.ctio_pro_time_tm == '2'">
								<text>天</text>
							</uni-transition> -->
				</uni-forms-item>

				<uni-forms-item :required="required" label="完成时限" name="ctio_finish_time" label-position="left">
						<view class="finishlimit">
							<uni-number-box :min="1" v-model="model.ctio_finish_time"></uni-number-box>
							<text>天完成</text>
						</view>	
				</uni-forms-item>
                 
                <uni-forms-item :required="required" label="结束时间" name="ctio_alt1" label-position="left">
					<picker	
						mode="date" 
						:value="model.ctio_alt1" 
						@change="ctioChange">
						<view style="display: flex;align-items:center;">
							<text 
								:style="{color:model.ctio_alt1 ? '#273052':'#C0C5D4'}">
								{{ model.ctio_alt1 ? model.ctio_alt1 : '请选择结束时间' }}
							</text>
							<view style="margin-left: auto;">
								<uni-icons type="forward"></uni-icons>
							</view>
						</view>
					</picker>
				</uni-forms-item>   
            </view>
			<view class="gap" style="height:40rpx;"></view>
			<uni-forms-item :required="required" label="任务描述" name="describe" >
				<uni-easyinput 
					type="textarea"
					 :inputBorder="false"
					v-model="model.describe" 
					:maxlength="300"
					placeholder="请输入任务描述" />
			</uni-forms-item>
			<view class="gap" style="height:40rpx;"></view>

			<uni-forms-item :required="required" label="上传附件" name="annex">
				<v-upload type="addTask" :isSize="true" @changeList="changeList"></v-upload>
			</uni-forms-item>
        </uni-forms> 

		<view class="send" @click="submit">
			<image :src="sendIcon"></image>
		</view>       
    </view>
</template>

<script setup>
    import { ref, reactive, computed, watch } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
    import { onLoad } from '@dcloudio/uni-app';
    import { get, post, jsonPost } from '@/api/request.js';
    import ourLoading from '@/components/our-loading/our-loading';
	import vUpload from '@/components/Upload';

	const store = mainDataStore();
	const { checkList, reviewlist, taskList } = storeToRefs(store);

	const sendIcon = `${store.baseUrl}/syty360pm/appPicture/index/sendSure.png`;
    const type = ref(0); //任务类型
    const uForm = ref();
	const select1 = ref(false);
	const select2 = ref(false);
    const allFinished = ref(true);
	const required = ref(true);
    const services = ref([]); //业务线列表
	const products = ref([]); //项目下拉
	const proTimeList = ref([]); //发送时限
	const errorType = 'undertext';// 表单提示方式
    //重要程度
    const important = [
		{
			name:'低',
			id:'1'
		},
		{
			name:'中',
			id:'2'
		},
		{
			name:'高',
			id:'3'
		}
	];
	//触发类型
	const rule = [
		{
			name:'每月',
			id:'0',
		},
		{
			name:'每周',
			id:'1',
		},
		{
			name:'每天',
			id:'2',
		}
	];
	//审批方式列表
	const radiolist = [
		{
			text: '会签',
			value:'1',
		},
		{
			text: '或签',
			value:'2',
		},
	];
    // 表单数据
	const model = reactive({
        taskName:'', //任务名称
		projectName:'请选择',// 项目名称
		projectCode:'',//项目code
        archives_pkid:'', //业务线标识
        archives_name:'请选择', //业务线名称
        mainBody:computed({
			get() {
				return checkList.value
			},
			set(value) {}
		}), //执行主体
        approval:false, //是否审批
        operational:computed({
			get() {
				return reviewlist.value
			},
			set(value) {}
		}), //审批人
        important:'请选择', //重要程度
        company_import_degree:'', //重要程度标识
        startTime:'', //计划开始时间
        endTime:'', //计划结束时间
		describe:'', //描述
		annex:[], //文件列表
		rule:'请选择', //触发类型
		ctio_pro_time_tm:'',//触发类型标识
		ctio_pro_time:'', //发送时限
		ctio_finish_time:1, //完成时限
		ctio_alt1:'', //结束时间
		times:[],
		apio_type:'1', //1会签，2或签
	});
    //表单规则
    const rules = ref({
		taskName: {
			rules: [{
				required: true,
				errorMessage: '任务名称不能为空'
			}]
		},
        archives_pkid: {
			rules: [{
				required: true,
				errorMessage: '请选择业务线'
			}]
		},
		// mainBody: {
		// 	rules: [
		// 		{
		// 			format: 'array',
		// 		},
		// 		{
		// 			validateFunction: function(rule, value, data, callback) {
		// 				if (value.length < 1) {
		// 					callback('请至少选中一个执行主体')
		// 				}
		// 				return true
		// 			}
		// 		}
		// 	]
		// },
		company_import_degree: {
			rules: [{
				required: true,
				errorMessage: '请选择重要程度'
			}]
		},
     	describe: {
            rules: [{
				required: true,
				errorMessage: '描述不能为空'
			}]
		},     		
    });
	// 选择项目
	const productSelect = (e) => {
		model.projectName = products.value[e.detail.value].name;
		model.projectCode = products.value[e.detail.value].id;
	};
    //选择执行主体
    const handleMain = () => {
        uni.navigateTo({
            url:`/pagesB/mainBody/mainBody`
        });
    };
	//选择审批人
    const handleReview = () => {
        uni.navigateTo({
            url:`/pagesB/reviewBody/reviewBody`
        });
    };
	// 选择规则
	const handleSelect = (e) => {
		model.rule = rule[e.detail.value].name;
		model.ctio_pro_time_tm = rule[e.detail.value].id;
	};
    // 选择业务线
	const handleServices = (e) => {
		model.archives_name = services.value[e.detail.value].name;
		model.archives_pkid = services.value[e.detail.value].id;
	};
    // 选择重要程度
	const importSelect = (e) => {
		model.important = important[e.detail.value].name;
		model.company_import_degree = important[e.detail.value].id;
	};
	//选择发送时间
	const handleProTime = (e) => {
		model.ctio_pro_time = proTimeList.value[e.detail.value].id;
	};
    // 改变审批状态
	const change = (e) => {
		model.approval = e.detail.value;
	};
    //选择计划开始时间
    const startChange = (e) =>{
		model.startTime = e.detail.value
	};
    //选择计划结束时间
    const endChange = (e) =>{
		model.endTime = e.detail.value
	};
	//周期任务结束时间
	const ctioChange = (e) => {
		model.ctio_alt1 = e.detail.value
	};
	// 获取图片列表
	const changeList = (list) => {
		model.annex = list;
	};
    //获取业务线数据
	const handleList = async() => {
		const params = {
			data:{
                current:1,
			    size:999999999
            },
			url:'/360-manage-core-operatemanage/ArchivesInfo/get/selectAll',
		};
		await get(params)
			.then(res => {
				if(res.data.records){
					res.data.records.map(item => {
						services.value.push({
							name:item.archives_name,
							id:item.archives_pkid,
						});
					});
				};
			})
			.finally(() => {
				select2.value = true;
			});
	};
	// 更新常用人员
	const insertUse = async() => {
		const array = checkList.value;
		const newArr = [];
		array.map(item => {
			newArr.push({
				publisher_id:uni.getStorageSync('user_fkid'),
				user_id:item.userId,
				user_name:item.userName,
				nick_name:item.nickName,
				phonenumber:item.phonenumber
			});
		});
		const params = {
			data:newArr,
			url:'/360-manage-core-operatemanage/SysUserCommon/new/insertSysUserCommons'
		};
		await post(params)
			.then(res => {
				if(res.success === true) {
					uni.showToast({
						title:'发布成功',
						icon:'success'
					});
					taskList.value = [];
					store.getTaskList(); //代办任务列表
					setTimeout(() => { uni.navigateBack({}) },1000);
				} else {
					uni.showToast({
						title:'发布失败',
						icon:'error'
					});
				}
			})
			.finally(()=>{
				allFinished.value = false;
			});
	};
	//表单提交
	const submit = async() => {
		uForm.value.validate()
			.then(res => {
				if(model.approval && model.operational.length === 0) {
					uni.showToast({
						title:'请选择审批人',
						icon:'none'
					});
					return	
				}
				if(model.annex.length === 0) {
					uni.showToast({
						title:'请上传附件',
						icon:'none'
					});
					return	
				}
				if(model.mainBody.length === 0) {
					uni.showToast({
						title:'请选择至少一个执行主体',
						icon:'none'
					});
					return	
				}
				// 如果开始时间超过结束时间
				if(model.startTime && model.endTime){
					const startTime = new Date(model.startTime.replace(/\-/g, "\/"));
					const endTime = new Date(model.endTime.replace(/\-/g, "\/")); 
					if(startTime > endTime){
						uni.showToast({
							title:'开始时间不得小于结束时间',
							icon:'none'
						});
						return	
					}
				}
				// 如果触发类型不是每天并且发送时限没有值
				if(type.value == '1' && model.ctio_pro_time_tm != '2' && !model.ctio_pro_time) {
					uni.showToast({
						title:'请选择发送时限',
						icon:'none'
					});
					return	
				}
				// 如果是触发规则为每月
				if(model.ctio_pro_time_tm == '0') {
					const num = model.ctio_alt1.substring(8,9) == '0' 
					? Number(model.ctio_alt1.substring(9,10))
					: Number(model.ctio_alt1.substring(8,10));
					if(model.ctio_pro_time != num) {
						uni.showToast({
							title:'结束时间需与发送时限日期对应',
							icon:'none'
						});
						return
					}
				}
				
				
				allFinished.value = true;
				
					const mainBody = model.mainBody.map(item => {
						return item.userId
					}).toString();
					
					const operational = model.operational.map(item => {
						return item.userId
					}).toString();
					
					const params = {
						data:{
							ctio_task_name:model.taskName, //任务名称
							project_code:model.projectCode, //项目code
							archives_fkid:model.archives_pkid, //业务线id
							user_id:mainBody, //执行主体 user_id （ 选择用户，传入id，可多选，用“,”分割 ）
							ctio_is_approve:model.approval === true ? '0' : '1', //是否审批
							ctio_alt2:operational ? operational : '', //审批人id
							approvalProcessList: operational ?
							[
								{
									apio_order:1,
									apio_people_type:1,
									apio_type:model.apio_type,
									user_fkids:operational
								}
							]
							:[],
							company_import_degree:model.company_import_degree, //重要程度
							ctio_describe:model.describe ,//描述
							ctio_form:'2',
							ctio_task_tm:type.value, //任务类型
							ctio_time_begin:model.startTime, //计划开始时间
							ctio_time_end:model.endTime, //计划结束时间
							commonTaskFileList:model.annex, //附件
							ctio_pro_time_tm:model.ctio_pro_time_tm, //触发类型
							ctio_pro_time:model.ctio_pro_time, //发送时限
							ctio_finish_time:model.ctio_finish_time, //完成时限
							ctio_alt1:model.ctio_alt1 +  ` 00:00:00`, //结束时间
						},	
						url:'/360-manage-core-operatemanage/CommonTaskInfo/insertProjectTask',
					};	
					switch(type.value) {
						case '0':
							delete params.data.ctio_pro_time_tm;
							delete params.data.ctio_pro_time;
							delete params.data.ctio_finish_time;
							delete params.data.ctio_alt1;
						break;
						case '1':
							delete params.data.ctio_time_begin;
							delete params.data.ctio_time_end;
						break;		
					};
					jsonPost(params)
						.then(res => {
							if(res.success) {
								insertUse();
							} else {
								allFinished.value = false;	
								uni.showToast({
									title:'提交失败',
									icon:'error'
								})
							}
						});
			}).catch(error => {
				console.log(error)
				allFinished.value = false;
				uni.showToast({
					title:'请将表单填写完整',
					icon:'none'
				})
			})		
	};

	// 获取项目下拉
	const projectList = async(e) => {
		const params = {
			data:{
				current:1,
				size:999999999
			},
			url:'/360-manage-core-operatemanage/StProjectBase/get/selectAll',
			
		};
		await get(params)
			.then(res => {
				if(res.data.records){
					res.data.records.map(item => {
						products.value.push({
							name:item.projectName,
							id:item.projectCode,
						});
					});
				};
			})
			.finally(() => {
				select1.value = true;
			});
	};

		watch(
        () => [select1, select2],
        (newVal, oldVal) => {
			if(select1.value && select2.value) {
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
	//监听触发类型
	watch(
		() => model.ctio_pro_time_tm,
		(oldVal, newVal) => {
			proTimeList.value = [];
			model.ctio_pro_time = ''
			switch(oldVal) {
				case '0':
					const date = new Date();
					const year = date.getFullYear();
					const month = date.getMonth()+1;
					const num = new Date(year, month, 0);
					const days =  num.getDate();
					for(let i = 1;i < days+1;i++){
						proTimeList.value.push({
							name:`${i}天`,
							id:i
						});
					};
					break;
				case '1':
					const array = ['一','二','三','四','五','六','天'];
					for(let i = 0;i<array.length;i++) {
						proTimeList.value.push({
							name:`周${array[i]}`,
							id:i+1
						});
					};
					break;
				case '2':
						model.ctio_pro_time = 1
					break;
			}
		},
		{deep:true}
	);
		
	
	
	
	const setRule0 = () => {
		const obj = {
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
				}
		};
		rules.value = Object.assign(rules.value, obj);
	};

	const setRule1 = () => {
		const obj = {
			// ctio_pro_time_tm: {
			// 	rules: [{
			// 		required: true,
			// 		errorMessage: '请选择触发类型'
			// 	}]
			// },
			ctio_alt1: {
				rules: [{
					required: true,
					errorMessage: '请选择结束时间'
				}]
			}
		};
		rules.value = Object.assign(rules.value, obj);
	};

    onLoad((options) => {
        type.value = options.type;
        switch(options.type) {
            case '0':
                uni.setNavigationBarTitle({
                    title:'一次性任务'
                });
				setRule0();
            break;   
            case '1':
                uni.setNavigationBarTitle({
                    title:'周期任务'
                });
				setRule1();
            break; 
        };
		projectList();
        handleList();
    });


</script>

<style lang="scss">
    page{
        background-color: #F2F6F8;
    }
    .add-task{
        background-color: #FFFFFF;
        padding: 0 20rpx 0 20rpx;

		.finishlimit{
			display: flex;
			align-items: center;
			justify-content: center;
		}
    }
	.send{
		width: 230rpx;
		height: 230rpx;
		margin: 0 auto;

		image{
			width: 100%;
			height: 100%;
			border-radius: 999rpx;
			animation:scale 1s linear infinite;
		}

		@keyframes scale {
			50%{transform:scale(1.2)}
		}
	}
	text{
		font-size: 32rpx;
		height: 100%;
		line-height: 100%;
		margin-left: 20rpx;
	}
</style>