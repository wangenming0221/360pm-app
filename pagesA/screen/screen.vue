<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="screen">
		<our-loading isFullScreen :active="allFinished" text="loading..." />
		<v-select @custom="custom" />
		<view class="gap"></view>
		<!-- 下拉菜单 -->
		<view class="item"
			v-for="(item,index) of treeList" 
			:key="index">

			<view class="father" @click.stop="getChild(item)">
				<uni-icons :type="item.show ? 'top':'bottom'" ></uni-icons>
				<view class="name">{{ item.deptName }}</view>
				<view class="detail"></view>
			</view>

			<uni-transition :show="item.show" mode-class="slide-right" duration="400">
				<view class="box" v-if="item.show">
					<uni-collapse @change="handleChange" :accordion="true">
						<uni-collapse-item
							v-for="(item2, index2) of depList"
							:key="index2"
							:title="item2.deptName"
							:open="item2.show">			
							<view 
								class="u-collapse-content" 
								:class="item3.isnone? 'isnone':''"
								v-for="(item3, index3) of projectList" 
								:key="index3">
								<view>{{ item3.deptName }}</view>
								<view v-if="!item3.isnone" @click="goBack(item3)">查看详情</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</view>		
			</uni-transition>

		</view>
		<!-- 下拉菜单end -->
		<v-popup @scrollShow="scrollShow" :list="valList" @goBack="goBack"></v-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { mainDataStore } from '@/store/pinia';
	import ourLoading from '@/components/our-loading/our-loading';
	import vSelect from './components/Select';
	import vPopup from './components/model';
	import { get } from '@/api/request.js';
	
	const show = ref(false);
	const store = mainDataStore();
	const allFinished = ref(true);
	const treeList = ref([]);
	const depList = ref([]);
	const projectList = ref([]);
	const valList = ref([]);

	const scrollShow = (e) => {
        show.value = e;
    };

	// 搜索s
	const custom = (e) => {
			allFinished.value = true
			const params = {
				data:{
					current:1,
					size:999999,
					projectName:e,
				},
				url:'/360-manage-core-operatemanage/StProjectBase/get/selectAll',
			};
			get(params)
				.then(res => {
					if(res.data.records.length > 0) {
						valList.value = res.data.records.map((r, i) => {
							return {
								...r,
								uuid: guid(),
								deptName: r.projectName,
								hasChildren: false,
								show:false
							};
						});
					} else {
							uni.showToast({
								title:'无此项目',
								icon:'none'
							})
					}
				})
				.finally(() => {
					allFinished.value = false;
				});
	};

	const getChild = (element) => {

		if(element.show === true){
			element.show = false;
			return
		};

		allFinished.value = true;
		
		if (element.deptName == "沈阳腾越") {
			element.deptId = element.deptId;

			const params = {
				data:{
					parentId:3, //element.deptId
				},
				url:'/360-manage-system/system/dept/list',
			};
			get(params)
				.then(res => {
					depList.value = res.data.map((r, i) => {
						return {
							...r,
							uuid: guid(),
							hasChildren: true,
							show:false,
						};
					});
				})
				.finally(() => {
					element.show = !element.show;
					allFinished.value = false;
				});
		} 
	};
	// 获取项目
	const handleChange = (index) => {
			if(!index){
				return;
			}
			allFinished.value = true
			const deptId = depList.value[index].deptId;
			const params = {
				data:{
					companyCode:deptId,
				},
				url:'/360-manage-core-operatemanage/StProjectBase/get/selectAll',
			};
			get(params)
				.then(res => {
					res.data.records.length > 0
					? projectList.value = res.data.records.map((r, i) => {
						return {
							...r,
							uuid: guid(),
							deptName: r.projectName,
							hasChildren: false,
							show:false
						};
					})
					: projectList.value = [
						{
							uuid: guid(),
							deptName: "暂无项目",
							hasChildren: false,
							isnone:true,
							show:false
						},
					]
				})
				.finally(() => {
					allFinished.value = false;
				});
	};
	//用于生成uuid
	const S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	const guid = () => {
      return S4() + S4() + "-" + S4() + "-" + S4();
    };
	// 获取列表
    const getTree = ()  => {
		const params = {
			data:{
				parentId:0,
			},
			url:'/360-manage-system/system/dept/list',
		};
		get(params)
			.then(res => {
				treeList.value = res.data.map((r, i) => {
					return {
						...r,
						uuid: guid(),
						hasChildren: true,
						show:false,
					};
				});
			})
			.finally(() => {
				allFinished.value = false;
			});
    };
	// 带参返回上一页
	const goBack = (e) => {
		store.projectInfo = Object.assign({}, e);
		uni.navigateBack({
			delta:1
		});
	};
	
	onLoad(() => {
		getTree();
	});
	
</script>

<style lang="scss">
	.screen{
		
		.item{
			padding: 0 30rpx 0 30rpx;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			
			.father{
				display: flex;
				height: 150prx;
				line-height: 150rpx;
				align-items: center;
				
				.name{
					font-size: 34rpx;
					font-weight: bold;
					letter-spacing: 2rpx;
					margin-left: 20rpx;
				}
				.detail{
					font-size: 30rpx;
					color: #17C977;
					margin-left: auto;
				}
			}
			
			.box{
				
				.product-content{
					display: flex;
					height: 80rpx;
					line-height: 80rpx;
					width: 90%;
					margin: 0 auto;
					
					view:nth-child(1){
						font-size: 32rpx;
						letter-spacing: 2rpx;
						width: 80%;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
					
					view:nth-child(2){
						font-size: 30rpx;
						color: #17C977;
						margin-left: auto;
					}
				}
				
				.u-collapse-content{
					display: flex;
					height: 80rpx;
					line-height: 80rpx;
					
					view:nth-child(1){
						font-size: 32rpx;
						letter-spacing: 2rpx;
						width: 70%;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
						padding-left: 40rpx;
					}
					
					view:nth-child(2){
						font-size: 30rpx;
						color: #17C977;
						margin-left: auto;
					}
				}
				.isnone{
					text-align: center;
					color: red;
				}
				.u-cell__title-text{
					font-size: 32rpx;
					font-weight: bold;
				}
				.u-cell__value{
					font-size: 30rpx;
					color: #17C977;
				}
			}
		}
	}
</style>
