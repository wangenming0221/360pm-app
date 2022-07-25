<template>
	<view class="ring-header">
		<view class="child">
			<slot />
		</view>	
	</view>
</template>

<script>
</script>

<style lang="scss">
	.ring-header{
		height: 550rpx;
		width: 100%;
		border-radius: 0 0 200rpx 200rpx;
		background-color: #D0DEFF;
		left: 0;
		top: 0;
		position: absolute;
		z-index: -999;
		
		.child{
			position: absolute;
			width: 100%;
			height: 400rpx;
			border-radius: 0 0 200rpx 200rpx;
			left: 0;
			top: 0;
			background-color: #5882FF;
			z-index: -888;
		}
	}
</style>
