<template>
	<view class="currencyDetail">
		<v-header title="基本信息"/>
		<v-content type="jb" :taskInfo="jb_taskInfo"/>
		<v-header title="触发信息"/>
		<v-content type="cf" :taskInfo="cf_taskInfo"/>
		<v-header title="任务描述"/>
		<view class="currencyDetail_desc">
			<rich-text :nodes="element.ctio_describe"></rich-text>
		</view>
		<v-header title="任务模板"/>
		<view 
			class="currencyDetail_file" 
			@click="handleFile(item.ctfl_address, getCaption(item.ctfl_address))"
			v-for="(item, index) of ctfl"
			:key="index">
					<image
						:src="
						(getCaption(item.company_url) == 'xlsx' 
						|| getCaption(item.company_url) == 'xls'
						|| getCaption(item.company_url) == 'csv')
						? excelPath
						:(getCaption(item.company_url) == 'pdf' 
						? pdfPath 
						: ((getCaption(item.company_url) == 'docx' 
						|| getCaption(item.company_url) == 'doc')
						? wordPath
						: (getCaption(item.company_url) == 'zip'
						|| getCaption(item.company_url) == 'rar')
						? zipPath
						: item.ctfl_address))"></image>
				<view class="cdf_item_b">
					{{ item.ctfl_name }}
				</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { onLoad } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import vHeader from './components/Header';
	import vContent from './components/Content';
	
	const store = mainDataStore();
	const excelPath = `${store.baseUrl}/syty360pm/appPicture/index/excelFile.png`;
	const pdfPath = `${store.baseUrl}/syty360pm/appPicture/index/pdfFile.png`;
	const wordPath = `${store.baseUrl}/syty360pm/appPicture/index/wordFile.png`;
	const zipPath = `${store.baseUrl}/syty360pm/appPicture/index/zipFile.png`;
	const deptList = ref([]);
	const jb_taskInfo = ref({}); //基本信息
	const cf_taskInfo = ref({}); //触发信息
	const ctfl = ref([]); //任务模版
	const process = ref([]); //工序
	
	const element = ref({});
	
	// 获取适用组织
	const getDept = async() => {
				const params = {
					data:{
						parentId:3
					},
					url:'/360-manage-system/system/dept/list'
				};
				await get(params)
					.then(res => {
						if(res.data){
							deptList.value = res.data;
						}
					});
	};
	
	// 获取任务详情
	const getDetail = async(pkid) => {
				const params = {
					data:{
						pkid
					},
					url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectDetails'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
								if(res.data.ctfl) {
									ctfl.value = res.data.ctfl;
								}
								// 重构适用组织
								const ctio_apply_org = element.value.ctio_apply_org.split(",");
								const array = [];
								ctio_apply_org.forEach((item, index) => {
								  if (index != ctio_apply_org.length - 1) {
								    array.push(item)
								  }
								});
								const list = deptList.value.filter((item) => {
									 return array.includes(item.deptCode)
								});
								// 基本信息
								jb_taskInfo.value = Object.assign({}, {
									ctio_task_code:res.data.ctio_task_code, //任务编号
									ctio_task_name:res.data.ctio_task_name, //任务名称
									archives_name:element.value.archives_name, //业务线
									wsio_name:element.value.wsio_name, // 工艺标准
									list// 适用组织
								});
							
								// 触发信息
								cf_taskInfo.value = Object.assign({}, {
									role_name:element.value.role_name, //执行角色
									ctio_trigger_type:res.data.ctio_trigger_type, //关联类型
									processName:process.value.filter((item) => {
										return item.code === res.data.bp_fkid
									}), //关联名称
									ctio_task_tm:res.data.ctio_task_tm, //触发类型
									ctio_pro_tm:res.data.ctio_pro_tm, //触发方式
									ctio_pro_time_tm:res.data.ctio_pro_time_tm, //周期任务触发方式
									ctio_trigger_type:res.data.ctio_trigger_type, //状态
									ctio_front_task_tm:res.data.ctio_front_task_tm, //0任务启动前 1任务启动后
									ctio_front_task_days:res.data.ctio_front_task_days, //任务启动前后多少天
									ctio_time_begin:res.data.ctio_time_begin, //日期
									ctio_pro_days:res.data.ctio_pro_days, //触发方式后接天数
									ctio_pro_time:res.data.ctio_pro_time, //触发方式后接时间
									ctio_finish_time:res.data.ctio_finish_time, //完成时限
									ctio_alt2:res.data.ctio_alt2, //完成时限单位
								});
								
							} else {
								uni.showToast({
									title:'内容异常',
									icon:'error'
								});
							}
						}
					});
	};
	
	// 下载文件
	const handleFile = (url, type) => {
		const downloadTask = uni.downloadFile({
			url:url,
			success:(res) => {
				if (res.statusCode === 200) {
					uni.openDocument({
					    filePath: res.tempFilePath,
					    showMenu: true,
						fileType:type,
					    success:(element) => {
							uni.showToast({
								title:'正在打开文件',
								icon:'none'
							})
						},
						fail:(error) => {
							uni.showToast({
								title:'请检查文件格式',
								icon:'error'
							})
						},
					});
				}
			}
		});
		downloadTask.onProgressUpdate(res => {
			progress.value = res.progress
		});
	};
	// 获取工序
	// 获取项目工序
	const getProcess = async() => {
		const params = {
			data:{},
			url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectGx'
		};
		await get(params)
			.then(res => {
				if(res.data){
					process.value = res.data;
				}else {
					uni.showToast({
						title:'无项目工序',
						icon:'error'
					});
				}
			});
	};
	
	// 检查附件类型
	const getCaption = (obj) => {
		if(obj) {
			var index=obj.lastIndexOf("\.");
			obj=obj.substring(index+1,obj.length);
			return obj;
		} else {
			return ''
		}
	};
	
	watch(
		() => [deptList, process],
		(val) => {
			if(val[0] && val[1]) {
				getDetail(element.value.ctio_pkid);
			}
		},
		{
			deep:true,
		},
	);
	
	onLoad((options) => {
		
		if(options.query) {
			const query = decodeURIComponent(options.query)
			element.value = JSON.parse(query);
			// 获取适用组织
			getDept();	
			// 获取工序
			getProcess();
		}
	})
	
</script>

<style lang="scss">
	page{
		background-color: #F5F7FB;
	}
	.currencyDetail{
		width: 90%;
		margin: 0 auto;
		
		.currencyDetail_desc{
			padding: 40rpx;
			background-color: #FFFFFF;
			color: #49496A;
			font-size: 28rpx;
			border-radius: 16rpx;
			box-shadow:#DCDCDC 0px 0px 3px; 
		}
		.currencyDetail_file{
			height: 120rpx;
			width: 90%;
			margin: 0 auto;
			border-radius: 16rpx;
			box-shadow:#DCDCDC 0px 0px 3px; 
			background-color: #FFFFFF;
			font-size: 28rpx;
			margin-bottom: 30rpx;
			color: #49496A;
			display: flex;
			align-items: center;
				
			.cdf_item_a{
				height: 100rpx;
				width: 100rpx;
			}
			.cdf_item_b{
				max-width: 65%;
				margin-left: 30rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
