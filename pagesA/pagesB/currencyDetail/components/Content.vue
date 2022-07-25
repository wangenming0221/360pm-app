<template>
	<view class="currdet_c_content">
		<!-- 基本信息 -->
		<view v-if="type == 'jb'">
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					任务编号：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.ctio_task_code }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					任务名称：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.ctio_task_name }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					业务线：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.archives_name }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					工艺标准：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.wsio_name }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					适用组织：
				</view>
				<view class="ccir_grid" v-if="taskInfo.list">
					<view 
						v-for="(item, index) of taskInfo.list" 
						:key="index"
						class="">
						{{ item.deptName }}
					</view>
				</view>
			</view>
		</view>
		<!-- 触发信息 -->
		<view v-if="type == 'cf'">
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					执行角色：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.role_name }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					关联类型：
				</view>
				<view class="currdet_c_content_item_right">
					{{ 
						taskInfo.ctio_trigger_type == '0' ?
						'节点关联'
						:(taskInfo.ctio_trigger_type == '1'
						? '任务关联' : '时间关联')
					}}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					关联名称：
				</view>
				<view class="currdet_c_content_item_right" v-if="taskInfo.processName">
					<text v-if="taskInfo.processName[0]">{{ taskInfo.processName[0].name }}</text>
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					触发类型：
				</view>
				<view class="currdet_c_content_item_right">
					{{ taskInfo.ctio_task_tm == '0' ? '一次性任务' : '周期性任务'}}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					触发方式：
				</view>
				<view 
					class="currdet_c_content_item_right" 
					v-if="taskInfo.ctio_task_tm == '0' && taskInfo.ctio_trigger_type == '0'">
					{{
						taskInfo.ctio_pro_tm == '0'
						? '节点启动前'
						:(taskInfo.ctio_pro_tm == '1'
						? '节点启动后' : '节点完成后')
					}}
					{{ taskInfo.ctio_pro_days }}天
				</view>
				<view 
					class="currdet_c_content_item_right" 
					v-if="taskInfo.ctio_task_tm == '1' && taskInfo.ctio_trigger_type == '0'">
					{{
						taskInfo.ctio_pro_time_tm == '0'
						? `每月${taskInfo.ctio_pro_time}日`
						:(taskInfo.ctio_pro_time_tm == '1'
						? `每周${taskInfo.ctio_pro_time}` : `每隔${taskInfo.ctio_pro_time}天`)
					}}
				</view>
				<view
					class="currdet_c_content_item_right" 
					v-if="taskInfo.ctio_trigger_type == '1'">
					{{
						taskInfo.ctio_front_task_tm == '0'
						? '任务启动前' : '任务启动后'
					}}
					{{ taskInfo.ctio_front_task_days }}天
				</view>
				<view
					class="currdet_c_content_item_right" 
					v-if="taskInfo.ctio_trigger_type == '2'">
					时间:{{ taskInfo.ctio_time_begin.substring(5,10) }}
				</view>
			</view>
			<view class="currdet_c_content_item">
				<view class="currdet_c_content_item_left">
					完成时限：
				</view>
				<view class="currdet_c_content_item_right">
					{{ 
						taskInfo.ctio_alt2 == '0'
						? 
						`${taskInfo.ctio_finish_time}小时` 
						: 
						`${taskInfo.ctio_pro_days}天` 
					}}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	
	const props = defineProps({
		taskInfo:{
			type:Object,
			default:() => {}
		},
		type:{
			type:String,
			default:()=>''
		}
	});
	
</script>

<style lang="scss">
	.currdet_c_content{
		padding: 0 30rpx 0 30rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		box-shadow:#DCDCDC 0px 0px 3px; 
		
		.currdet_c_content_item:nth-child(1){
			border: none;
		}
		.currdet_c_content_item{
			display: flex;
			padding: 40rpx 0 40rpx 0;
			border-top: 1px solid #E3E3E3;
			font-size: 32rpx;
			
			.currdet_c_content_item_left{
				color: #ACB3C7;
				width: 30%;
			}
			.currdet_c_content_item_right{
				max-width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.ccir_grid {
				max-width: 70%;
				display: grid;
				grid-template-columns:repeat(2, 1fr);
				grid-row-gap:20rpx;
				grid-column-gap:20rpx;
			}
		}
	}
</style>