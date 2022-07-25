<template>
	<view class="mc-c-box">
		<view 
			class="item"
			v-for="(item,index) of list"
			:key="index"
			>
			<view class="title">
				<view>{{ item.taio_task_name }}</view>
				<view
				:class="(item.taio_state == '2' || item.taio_state == '3')
				? 'ongoing' : ((item.taio_state == '1' || item.taio_state == '6') 
				? 'delay':'finish')">
				{{ item.taio_state == '1' ? '未开始'
				:(item.taio_state == '2' ? '进行中'
				:(item.taio_state == '3' ? '已完成'
				:(item.taio_state == '4' ? '已超期'
				:(item.taio_state == '5' ? '已预警':'已取消')))) }}
				<text v-if="item.taio_state == '4'">{{ item.days }}天</text>
				</view>
			</view>
			<view class="content">
				<rich-text :nodes="item.taio_describe"></rich-text>
			</view>
			<view 
				class="bottom" 
				:style="{paddingLeft: type == '1' ? '20rpx':'60rpx'}">
				<view class="bottom_role">
					<uni-icons type="person" v-if="type == '2'"></uni-icons>
					{{ type == '1' ? `负责人:${item.nick_name}` : item.nick_name }}
				</view>
				<view v-if="item.taio_begin_time && item.taio_end_time && type == '1'">
					{{ item.taio_begin_time.slice(0,10) }}~{{ item.taio_end_time.slice(0,10) }}
				</view>
			</view>
			<view class="type2" v-if="type == '2'">
				<view>
					<uni-icons type="checkbox"></uni-icons>
					{{ item.taio_is_for == '0' ? '一次性任务':'周期性任务'}}
				</view>
				<view @click="lookDetail(item)">
					查看详情
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
		type:{
			type:String,
			default:() => ''
		}
	});
	
	const lookDetail = (item) => {
		// uni.navigateTo({
		// 	url:`/pagesA/modeDetail/modeDetail?taioPkid=${item.taio_pkid}`
		// });
		uni.navigateTo({
			url:`/pagesC/commissionLoad/commissionLoad?pkid=${item.taio_pkid}&token=${uni.getStorageSync('token')}`
		});
	};
</script>

<style lang="scss">
	.mc-c-box{
		width: 90%;
		margin: 0 auto;
		margin-top: 150rpx;
		margin-bottom: 50rpx;
		border-top: 1px solid rgba(245,245,245,0.8);
		border-left: 1px solid rgba(245,245,245,0.8);
		border-right: 1px solid rgba(245,245,245,0.8);
		background-color: #FFFFFF;
		min-height: 500rpx;
		
		.item{
			border: 1px solid rgba(0,0,0,0.1);
			width: 95%;
			margin: 0 auto;
			margin-top: 30rpx;
			
			.title{
				padding-left: 20rpx;
				padding-right: 20rpx;
				display: flex;
				justify-content: space-between;
				height: 110rpx;
				line-height: 110rpx;
				align-items: center;
				
				
				view:nth-child(1){
					font-size: 34rpx;
					font-weight: bold;
					max-width: 60%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				view:nth-child(2){
					height: 60rpx;
					width: 200rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 30rpx;
					border-radius: 12rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.ongoing{
					border:1px solid #19BE6B;
					color:#19BE6B;
					background-color: #E7F4EE;
				}
				.delay{
					border:1px solid #FF9900;
					color:#FF9900;
					background-color: #FFF7EB;
				}
				.finish{
					border:1px solid #409EFF;
					color:#409EFF;
					background-color: #F0F7FF;
				}
			}
			
			.content{
				padding-left: 20rpx;
				padding-right: 40rpx;
				font-size: 32rpx;
				color: rgba(0,0,0,0.4);
				margin-top: 30rpx;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
			}
			
			.bottom{
				height: 90rpx;
				line-height: 90rpx;
				padding-right: 40rpx;
				display: flex;
				font-size: 24rpx;
				color: rgba(0,0,0,0.4);
				
				.bottom_role{
					max-width: 35%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				view:nth-child(2){
					margin-left: auto;
				}
			}
			.type2{
				padding-left: 60rpx;
				padding-right: 40rpx;
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: rgba(0,0,0,0.4);
				margin-bottom: 30rpx;
				
				
				view:nth-child(2){
					margin-left: auto;
					border-radius: 999rpx;
					width: 150rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					border: 1px solid rgba(0, 0, 0, 0.1);
				}
			}
		}
	}
</style>
