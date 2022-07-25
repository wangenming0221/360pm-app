<template>
	<view class="compare-c-charts">
		<view class="item" v-for="(item,index) of list" :key="index">
			<view class="a">
				<view>{{ item.name }}</view>
				<view :style="{color:item.chartData.series[0].color}">{{ item.num }}</view>
			</view>
			<!-- <view 
			class="b" 
			:style="{
				color:item.chartData.series[0].color,
				backgroundColor: index%2 == 0 ? '#E8F9F0' : '#FFF0EF'
			}">
				{{ item.char }}
			</view> -->
			<view class="c">
				<!-- <qiun-data-charts
				    type="compareA"
				    :chartData="item.chartData"
				    background="none"
				    :tapLegend="false"
				  /> -->
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, onMounted } from 'vue';
	import { get } from '@/api/request.js';
	
	const list = reactive([
					{
						name:'全部延误',
						num:0,
						char:'-0.58%',
						chartData:{
						  categories:["a","b","c","d","e","f","g","h","i","j"],
						  series:[
							{
							  "name": "成交量A",
							  "color":"#19BE6B",
							  "data": [35,8,25,37,4,20,10,12,5,30],
							}
						  ],
						},
					},
					{
						name:'执行延误',
						num:0,
						char:'+0.36%',
						chartData:{
						  categories:["a","b","c","d","e","f","g","h","i","j"],
						  series:[
							{
							  "name": "成交量A",
							  "color":"#FF7A8C",
							  "data": [35,8,25,37,4,20,10,12,5,30],
							}
						  ],
						},
					},
					{
						name:'审批延误',
						num:0,
						char:'-0.45%',
						chartData:{
						  categories:["a","b","c","d","e","f","g","h","i","j"],
						  series:[
							{
							  "name": "成交量A",
							  "color":"#19BE6B",
							  "data": [35,8,25,37,4,20,10,12,5,30],
							}
						  ],
						},
					}
	]);
	// 配置统计图
	const getDefer = async() => {
				const params = {
					data:{},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectDelayAnalysis'
				};
				await get(params)
					.then(res => {
						if(res.data){
							const { totalTaskDelay,taskDelayApprove,taskDelayExecute } = res.data;
							list[0].num = totalTaskDelay;
							list[1].num = taskDelayApprove;
							list[2].num = taskDelayExecute;
						};
					});
	};

	onMounted(() => {
		getDefer();
	});

</script>

<style lang="scss">
	.compare-c-charts{
		background-color:#F8F8F8;
		height: 380rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		
		.item{
			width: 30%;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			
			.a{
				height: 110rpx;
				padding-top: 30rpx;
				
				view{
					text-align: center;
				}
				view:nth-child(1){
					font-size: 32rpx;
					color: #666666;
				}
				view:nth-child(2){
					font-size: 34rpx;
					font-weight: bold;
				}
			}
			.b{
				height: 60rpx;
				line-height: 60rpx;
				font-size: 28rpx;
				width: 150rpx;
				margin: 0 auto;
				text-align: center;
				border-radius: 12rpx;
			}
			.c{
				height: 100rpx;
			}
		}
	}
</style>
