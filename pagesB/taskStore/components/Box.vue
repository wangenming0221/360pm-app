<template>
	<view class="taskstore-c-box">
		<view
		@click="goPage(item)"
		 v-for="(item,index) of list"
		 :key="index"
		class="item">
			<view>{{ item.archives_name }}</view>
			<view>负责人：{{ item.nick_name }}</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});
	
	const goPage = (e) => {
		uni.navigateTo({
			url:`/pagesB/mc/mc?`
			+`title=${e.archives_name}`
			+`&archives_fkid=${e.archives_fkid}`
			+`&type=2`
		});
	};
</script>

<style lang="scss">
	.taskstore-c-box{
		width: 95%;
		margin: 0 auto;
		margin-top: 20rpx;
		min-height: 500rpx;
		background-color: #FFFFFF;
		
		.item{
			border-bottom: 1px solid rgba(0,0,0,0.1);
			padding-bottom: 40rpx;
			padding-top: 30rpx;
			
			view{
				padding-left: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 32rpx
			}
			view:nth-child(2){
				font-size: 30rpx;
				color:rgba(0,0,0,0.4);
			}
		}
	}
</style>
