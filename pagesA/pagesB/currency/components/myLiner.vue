<template>
	<view class="currency_c_liner" v-for="(item, index) of list" :key="index">
		<view class="linner_box">
			<view class="lb_left"></view>
			<view class="lb_title">{{ item.archives_name }}</view>
		</view>
		<view class="linner_content" @click="goPath(item)">
			<view class="lc_item">
				<view class="lci_num">
					{{ item.total }}
				</view>
				<view class="lci_name">
					总任务数(个)
				</view>
			</view>
			<view class="lc_item">
				<view class="lci_num">
					{{ item.workingProcedure }}
				</view>
				<view class="lci_name">
					工序关联(个)
				</view>
			</view>
			<view class="lc_item">
				<view class="lci_num">
					{{ item.taskAssociation }}
				</view>
				<view class="lci_name">
					任务关联(个)
				</view>
			</view>
			<view class="lc_item">
				<view class="lci_num">
					{{ item.timeAssociation }}
				</view>
				<view class="lci_name">
					时间关联(个)
				</view>
			</view>
		</view>
		<view class="gap"></view>
	</view>
</template>

<script setup>
	
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});
	const goPath = (options) => {
		uni.navigateTo({
			url:`/pagesB/currencyChild/currencyChild?archives_pkid=${options.archives_pkid}`
		})
	};
</script>

<style lang="scss">
	.currency_c_liner{
		margin-top: 30rpx;
		
		.linner_box{
			width: 90%;
			margin: 0 auto;
			display: flex;
			align-items: center;
			height: 120rpx;
			line-height: 120rpx;
			border-bottom: 1px solid #F1F1F1;
			
			.lb_left{
				height: 50rpx;
				width: 15rpx;
				margin-right: 30rpx;
				border-radius: 999rpx;
				background: linear-gradient(to bottom,#629CFF,#0358FF);
			}
			.lb_title{
				color: #273052;
				font-size: 34rpx;
				font-weight: bold;
			}
		}
		.linner_content{
			width: 90%;
			margin: 0 auto;
			display: flex;
			justify-content: space-around;
			margin-top: 30rpx;
			
			.lc_item{
				text-align: center;
				margin-top: 20rpx;
				margin-bottom: 50rpx;
				
				.lci_num{
					color: #6392FE;
					font-size: 36rpx;
				}
				.lci_name{
					margin-top: 20rpx;
					color: #768893;
					font-size: 25rpx;
				}
			}
		}
	}
</style>