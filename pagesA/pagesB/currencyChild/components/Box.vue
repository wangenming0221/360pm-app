<template>
	<view class="currchi_c_box">
		<view class="ccb_item" v-for="(item, index) of list" :key="index" @click="goDetail(item)">
			<view class="ccb_header">
				<text>{{ item.ctio_task_name }}</text>
				<text>{{ item.archives_name }}</text>
			</view>
			<view class="ccb_content">
				<view class="ccb_c_code">
					<view>任务编号：</view>
					<view>{{ item.ctio_task_code }}</view>
				</view>
				<view class="ccb_c_desc">
					<view>任务描述：</view>
					<view :class="!item.actived ? 'hid':''">
						<rich-text :nodes="item.ctio_describe"></rich-text>
					</view>
				</view>
				<view class="lookAll" @click.stop="lookAll(index)" v-if="item.ctio_describe">
					{{ !item.actived ? '展开':'收起'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	
	const props = defineProps({
		list:{
			type:Array,
			default:()=>[]
		}
	})
	
	const lookAll = (index) => {
		props.list[index].actived = !props.list[index].actived;
	};
	
	const goDetail = (element) => {
		const query = JSON.stringify(element);
		uni.navigateTo({
			url:`/pagesB/currencyDetail/currencyDetail?query=${encodeURIComponent(query)}`
		})
	};
	
</script>

<style lang="scss">
	.currchi_c_box{
		width: 90%;
		margin: 0 auto;
		margin-bottom: 40rpx;
		
		.ccb_item{
			width: 100%;
			background-color: #ffffff;
			border-radius: 24rpx;
			margin-top: 40rpx;
			
			.ccb_header{
				margin-left: 2%;
				padding: 35rpx;
				display: flex;
				justify-content: space-between;
				font-size: 34rpx;
				border-bottom: 1px dashed #DFE2E5;
				
				text:nth-child(1){
					color: #273052;
				}
				text:nth-child(2){
					color: #FFB320;
				}
			}
			.ccb_content{
				padding: 45rpx;
				
				.ccb_c_code{
					display: flex;
					font-size: 32rpx;
				
					view:nth-child(1){
						width: 30%;
						color: #ACB3C7;
					}
					view:nth-child(2){
						width: 70%;
						color: #49496A;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				
				.ccb_c_desc{
					display: flex;
					font-size: 32rpx;
					margin-top: 50rpx;
					
					view:nth-child(1){
						width: 30%;
					}
					view:nth-child(2){
						width: 70%;
						
					}
					.hid{ //文本第二行显示...
						overflow:hidden;
						text-overflow:ellipsis;
						display: -webkit-box;
						-webkit-box-orient:vertical;
						-webkit-line-clamp:2; 
					}
				}
				
				.lookAll{
					font-size: 32rpx;
					color: #6392FE;
					text-align: right;
				}
			}
		}
	}
</style>