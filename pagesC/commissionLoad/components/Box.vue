<template>
	<view class="commissionLoad-c-box">
		
		
		<view v-if="messagesInfo.ctio_form == '3'" class="item">
			<view>业务部门</view>
			<view>{{ messagesInfo.archives_name }}</view>
		</view>
		<view v-if="messagesInfo.ctio_form != '3'" class="item">
			<view>项目名称</view>
			<view>{{ messagesInfo.project_name }}</view>
		</view>
		<view class="item">
			<view>业务线</view>
			<view>{{ messagesInfo.archives_name }}</view>
		</view>
		<view class="item">
			<view>执行人</view>
			<view>{{ messagesInfo.nick_name }}</view>
		</view>
		<view v-if="messagesInfo.ctio_form != '3' && messagesInfo.approval_next" class="item">
			<view>审批人</view>
			<view>{{ messagesInfo.approval_next }}</view>
		</view>
		<view class="item">
			<view>发布人</view>
			<view>{{ messagesInfo.created_name }}</view>
		</view>
		<view class="template">
			<view>
				任务描述及模板<br/>
				<rich-text class="hid" :nodes="messagesInfo.taio_describe"></rich-text>
			</view>
			<!-- 通用任务附件 -->
			<view class="file-box">
				<view class="list" v-if="messagesInfo.common_file" >
					<view 
						class="list_item" 
						@click="handleFile(item.ctfl_address, getCaption(item.ctfl_address))"
						v-for="(item,index) of messagesInfo.common_file"
						:key="index">
						<view class="item_context">
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
						</view>
						<view class="item_name">
							{{ item.ctfl_name ? item.ctfl_name:'无文件名称' }}
						</view>
					</view>
				</view>
			
				<!-- 公司任务附件 -->
				<view class="list" v-if="messagesInfo.companyUrls_file">
					<view 
						class="list_item" 
						@click="handleFile(item.company_url, getCaption(item.company_url))"
						v-for="(item,index) of messagesInfo.companyUrls_file"
						:key="index">
						<view class="item_context">
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
								: item.company_url))"></image>
						</view>
						<view class="item_name">
							{{ item.company_url_name ? item.company_url_name:'无文件名称' }}
						</view>
					</view>
				</view>
				<!-- tahl任务附件 -->
				<view class="list" v-if="messagesInfo.tahl">
					<view 
						class="list_item" 
						@click="handleFile(item.tahl_address, getCaption(item.tahl_address))"
						v-for="(item,index) of messagesInfo.tahl"
						:key="index">
						<view class="item_context">
							<image 
								:src="
								(getCaption(item.tahl_address) == 'xlsx' 
								|| getCaption(item.tahl_address) == 'xls'
								|| getCaption(item.tahl_address) == 'csv')
								? excelPath
								:(getCaption(item.tahl_address) == 'pdf' 
								? pdfPath 
								: ((getCaption(item.tahl_address) == 'docx' 
								|| getCaption(item.tahl_address) == 'doc')
								? wordPath
								: (getCaption(item.tahl_address) == 'zip'
								|| getCaption(item.tahl_address) == 'rar')
								? zipPath
								: item.tahl_address))"></image>
						</view>
						<view class="item_name">
							{{ item.tahl_file_name ? item.tahl_file_name:'无文件名称' }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';

	const props = defineProps({
		messagesInfo:{
			type:Object,
			default:() => {}
		}
	});
	const store = mainDataStore();
	const { userInfo } = storeToRefs(store);
	const progress = ref('')

	const excelPath = `${store.baseUrl}/syty360pm/appPicture/index/excelFile.png`;
	const pdfPath = `${store.baseUrl}/syty360pm/appPicture/index/pdfFile.png`;
	const wordPath = `${store.baseUrl}/syty360pm/appPicture/index/wordFile.png`;
	const zipPath = `${store.baseUrl}/syty360pm/appPicture/index/zipFile.png`;
	
	// 下载文件
	const handleFile = (url, type) => {
		if(type != 'xlsx' 
			&& type != 'xls' 
			&& type != 'csv' 
			&& type != 'pdf' 
			&& type != 'docx' 
			&& type != 'doc' 
			&& type != 'zip'
			&& type != 'rar'){
			uni.showToast({
				title:'此格式无法下载',
				icon:'none'
			});
			return
		};
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
								title:'打开错误!请安装相关app打开',
								icon:'none'
							})
						},
					});
				}
			},
			fail:(error) => {
				uni.showToast({
					title:'请检查文件格式',
					icon:'error'
				})
			},
		});
		downloadTask.onProgressUpdate(res => {
			progress.value = res.progress
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

</script>

<style lang="scss">
	.commissionLoad-c-box{
		background-color: #FFFFFF;
		
		.item{
			display: flex;
			padding: 0 30rpx 0 30rpx;
			height: 150rpx;
			line-height: 150rpx;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			font-size: 30rpx;
			
			view:nth-child(1){
				color: rgba(0,0,0,0.4);
				width: 20%;
			}
			view:nth-child(2){
				width: 80%;
				overflow-x: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		
		.template{
			padding: 30rpx;
			font-size: 30rpx;
			
			.file-box{
				display: flex;
				flex-wrap: wrap;
			
				.list{
					margin-top: 30rpx;
					display: flex;
					flex-wrap: wrap;

					.list_item{
						margin-right: 30rpx;
						margin-bottom: 20rpx;

						.item_context{
							width: 160rpx;
							height: 160rpx;
							border-radius: 12rpx;

							image{
								width: 100%;
								height: 100%;
							}
						}
						.item_name{
							width: 160rpx;
							height: 40rpx;
							line-height: 40rpx;
							font-size: 23rpx;
							overflow-x: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
</style>
