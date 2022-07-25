<template>
	<view class="messages">
		<view class="header">
			<view class="top">消息</view>
		</view>
		<view class="sticky" @click="already">一键已读</view>	
		<view class="box">
			<view class="item" v-for="(item,index) of list" :key="index" @click="goDetail(item,index)">
				<view class="left">
					<image class="img" :src="icon" mode=""></image>
					<view v-if="item.message_status == '1'" class="left-abs"></view>
				</view>
				<view class="right">
					<view class="a">
						<view>{{ item.message_title }}</view>
						<view><text>{{ item.create_time }}</text></view>
					</view>
					<view class="b">
						{{ item.message_content }}
					</view>
				</view>
			</view>
		</view>
		<v-no-data v-if="list.length === 0"></v-no-data>
		<uni-load-more v-if="total > 15" :status="status"></uni-load-more>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { onReachBottom } from '@dcloudio/uni-app';
	import { post } from '@/api/request.js';
	import vNoData from '@/components/NoData';

	const store = mainDataStore();
	const { messagesInfo } = storeToRefs(store);
	const icon = `${store.baseUrl}/syty360pm/appPicture/messages/icon1.png`;
	const status = ref('more');
	
	const total = ref(0);
	const list = ref([]);
	const page = ref(1);

	const nextPage = () => {
			page.value ++;
			status.value = 'loading';
			const query = {
				current:page.value,
      			size:15,
				isTime:false
			};
			 store.getMessages(query)
	};
	// 前往详情页
	const goDetail = (item,index) => {
		uni.navigateTo({
			url:`/pagesC/messageDetail/messageDetail?query=${JSON.stringify(item)}`
		});
		list.value[index].message_status = '2';
		const data = {
			total:total.value,
			records:[]
		};
		const datas = {
            data,
            isTime:false
        }
		store.messagesInfo = Object.assign({}, datas);
	};
	watch(
		() => messagesInfo,
		(newVal, oldVal) => {
			if(newVal.value) {
				let curPage = getCurrentPages();
				let route = curPage[curPage.length - 1].route;
				if(newVal.value.isTime) {
					if(route == 'pages/messages/messages') {
						page.value = 1;
						list.value = [];
						uni.pageScrollTo({
							scrollTop:0
						});
					}
				}
				if(newVal.value.data) {
					total.value = newVal.value.data.total;
					list.value = [...list.value,...newVal.value.data.records];
					status.value = 'more';
				}
			}
		},
		{
			deep:true,
			immediate:true
		}
	)
	//一键已读
	const already = async() => {
		const arr = [];
		list.value.map(item => {
			arr.push({
				message_pkid:item.message_pkid,
				message_status:2
			});
		})
		const params = {
			data:arr,
			url:'/360-manage-core-operatemanage/MessageInfo/modify/updates'
		};
		await post(params)
			.then(res => {
				if(res.success){
					list.value.forEach(item => {
						item.message_status = '2';
					}); 	
				};
			});
	};

	onReachBottom(() => {
		if(status.value == 'loading'){
			return false;
		};
		if(page.value >= messagesInfo.value.data.pages){
			status.value = 'noMore';
			return false;
		};
		nextPage();
	});
	
</script>

<style lang="scss">
	.messages{
		padding-bottom: 50rpx;
		
		.header{
			
			.top{
				padding-left: 50rpx;
				height: 250rpx;
				line-height: 300rpx;
				font-weight: bold;
				font-size: 42rpx;
				letter-spacing: 4rpx;
				background:linear-gradient(#BED7F5, #EFF3FC, #F5FBFB, #FFFFFF);
			}
		
		}
		.sticky{
			position: sticky;
			padding-left: 50rpx;
			top: 100rpx;
			z-index: 100;
			font-size: 32rpx;
			color: #969696;
		}
		
		.box{
			width: 90%;
			margin: 0 auto;
			margin-top: 150rpx;
			margin-bottom: 50rpx;
			
			.item{
				height: 120rpx;
				padding-bottom: 50rpx;
				border-bottom: 1px solid rgba(0,0,0,0.1);
				display: flex;
				margin-top: 50rpx;
				
				.left{
					width: 120rpx;
					border-radius: 999rpx;
					background-color: #9ECEFE;
					position: relative;
					
					.img{
						width: 100%;
						height: 100%;
					}
					
					.left-abs{
						height: 25rpx;
						width: 25rpx;
						background-color: #E03833;
						border-radius: 999rpx;
						position: absolute;
						left: 110rpx;
						top: -10rpx;
					}
				}
				.right{
					margin-left: 40rpx;
					width: 75%;
					
					.a{
						display: flex;
						justify-content: space-between;
						height: 60rpx;
						line-height: 60rpx;
						
						view:nth-child(1){
							font-size: 32rpx;
							font-weight: bold;
							color: #000000;
						}
						view:nth-child(2){
							font-size: 24rpx;
							color: #A5A5A5;
						}
						text{
							margin-left: 20rpx;
						}
					}
					.b{
						font-size: 24rpx;
						color: #A5A5A5;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						height: 60rpx;
						line-height: 60rpx;
					}
				}
			}
		}
	}
</style>
