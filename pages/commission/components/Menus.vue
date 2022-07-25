<template>
	<view class="commission-c-menus">
		<view
			@click="change(item.id, index)"
			class="item" 
			v-for="(item,index) of list" 
			:key="index">
			<!-- <view class="mybadge" v-if="Number(item.badgeVal) > 0">
				{{ item.badgeVal }}
			</view> -->
			<uni-badge class="mybadge" :text="item.badgeVal" />
			<view class="img">
				<image :src="actived === index ? item.icon_n : item.icon" mode=""></image>
			</view>
			<view 
				class="name" 
				:style="{'color':actived === index ? '#1E1F20':'#778085'}">
					{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';

	const store = mainDataStore();
	const { CommissionInfo } = storeToRefs(store);
	const actived = ref(0);

	const list = ref([
		{
			badgeVal:computed(() =>	CommissionInfo.value.total),
			name:'全部待办',
			icon:`${store.baseUrl}/syty360pm/appPicture/commission/menu1.png`,
			icon_n:`${store.baseUrl}/syty360pm/appPicture/commission/menu1_n.png`,
			id:'1'
		},
		{
			badgeVal:computed(() =>	CommissionInfo.value.appConductDelayHistoryIPageTotal),
			name:'待执行',
			icon:`${store.baseUrl}/syty360pm/appPicture/commission/menu2.png`,
			icon_n:`${store.baseUrl}/syty360pm/appPicture/commission/menu2_n.png`,
			id:'2'
		},
		{
			badgeVal:computed(() =>	CommissionInfo.value.examineHistoryIPageTotal),
			name:'待审批',
			icon:`${store.baseUrl}/syty360pm/appPicture/commission/menu3.png`,
			icon_n:`${store.baseUrl}/syty360pm/appPicture/commission/menu3_n.png`,
			id:'3'
		},
		{
			badgeVal:computed(() =>	CommissionInfo.value.receivedHistoryIPageTotal),
			name:'待接受',
			icon:`${store.baseUrl}/syty360pm/appPicture/commission/menu4.png`,
			icon_n:`${store.baseUrl}/syty360pm/appPicture/commission/menu4_n.png`,
			id:'4'
		}			
	]);

	const emits = defineEmits(['menuChange']);

	const change = (id, index) => {
		if(actived.value != index) {
			actived.value = index;
			emits('menuChange', id);
		}
	};
	
	const callBack = () => {
		actived.value = 0;
	};
	
	defineExpose({
	    callBack
	});

</script>

<style lang="scss">
	.commission-c-menus{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 80%;
		margin: 0 auto;
		margin-top: 50rpx;
		
		.item{
			width: 100rpx;
			position: relative;
			
			.mybadge{
				position: absolute;
				color: #FFFFFF;
				font-size: 26rpx;
				right: -20rpx;
				top: -10rpx;
				z-index: 999;
				border-radius: 999rpx;
			}
			
			.img{
				height: 100rpx;
				width: 100rpx;
				border-radius: 999rpx;
				
				
				image{
					width: 100%;
					height: 100%;
				}
			}
			
			.name{
				margin-top: 20rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: 500;
			}
		}
	}
</style>
