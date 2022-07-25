<template>
	<view class="safeAdmin-c-box">
		<view class="item">
			<view class="header">编写安全汇报PPT</view>
			<view class="content">
				施工方案编制计划表根据项目时间情况，
				结合施工图纸/项目施工总进度计划进行编制
			</view>
			<view class="name">
				负责人：刘博
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.safeAdmin-c-box{
		width: 95%;
		margin: 0 auto;
		min-height: 600rpx;
		background-color: #FFFFFF;
		
		.item{
			margin-bottom: 30rpx;
			border: 1px solid rgba(0,0,0,0.1);
			
			.header{
				height: 70rpx;
				line-height: 70rpx;
				font-weight: 36rpx;
				font-weight: bold;
				padding-left: 30rpx;
			}
			
			.content{
				margin-top: 30rpx;
				font-size: 32rpx;
				color: rgba(0,0,0,0.4);
				padding-left: 30rpx;
				padding-right: 40rpx;
			}
			.name{
				font-size: 30rpx;
				color: rgba(0,0,0,0.4);
				padding-left: 40rpx;
				height: 80rpx;
				line-height: 80rpx;
			}
			
			.bottom{
				width: 90%;
				margin: 0 auto;
				margin-top: 40rpx;
				margin-bottom: 40rpx;
				font-size: 32rpx;
				color: rgba(0,0,0,0.4);
				align-items: center;
				height: 60rpx;
				line-height: 60rpx;
				display: flex;
				justify-content: space-between;
				
				view:nth-child(2){
					width: 160rpx;
					text-align: center;
					border-radius: 999rpx;
					border: 1px solid rgba(0,0,0,0.1);
				}
			}
		}
	}
</style>
