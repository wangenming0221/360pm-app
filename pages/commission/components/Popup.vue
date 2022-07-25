<template>
	<uni-drawer 
	ref="showRight" 
	mode="right" 
	:mask-click="true"
	width="280"
	@change="scrollShow">

		<scroll-view style="height: 100%;" scroll-y="true">
	     <view class="commission-c-popup">
			<view class="child">
			   <view class="title">
				   是否延期
			   </view>
			   <view class="box">
					<view
					 @click="change(1,index)"
						class="item"
						 :class="actived1 === index ? 'actived':''"
						v-for="(item,index) of child1"
						:key="index">
							{{ item }}
					</view>
			   </view>
			</view>
			<view class="child">
		   		<view class="title">
		   		   任务类型
		   		</view>
		   		<view class="box">
		   			<view
					 @click="change(2,index)"
						class="item"
						 :class="actived2 === index ? 'actived':''"
						v-for="(item,index) of child2"
						:key="index">
							{{ item }}
					</view>
		   		</view>
			</view>
			<!-- <view class="child">
		   		<view class="title">
		   		   任务属性
		   		</view>
		   		<view class="box">
		   			<view
					 @click="change(3,index)"
						class="item"
						:class="actived3 === index ? 'actived':''"
						v-for="(item,index) of child3"
						:key="index">
							{{ item }}
					</view>
		   		</view>
			</view> -->
			<view class="child">
				<view class="title">
				   列表排序规则
				</view>
				<view class="box">
					<view
					 @click="change(4,index)"
						class="item"
						:class="actived4 === index ? 'actived':''"
						v-for="(item,index) of child4"
						:key="index">
							{{ item }}
					</view>
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
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import bus from '@/common/bus.js';
	
	
	const child1 = ['全部', '是'];
	const child2 = ['全部','通用任务','临时任务','协同任务','公司任务'];
	const child3 = ['全部','已提交','已驳回'];
	const child4 = ['发布时间排序','完成时间排序'];
	const showRight = ref(null);
	const actived1 = ref(0);
	const actived2 = ref(0);
	const actived3 = ref(0);
	const actived4 = ref(0);
	const drawWidth = ref(0);
	
	const open = () => {
		bus.on('popupOpen',() => {
			showRight.value.open();
		})
	};

	const emits = defineEmits(['scrollShow', 'reset']);
	
	const scrollShow = (e) => {
		const query = {
			taio_is:actived1.value,
			ctio_form:actived2.value === 0 ? '' : actived2.value - 1,
			order_flag:actived4.value + 1
		};
        emits('scrollShow', e, query);
    };

	const close = () => {
		showRight.value.close();
	};

	const change = (type,index) => {
		 switch(type){
			case 1:
				actived1.value = index;
			break;
			case 2:
				actived2.value = index;
			break;
			case 3:
				actived3.value = index;
			break;
			case 4:
				actived4.value = index;
			break;
		};
	};

	const reset = () => {
		actived1.value = 0;
		actived2.value = 0;
		actived3.value = 0;
		actived4.value = 0;
		emits('reset')
	};

	onMounted(() => {
		open();
	});

	onUnmounted(() => {
		bus.off('popupOpen');
	});

</script>

<style lang="scss">
	.commission-c-popup{
		padding-top: 50rpx;
		padding-bottom: 200rpx;
		width: 280px;
		
		.child{
			padding-left:20rpx;
			margin-top: 70rpx;
			
			.title{
				font-weight: bold;
				color: #273052;
				font-size: 16px;
			}
			
			.box{
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(200rpx,1fr));
				grid-row-gap:20rpx;
				grid-column-gap:20rpx;
				
				
				.item{
					background-color: #F6F6F6;
					border-radius: 7px;
					font-weight: 500;
					color: #273052;
					font-size: 13px;
					border: 1px solid #FFFFFF;
					text-align: center;
					padding: 5px 0 5px 0;
				}
				
				.actived{
					color: #667EFE;
					background-color: rgba(102,126,254,0.1);
					border: 1px solid #667EFE;
				}
			}
			
			.box:after{
				content: '';
				height: 0; 
				width: 80px;
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
	
</style>
