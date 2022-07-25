<template>
	<view class="index-c-project" :style="{height:hasVal ? '600rpx':'auto'}">
		<view class="box" v-if="hasVal">
			<view class="top">
				<view class="task_item">
				<view class="task_a">
					<view class="info task_a_child">
						<view class="info_a" style="background-color: #2758FB;"></view>
						<view class="info_b" style="background-color: rgba(39,88,251,0.3);">
							<view class="info_b_child" style="background-color: #2758FB;"></view>
						</view>
						<view class="info_c">{{ categories[0].name }}:</view>
						<view class="info_d">{{ categories[0].value }}个</view>
					</view>
				</view>
				</view>
				<view class="task_item">
					<view class="task_b">
						<view class="info task_b_child">
							<view class="info_a" style="background-color: #3A91FD;"></view>
							<view class="info_b" style="background-color: rgba(58,145,253,0.3);">
								<view class="info_b_child" style="background-color: #3A91FD;"></view>
							</view>
							<view class="info_c">{{ categories[1].name }}:</view>
							<view class="info_d">{{ categories[1].value }}个</view>
						</view>
					</view>
				</view>
				<view class="task_item">
					<view class="task_c">
						<view class="info task_c_child">
							<view class="info_a" style="background-color: #20DA7B;"></view>
							<view class="info_b" style="background-color: rgba(32,218,123,0.3);">
								<view class="info_b_child" style="background-color: #20DA7B;"></view>
							</view>
							<view class="info_c">{{ categories[2].name }}:</view>
							<view class="info_d">{{ categories[2].value }}个</view>
						</view>
					</view>
				</view>
				<view class="task_item">
					<view class="task_d">
						<view class="info task_d_child">
							<view class="info_a" style="background-color: #FFC100;"></view>
							<view class="info_b" style="background-color: rgba(255,193,0,0.3);">
								<view class="info_b_child" style="background-color: #FFC100;"></view>
							</view>
							<view class="info_c">{{ categories[3].name }}:</view>
							<view class="info_d">{{ categories[3].value }}个</view>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="item">
					<view class="item-color" style="background-color: #2758FB;"></view>
					<view class="item-name">{{ categories[0].name }}</view>
				</view>
				<view class="item">
					<view class="item-color" style="background-color: #3A91FD;"></view>
					<view class="item-name">{{ categories[1].name }}</view>
				</view>
				<view class="item">
					<view class="item-color" style="background-color: #20DA7B;"></view>
					<view class="item-name">{{ categories[2].name }}</view>
				</view>
				<view class="item">
					<view class="item-color" style="background-color: #FFC100;"></view>
					<view class="item-name">{{ categories[3].name }}</view>
				</view>
			</view>
		</view>
		<!-- <qiun-data-charts
		 	v-if="hasVal"
		    type="funnel"
		    :chartData="chartData"
		    background="none"
		  />-->
		<v-no-data v-else></v-no-data>   
	</view>
</template>

<script setup>
	import { watch, ref } from "vue";
	import vNoData from '@/components/NoData';
	
	const props = defineProps({
		projectInfo:{
			type:Object,
			default:() => {}
		},
	});
	const hasVal = ref(false);
	const categories = ref([]);

	watch(
		() => props.projectInfo,
		(newVal, oldVal) => {
			if(newVal) {
				const { taskNotTriggered,taskComplete,taskConduct,taskDelay } = newVal;
				if(taskNotTriggered == 0 && taskComplete == 0 && taskConduct == 0 && taskDelay == 0) {
					hasVal.value = false;
				}else {
					hasVal.value = true;
				}
				let array = [];
				array[0] = Object.assign({}, {name:"未触发",value:taskNotTriggered});
				array[1] = Object.assign({}, {name:"已完成",value:taskComplete});
				array[2] = Object.assign({}, {name:"正常进行",value:taskConduct});
				array[3] = Object.assign({}, {name:"延期进行",value:taskDelay});
				categories.value = array.sort((n1, n2) => {
					return n2.value - n1.value
				});
			}
		},
		{deep:true}
	);

</script>

<style lang="scss">
	.index-c-project{
		border-bottom: 1px solid rgba(0,0,0,0.1);
		width: 100%;

		.box{
			.top{
				margin-left: -310rpx;
				.task_item{
					display: flex;
					justify-content: center;
					margin-top: -1rpx;

					.task_a {
						border-top: 100rpx solid #2758FB;
						border-left: 50rpx solid transparent;
						border-right: 50rpx solid transparent;
						height: 0;
						width: 230rpx;
						position: relative;
						.task_a_child{
							left: 250rpx;
						}
					}
					.task_b{
						border-top: 110rpx solid #3A91FD;
						border-left: 50rpx solid transparent;
						border-right: 50rpx solid transparent;
						height: 0;
						width: 134rpx;
						position: relative;
						.task_b_child{
							left: 155rpx;
						}
					}
					.task_c{
						border-top: 120rpx solid #20DA7B;
						border-left: 50rpx solid transparent;
						border-right: 50rpx solid transparent;
						height: 0;
						width: 40rpx;
						position: relative;
						.task_c_child{
							left: 65rpx;
							top:-80rpx;
						}
					}
					.task_d{
						width:0px;
						height:0px;
						border-top:65rpx solid #FFC100;
						border-bottom:100rpx solid transparent;
						border-left:23rpx solid transparent;
						border-right:23rpx solid transparent;
						margin-top: -1rpx;
						position: relative;
						.task_d_child{
							left: 13rpx;
							top: -55rpx;
						}
					}

					.info{
							position: absolute;
							display: flex;
							align-items: center;
							font-size: 25rpx;
							font-weight: bold;
							top: -70rpx;

							.info_a {
								width: 90rpx;
								height: 6rpx;
							}
							.info_b {
								width: 40rpx;
								height: 40rpx;
								border-radius: 999rpx;
								display: flex;
								justify-content: center;
								align-items: center;

								.info_b_child{
									width: 25rpx;
									height: 25rpx;	
									border-radius: 999rpx;
								}
							}
							.info_c{
								width: 120rpx;
								margin-left: 10rpx;
								color: #9A9E9F;
							}
							.info_d{
								color: #0A0A0A;
								width: 120rpx;
							}
					}
					
				}
			}
			.bottom{
				display: flex;

				.item{
					flex:1;
					display: flex;
					align-items: center;

					.item-color{
						width: 45rpx;
						height: 20rpx;
						border-radius: 999rpx;
					}
					.item-name{
						margin-left: 10rpx;
						font-size:26rpx;
						color: #9A9E9F;
						font-weight: bold;
					}
				}
			}
		}

	}
</style>
