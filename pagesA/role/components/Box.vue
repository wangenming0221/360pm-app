<template>
	<view class="role-c-box">
		<view 
			class="item"
			v-for="(item,index) of list"
			:key="index"
			@click="lookDetail(item)">
			<view class="title">
				<view>{{ item.role_name }}</view>
				<view
				:class="(item.taio_state == '2' || item.taio_state == '3')  
				? 'ongoing' : ((item.taio_state == '1' || item.taio_state == '6') 
				? 'delay':'finish')">
					{{ item.taio_state == '1' ? '未开始'
					:(item.taio_state == '2' ? '进行中'
					:(item.taio_state == '3' ? '已完成'
					:(item.taio_state == '4' ? '已超期'
					:(item.taio_state == '5' ? '已预警':'已取消')))) }}
				</view>
			</view>
			<view class="child">
				<view>{{ item.nick_name }}</view>
				<view>
					{{ item.taio_state == '1' ? '未开始数量：'
					:(item.taio_state == '2' ? '进行中数量：'
					:(item.taio_state == '3' ? '已完成数量：'
					:(item.taio_state == '4' ? '已超期数量：'
					:(item.taio_state == '5' ? '已预警数量：':'已取消数量：')))) }}
					{{ item.num }}
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
		taio_state:{
			type:String,
			default:() => ''
		}
	});

	const lookDetail = (e) => {
		uni.navigateTo({
			url:`/pagesA/roleDetail/roleDetail?user_fkid=${e.user_fkid}&taio_state=${props.taio_state}&role_fkid=${e.role_fkid}`
		});
	};
</script>

<style lang="scss">
	.role-c-box{
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
				}
				view:nth-child(2){
					height: 60rpx;
					width: 120rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 30rpx;
					border-radius: 12rpx;
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
			
			.child{
				display: flex;
				margin-bottom: 30rpx;
				padding-right: 30rpx;
				padding-left: 30rpx;
				font-size: 32rpx;
				
				view:nth-child(1){
					color: rgba(0,0,0,0.4);
				}
				view:nth-child(2){
					margin-left: auto;
					color: #D92A2A;
				}
			}
		}
	}
</style>
