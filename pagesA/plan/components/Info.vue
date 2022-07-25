<template>
		<view class="body">
			<view class="ring">
				<view>
					{{ process.rates }}
				</view>
				<view>
					节点完成率
				</view>
			</view>
			<view class="font">
				<view>总计任务数</view>
				<view>{{ process.total }}</view>
			</view>
		</view>
		<view class="infos">
			<view class="item" v-for="(item,index) of list" :key="index">
				<view class="top">{{ item.number }}</view>
				<view class="bottom">{{ item.status }}</view>
			</view>
		</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { watch } from 'vue';
	import vTitle from './Title';

	const props = defineProps({
		processName:{
			type:String,
			default:() => 0
		},
		process:{
			type:Object,
			default:() => {}
		},
	});

	const list = ref([]);

	watch(
		() => props.process,
		(newVal, oldVal) => {
			if(newVal){
				list.value = [
					{
						number:newVal.taskComplete,
						status:'已完成',
					},
					{
						number:newVal.taskConduct,
						status:'正常进行',
					},
					{
						number:newVal.taskDelay,
						status:'延期进行',
					},
					{
						number:newVal.taskNotTriggered,
						status:'未触发',
					},
				]
			};
		},
		{
			deep:true
		}
	);
</script>

<style lang="scss">
		
		
		.body{
			height: 250rpx;
			display: flex;
			
			.ring{
				width: 200rpx;
				height: 200rpx;
				border-radius: 999rpx;
				border: 3px solid #5CACFF;
				margin-left: 20rpx;
				text-align: center;
				font-size: 32rpx;
				color: #5CACFF;
				view:nth-child(1){
					font-weight: bold;
				}
				view{
					margin-top: 25rpx;
				}
			}
			
			.font{
				margin-left: 50rpx;
				padding-top: 60rpx;
				
				view:nth-child(1){
					color: rgba(0,0,0,0.4);
					font-size: 32rpx;
				}
				view:nth-child(2){
					font-size: 48rpx;
					font-weight: bold;
				}
			}
		}
		
		.infos{
			display: flex;
			justify-content: space-between;
			margin-top: 70rpx;
			
			.item{
				width: 25%;
				text-align: center;
				
				.top{
					color: #666666;
					font-weight: bold;
					font-size: 38rpx;
				}
				.bottom{
					color: rgba(0,0,0,0.4);
					font-size: 36rpx;
					margin-top: 10rpx;
				}
			}
			
			.item:after{
				content: '';
				height: 80rpx;
				float: left;
				margin-top: -80rpx;
				border-left: 1px solid rgba(0,0,0,0.1);
			}
			
			.item:nth-child(1):after{
				content: '';
				border: none;
			}
		}
</style>
