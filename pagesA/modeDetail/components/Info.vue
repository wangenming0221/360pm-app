<template>
	<view class="modeDetail-c-info">
		<view class="title">
			基本信息
		</view>
		<view class="item">
			<view class="name">
				所属项目
			</view>
			<view class="content">
				{{ info.project_name }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				计划节点
			</view>
			<view class="content">
				{{ info.baseProcessesName }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				执行角色
			</view>
			<view class="content">
				{{ info.role_name }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				业务线
			</view>
			<view class="content">
				{{ info.archives_name }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				发布角色
			</view>
			<view class="content">
				{{ info.releaseRoleName }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				截止时间
			</view>
			<view class="content">
				{{ info.taio_begin_time }}-{{ info.taio_end_time }}
			</view>
		</view>
		
		<view class="item">
			<view class="name">
				任务描述
			</view>
			<view class="content">
				<rich-text :nodes="info.taio_describe"></rich-text>
			</view>
		</view>
		<!-- <view class="item">
			<view class="name">
				附件
			</view>
			<view class="appendix">
				<view 
					class="child" 
					v-for="(item,index) of info.taskActualFiles"
					:key="index">
					{{ item.tahl_address }}
				</view>
			</view>
		</view> -->
	</view>
</template>

<script setup>
	const props = defineProps({
		info:{
			type:Object,
			default:() => {}
		},
	});
</script>

<style lang="scss">
	.modeDetail-c-info{
		padding-left: 20rpx;
		
		.title{
			height: 100rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			font-weight: bold;
			border-bottom: 1px solid rgba(0,0,0,0.1);
			margin-bottom: 10rpx;
		}
		
		.item{
			display: flex;
			font-size: 30rpx;
			margin-bottom: 50rpx;
			padding-left: 10rpx;
			
			.name{
				width: 30%;
				color: rgba(0,0,0,0.4);
			}
			.content{
				width: 65%;
			}
			
			.appendix{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				width: 65%;
				
				.child{
					max-width: 100%;
					margin-bottom: 20rpx;
					background-color: #E4E4E4;
				}
			}
		}
	}
</style>
