<template>
	<view class="taskLibrary-c-progress">
		<view class="item"
			@click="goPage(item)"
			v-for="(item,index) of list" 
			:key="index">
			<view class="info">
				<view 
					class="ring" 
					:style="{
						backgroundColor: index%2 === 0
						? '#0099FF' 
						: (index%3 === 0 ? '#FF7A8C':'#FFA94C')
					}">
				</view>
				<view class="title">{{ item.archives_name }}</view>
				<view class="num">
					<span>{{ item.completeNum }}</span>
					<span>/{{ item.totalNum }}</span>
				</view>
			</view>

			<progress 
				:show-info="true"
				:percent="Number(item.rate.slice(0, item.rate.length - 1))" 
				:activeColor="index%2 === 0
				? '#0099FF' 
				: (index%3 === 0 ? '#FF7A8C':'#FFA94C')"
			/>
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
			url:`/pagesB/mc/mc?title=${e.archives_name}&archives_fkid=${e.archives_fkid}&type=1`
		});
	};
</script>

<style lang="scss">
	.taskLibrary-c-progress{
		padding: 60rpx 30rpx 60rpx 30rpx;
		
		.item{
			margin-top: 20rpx;
			
			.info{
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
				
				.ring{
					width: 25rpx;
					height: 25rpx;
					border-radius: 999rpx;
				}
				.title{
					margin-left: 10rpx;
					color: #666666;
					font-size: 34rpx;
				}
				.num{
					margin-left: auto;
					font-size: 35rpx;
					
					span:nth-child(1){
						font-size: 36rpx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
