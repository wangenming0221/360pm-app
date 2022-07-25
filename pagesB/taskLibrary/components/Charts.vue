<template>
	<view class="taskLibrary-c-charts">
		<view class="header">
			<view>任务类型</view>
			<view>
				<picker
				mode='selector'
				:range="times"
				range-key="name"
				:value="yearIndex"
				@change="yearChange">
					{{ year }}年
				</picker>
			</view>
		</view>
		<view class="chart-box">
			<qiun-data-charts
				v-if="status"
			    type="ring"
			    :chartData="chartData"
			    background="none"
			    :tapLegend="false"
			  />
		</view>
		<view class="header">
			<view>任务类型</view>
		</view>
		<view class="info">
			<view class="item" 
			v-for="(item,index) of chartData.series[0].data"
			:key="index"
			:style="{borderRight: index%2 == 0 
			? '1px solid rgba(0,0,0,0.1)':'1px solid #FFFFFF'}">
				<view class="top">
					<view 
						class="ring" 
						:style="{backgroundColor:item.backgroundColor}">
					</view>
					<view>{{ item.name }}</view>
				</view>
				<view class="center">
					{{ item.value }}个
				</view>
				<view class="bottom">
					 {{ item.num }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	
	const props = defineProps({
		chartData:{
			type:Object,
			default:() => {}
		},
		status:{
			type:Boolean,
			default:() => false
		},
	});
	const year = ref(Number(new Date().getFullYear()));
	const times = ref([]);
	const yearIndex = ref(0);

	const emits = defineEmits(['changeYear'])

	const yearChange = (e) => {
		year.value = times.value[e.detail.value].id;
		emits('changeYear', times.value[e.detail.value].id);
	};

	onMounted(() => {
		for(let i = year.value - 20; i < year.value + 20; i++) {
			times.value.push({
				name:i.toString(),
				id:i
			});
		};
		yearIndex.value = times.value.findIndex((item) => item.id === year.value);
	});
</script>

<style lang="scss">
	.taskLibrary-c-charts{
		margin-bottom: 30rpx;
		
		.header{
			display: flex;
			font-size: 30rpx;
			color: rgba(0,0,0,0.4);
			justify-content: space-between;
			padding: 30rpx;
		}
		
		.chart-box{
			height: 400rpx;
		}
		
		.info{
			display: flex;
			flex-wrap: wrap;
			
			.item{
				width: 49%;
				margin-top: 30rpx;
				
				.top{
					display: flex;
					justify-content: center;
					align-items: center;
					color: rgba(0,0,0,0.4);
					font-size: 32rpx;
					
					.ring{
						width: 25rpx;
						height: 25rpx;
						border-radius: 999rpx;
						margin-right: 20rpx;
					}
				}
				
				.center{
					height: 60rpx;
					line-height: 60rpx;
					font-size: 36rpx;
					font-weight: bold;
					text-align: center;
				}
				
				.bottom{
					font-size: 26rpx;
					color: rgba(0,0,0,0.4);
					text-align: center;
				}
			}
		}
	}
</style>
