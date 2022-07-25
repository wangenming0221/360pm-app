<template>
	<view class="currchi_c_popup">
		<uni-popup ref="popup" :type="type === 3 ? 'right' : 'top'" @change="scrollShow">
			<view class="ccp_box" v-if="type != 3">
				<view class="box_type_1" v-if="type === 0">
					<uni-collapse accordion >
						<uni-collapse-item 
							v-for="(item, index) of selectInfo.tableList_dt" 
							:key="index"
							:title="`${item.name}(${item.standardDuration})`">
							<view v-if="item.children">
								<view 
								v-for="(item2, index2) of item.children"
								class="collapse-item_view">
									<view class="civ_left">
										{{ `${item2.name}(${item2.standardDuration})` }}
									</view>
									<view class="civ_right" @click="handle_dt(item2)">
										查看
									</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>	
				</view>
				<view class="box_type_1" v-if="type === 1">
					<uni-collapse accordion >
						<uni-collapse-item 
							v-for="(item, index) of selectInfo.tableList_xm" 
							:key="index"
							:title="`${item.name}(${item.standardDuration})`">
							<view v-if="item.children">
								<view 
								v-for="(item2, index2) of item.children"
								class="collapse-item_view">
									<view class="civ_left">
										{{ `${item2.name}(${item2.standardDuration})` }}
									</view>
									<view class="civ_right" @click="handle_xm(item2)">
										查看
									</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>	
				</view>
				<view class="box_type" v-if="type === 2">
					<view 
						@click="handleArchives(index,item)"
						class="type_item" 
						:class="Archives === index + 1 ? 'actived':''"
						v-for="(item, index) of selectInfo.serviceList" 
						:key="index">
						{{ item.archives_name }}
					</view>
				</view>
			</view>
				<view class="box_type_right"  v-else>
						<view class="box_type_right_title">业务线</view>
						<view class="box_type">
							<view
								@click="handleArchives(index,item)"
								class="type_item" 
								:class="Archives === index + 1 ? 'actived':''"
								v-for="(item, index) of selectInfo.serviceList" 
								:key="index">
								{{ item.archives_name }}
							</view>
						</view>
						<view class="box_type_right_title">工艺标准</view>
						<view class="box_type">
							<view
								class="type_item"
								:class="Wsio === index + 1 ? 'actived':''"
								@click="handleWsio(index,item)"
								v-for="(item, index) of selectInfo.menus" 
								:key="index">
								{{ item.wsio_name }}
							</view>
						</view>
						<view class="box_type_right_title">任务类别</view>
						<view class="box_type" style="margin-bottom: 200rpx;">
							<view
								class="type_item" 
								:class="TaskType === index + 1 ? 'actived':''"
								@click="handleTaskType(index,item)"
								v-for="(item, index) of selectInfo.types" 
								:key="index">
								{{ item.name }}
							</view>
						</view>
			
				<view class="bottom">
					<view class="reset" @click="reset">
						重置
					</view>
					<view class="sure" @click="close">
						确定
					</view>
				</view>
			</view>
			
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, watch, onMounted } from 'vue';
	
	const Archives = ref(0) //业务线选中
	const Wsio = ref(0) //工艺
	const TaskType = ref(0) //任务类别
	
	const old_archives_fkid = ref('');
	const old_index = ref(-1);
	
	const props = defineProps({
		selectInfo:{
			type:Object,
			default:()=>{}
		},
		archives_fkid:{
			type:String,
			default:()=>{}
		},
	});
	
	const popup = ref();
	const type = ref(0);

	const emits = defineEmits([
		'scrollShow', 
		'handleArchives', 
		'handleWsio', 
		'handleTaskType',
		'handle_dt',
		'handle_xm'
	]);
	
	const open = (index) => {
		type.value = index
		popup.value.open();
	};
	const scrollShow = (e) => {
		emits('scrollShow', e.show)
	};
	//选择单体工序
	const handle_dt = (options) => {
		const params = {
			id:options.id,
			name:options.name,
			ctio_task_type:'1'
			
		};
		emits('handle_dt', params);
		popup.value.close();
	};
	//选择项目工序
	const handle_xm = (options) => {
		const params = {
			id:options.id,
			name:options.name,
			ctio_task_type:'0'
		};
		emits('handle_xm', params);
		popup.value.close();
	};
	//选择业务线
	const handleArchives = (index, options) => {
		Archives.value = index +1;
		emits('handleArchives', options.archives_pkid);
		popup.value.close();
	};
	//选择工艺
	const handleWsio = (index, options) => {
		Wsio.value = index +1;
		emits('handleWsio', options.wsio_pkid);
		popup.value.close();
	};
	//选择任务类别
	const handleTaskType = (index, options) => {
		TaskType.value = index +1;
		emits('handleTaskType', options.id);
		popup.value.close();
	};
	
	// 重置
	const reset = () => {
	
		handleArchives(old_index.value,{archives_pkid:old_archives_fkid.value});
	
		handleWsio(-1,{wsio_pkid:''});
		handleTaskType(-1,{id:''});
		popup.value.close();
	};
	// 关闭
	const close = () => {
		popup.value.close();
	};
	
	watch(
		()=>[props.archives_fkid, props.selectInfo.serviceList],
		(val) => {
			if(val[0] && val[1]) {
				const index = val[1].findIndex((item) => item.archives_pkid === val[0]);
				Archives.value = index + 1;
			}
		},
		{deep:true}
	);
	
	onMounted(() => {
		const index = props.selectInfo.serviceList.findIndex((item) => item.archives_pkid === props.archives_fkid);
		old_archives_fkid.value = props.archives_fkid;
		old_index.value = index;
	});
	
	defineExpose({
		open
	});
</script>

<style lang="scss">
	.currchi_c_popup{
		
		.ccp_box{
			width: 100%;
			background-color: #ffffff;
			min-height: 300rpx;
			
			.box_type_1{
				max-height: 70vh;
				overflow-y: auto;
				
				.collapse-item_view{
					height: 100rpx;
					font-size: 36rpx;
					color: #49496A;
					font-weight: bold;
					border-bottom: 1px solid #E2E3E7;
					padding-left: 70rpx;
					display: flex;
					align-items: center;
					
					.civ_left{
						max-width: 80%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.civ_right{
						margin-left: auto;
						margin-right: 40rpx;
						font-size: 32rpx;
						color: #17C977;
					}
				}
			}
			.box_type{
				padding: 30rpx;
				display: grid;
				grid-template-columns:repeat(3, 1fr);
				grid-row-gap:30rpx;
				grid-column-gap:30rpx;
				
				.type_item{
					padding: 10rpx;
					font-size: 26rpx;
					border-radius: 12rpx;
					text-align: center;
					background-color: #F6F6F6;
					color: #273052;
					
					
				}
			}
		}
		.box_type_right{
			min-width: 500rpx;
			padding: 0 20rpx 0 20rpx;
			background-color: #ffffff;
			padding-bottom: 40rpx;
			height: 100vh;
			overflow-y: auto;
			
			.box_type_right_title{
				font-size: 34rpx;
				font-weight: bold;
				color: #273052;
				height: 100rpx;
				line-height: 100rpx;
			}
			
			.box_type{
				display: grid;
				grid-template-columns:repeat(2, 1fr);
				grid-row-gap:20rpx;
				grid-column-gap:20rpx;
				
				.type_item{
					padding: 10rpx;
					font-size: 26rpx;
					border-radius: 999rpx;
					text-align: center;
					background-color: #F6F6F6;
					color: #273052;
					border-radius:12rpx;
				}
			}
			
			.bottom{
					position: fixed;
					right: 0;
					bottom: 0;
					width: 100%;
					height: 55px;
					line-height: 55px;
					display: flex;
					background-color: #FFFFFF;
				
				view{
					width: 50%;
					text-align: center;
				}
				.reset{
					font-weight: 500;
					color: #273052;
				    box-shadow:0 -3px 8px 0 rgba(172,179,199,0.2); 
					//顶部阴影 第一个值控制左右 第二个值控制上下 
				}
				.sure{
					font-weight: 500;
					color: #FFFFFF;
					background: #6392FE;
				}
			}
		}
		.actived{
			border: 1px solid #667EFE;
			color: #667EFE;
			background-color: rgba(102,126,254,0.1);
		}
		
	}
</style>