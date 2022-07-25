<template>
	<view class="taskmanagement-c-model">
	<our-loading isFullScreen :active="allFinished" text="loading..." />
		<v-head-line title="基本信息" paddingLeft="20rpx"/>
		<view class="box">
			<uni-forms
					:errShowType="errorType"
					labelWidth="auto"
					labelPosition="left"
					:modelValue="model"
					:rules="rules"
					ref="uForm"
					:border="true">
					
				<uni-forms-item :required="required" label="任务名称" name="taskName" label-position="top">
					<view style="display: flex;align-items:center;">
						<uni-easyinput 
							v-model="model.taskName" 
							:inputBorder="false" 
							placeholder="请输入任务名称"
						/>
					</view>
				</uni-forms-item>
				
				<uni-forms-item :required="required" label="项目名称" name="projectId" >
					<picker	
						v-if="products.length !== 0"
						mode='selector'
						:range="products"
						range-key="name"
						@change="productSelect">
						<view style="display: flex;align-items:center;">
							<text 
								v-if="products.length !== 0" 
								:style="{color:model.projectId ? '#273052':'#C0C5D4'}">
								{{ model.projectName }}
							</text>
							<view style="margin-left: auto;">
								<uni-icons type="forward"></uni-icons>
							</view>
						</view>
					</picker>
				</uni-forms-item>
				
				<uni-forms-item :required="required" label="执行人员" name="operational" >
						<view @click="handleReview" v-if="model.operational.length == 0" style="color:rgba(0,0,0,0.4);">
							请选择
						</view>
						<view @click="handleReview" v-else style="display: flex;flex-wrap:wrap;">
							<view
								v-for="(item,index) of model.operational"
								:key="index"
								style="margin-left: 20rpx;" 
								>
								{{ item }}
							</view>
						</view>
				</uni-forms-item>
				
				<uni-forms-item :required="required" label="重要程度" name="company_import_degree" >
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
				
				<uni-forms-item :required="required" label="业务线" name="archives_pkid" >
					<picker	
						v-if="services.length !== 0"
						mode='selector'
						:range="products"
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
				
				<uni-forms-item :required="required" label="是否审批" name="approval" >
					<view style="text-align:right;">
						<switch color="rgba(64,158,255)" :checked="model.approval" @change="change" />
					</view>
				</uni-forms-item>
				
				<uni-forms-item :required="required" label="任务描述" name="describe" label-position="top">
					<uni-easyinput
						type="textarea"
						 :inputBorder="false"
						v-model="model.describe" 
						placeholder="请输入任务描述" 
						:maxlength="300"/>
				</uni-forms-item>
				
				<uni-forms-item :required="required" label="上传附件" name="annex" label-position="top">
					<v-upload @changeList="changeList"></v-upload>
				</uni-forms-item>
															
			</uni-forms>

		</view>
	</view>
</template>

<script setup>
	import { reactive,onMounted, ref, watch, computed } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import ourLoading from '@/components/our-loading/our-loading';
	import vUpload from '@/components/Upload';
	import vHeadLine from '@/components/HeadLine';
	import { get } from '@/api/request.js';
	
	const store = mainDataStore();
	const { reviewList } = storeToRefs(store);
	const uForm = ref();
	const select1 = ref(false);
	const select3 = ref(false);
	const allFinished = ref(true);
	const services = ref([]);
	const required = ref(true);
	const important = [
		{
			name:'低',
			id:1
		},
		{
			name:'中',
			id:2
		},
		{
			name:'高',
			id:3
		}
	];
	const products = ref([]);
	// 表单提示方式
	const errorType = 'undertext';
	const map = {
		text:'name',
		value:'id'
	};
	// 表单数据
	const model = reactive({
		taskName: '',
		projectName:'',
		projectId:'',
		operational:computed(() =>	{
			const arr = [];
			reviewList.value.map(item => {
				arr.push(item.nickName);
			});
			return arr;
		}),
		user_id:computed(() =>{
			const arr = [];
			reviewList.value.map(item => {
				arr.push(item.userId);
			});
			return arr;
		}),
		important:'请选择',
		company_import_degree:'',
		archives_name:'请选择',
		archives_pkid:'',
		approval:false,
		describe:'',
		annex:[],
	});
	// 设置必填项
	const rules = ref({
		taskName: {
			rules: [{
				required: true,
				errorMessage: '任务不能为空'
			}]
		},
		projectId: {
			rules: [{
				required: true,
				errorMessage: '项目不能为空'
			}]
		},
		// annex: {
		// 	rules: [{
		// 		required: true,
		// 		errorMessage: '附件不能为空'
		// 	}]
		// },
		operational: {
			rules: [{
				format:'array',
				required: true,
				errorMessage: '执行人员不能为空'
			}]
		},
		company_import_degree: {
			rules: [{
				required: true,
				errorMessage: '请选择重要程度'
			}]
		},
		archives_pkid: {
			rules: [{
				required: true,
				errorMessage: '请选择业务线'
			}]
		},
		describe: {
			rules: [{
				required: true,
				errorMessage: '描述不能为空'
			}]
		},
	});


	// 获取图片列表
	const changeList = (list) => {
		model.annex = list;
	};
	// 改变审批状态
	const change = (e) => {
		model.approval = e.detail.value;
	};
	// 选择重要程度
	const importSelect = (e) => {
		model.important = important[e.detail.value].name;
		model.company_import_degree = important[e.detail.value].id;
	};
	// 选择业务线
	const handleServices = (e) => {
		model.archives_name = services.value[e.detail.value].name;
		model.archives_pkid = services.value[e.detail.value].id;
	};
	// 选择项目
	const productSelect = (e) => {
		model.projectName = products.value[e.detail.value].name;
		model.projectId = products.value[e.detail.value].id;
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
				if(res.data){
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
	//获取业务线数据
	const handleList = async() => {
		const params = {
			data:{
				current:1,
				size:999999999
			},
			url:'/360-manage-core-operatemanage/ArchivesInfo/get/selectAll'
		};
		await get(params)
			.then(res => {
				if(res.data){
					res.data.records.map(item => {
						services.value.push({
							name:item.archives_name,
							id:item.archives_pkid,
						});
					});
				};
			})
			.finally(() => {
				select3.value = true;
			});
	};
	//选择审批人
    const handleReview = () => {
        uni.navigateTo({
            url:`/pagesB/review/review`
        });
    };
	// 提交
	const goPage = () => {
		uForm.value.validate().then(res => {

			if(model.annex.length === 0) {
				uni.showToast({
					title:'请上传附件',
					icon:'none'
				});
				return;
			}
			
			uni.navigateTo({
				url:`/pagesB/triggering/triggering?firstInfo=${JSON.stringify(model)}`
			});
		}).catch(() => {
			uni.showToast({
				title:'请完善表单',
				icon:'none'
			});
		});
	};

	defineExpose({
		goPage
	});

	onMounted(() => {
		handleList();
		projectList();
	});

	watch(
        () => [select1, select3],
        (newVal, oldVal) => {
			if(select1.value && select3.value) {
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
</script>

<style lang="scss">
	.taskmanagement-c-model{
		width: 95%;
		margin: 0 auto;
		background-color: #FFFFFF;
		
		.box{
			width: 90%;
			margin: 0 auto;
			
			.uinput{
				text-align: right;
				font-size: 30rpx;
				padding-bottom: 100rpx;
			}
			text{
				font-size: 32rpx;
				height: 100%;
				line-height: 100%;
				margin-left: 20rpx;
			}
		}
	}
</style>
