<template>
	<view class="mine">
		<view class="header">
			<view class="head-left">
				<view class="name">{{ userInfo.user.userName }}</view>
				<view class="phone">{{ userInfo.user.phonenumber }}</view>
				<view class="post">
					<text 
						v-for="(item, index) of userInfo.user.roles" 
						:key="index">
						{{ item.roleName }}
					</text>
				</view>
			</view>
			<view>
				<image :src="src" class="avatar"></image>
			</view>
		</view>	
		<view class="actions">
			<view v-for="(item,index) of actions" :key="index" class="action-item">
				<button
					v-if="index === 0" 
					class='share_button' 
					id="shareBtn" 
					open-type="share" 
					hover-class="none">
				</button>
				<view class="actions-icon">
					<image :src="item.icon" alt=""></image>
				</view>
				<view class="actions-title">
					{{ item.title }}
				</view>
			</view>
		</view>
		<view class="menus">
			<view v-for="(item,index) of menus" :key="index" class="menus-item" @click="menuAction(index)">
				<view class="menus-icon">
					<image :src="item.icon"></image>
				</view>
				<view class="menus-title">{{ item.title }}</view>
				<view class="menus-info">{{ item.info }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from 'vue';
	import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
	import { onShareAppMessage } from '@dcloudio/uni-app';


	const store = mainDataStore();
	const { userInfo, taskList, rolesInfo } = storeToRefs(store);
	const src = 'https://cdn.uviewui.com/uview/album/1.jpg';

	const actions = [
		{
			title:'分享好友',
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/menu1.png`
		},
		{
			title:'学习中心',
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/menu2.png`
		},
		{
			title:'意见反馈',
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/menu3.png`
		},
	];

	const menus = [
		{
			title:'系统账号',
			info:userInfo.value.user.userName,
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/logo1.png`
		},
		{
			title:'所属组织',
			info:rolesInfo.value.deptDataName,
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/logo2.png`
		},
		{
			title:'账号状态',
			info:'启用状态',
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/logo3.png`
		},
		{
			title:'所属组织',
			info:rolesInfo.value.deptDataName,
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/logo2.png`
		},	
		{
			title:'退出登录',
			info:'',
			icon:`${store.baseUrl}/syty360pm/appPicture/mine/logout.png`
		},	
	];

	const menuAction = (index) => {
		switch(index) {
			case 4:
				uni.removeStorageSync('token');
				uni.removeStorageSync('user_fkid');
				uni.removeStorageSync('username');
				uni.removeStorageSync('password');
				taskList.value = [];
				uni.reLaunch({
					url: '/pages/login/login'
				});
			break;	
		}
	};
	
	// 分享
	onShareAppMessage(() => {
		return{
			title:'好友分享',
			path:'pages/index/index',
		}
	});

</script>

<style lang="scss">
	.mine{
		.header{
			padding: 160rpx 40rpx 0 40rpx;
			height: auto;
			background-color: #9ACAFC;
			display: flex;
			justify-content: space-between;
			background: url('https://syty360pm.oss-cn-zhangjiakou.aliyuncs.com/syty360pm/appPicture/mine/background.png') no-repeat;
			background-size:100% 100%;
			
			.head-left{
				view{
					margin-top: 15rpx;
				}
				
				.name{
					font-size: 33rpx;
					font-weight: bold;
				}
				.phone{
					font-size: 31rpx;
					font-weight: bold;
				}
				.post{
					font-size: 28rpx;
					
					text{
						margin-right: 15rpx;
						color: #25313F;
					}
				}
			}

			.avatar{
				width: 120rpx;
				height: 120rpx;
				border-radius: 999rpx;
				animation:scale ease 1.3s 1;
			}
			@keyframes scale {
				// 弹力效果动画
				0%,10%,100%,50%,70%{-webkit-transform:scale(1);transform:scale(1)}
				30%{-webkit-transform:scale(.9);transform:scale(.9)}
				40%{-webkit-transform:scale(1.3);transform:scale(1.3)}
				60%{-webkit-transform:scale(1.15);transform:scale(1.15)}
			}
		}
		.actions{
			width: 84%;
			height: 260rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.action-item{
				width: 150rpx;
				position: relative;
				
				.actions-icon{
					width: 100rpx;
					height: 100rpx;
					border-radius: 999rpx;
					margin: 0 auto;

					image{
						width: 100%;
						height: 100%;
					}
				}
				
				.actions-title{
					text-align: center;
					font-size: 26rpx;
					font-weight: bold;
					margin-top: 10rpx;
				}

				.share_button{
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					opacity: 0;
				}
			}
		}
		.menus{
			width: 90%;
			margin: 0 auto;
			
			.menus-item{
				height: 120rpx;
				display: flex;
				align-items: center;
				font-size: 30rpx;
				padding: 0 20rpx 0 20rpx;
				border-top: 1px solid #E7E9EC;
				
				.menus-icon{
					width: 40rpx;
					height: 40rpx;

					image{
						width: 100%;
						height: 100%;
					}
				}
				
				.menus-title{
					margin-left: 40rpx;
					color: #49496A;
				}
				
				.menus-info{
					margin-left: auto;
					color: #A0A0B5;
					max-width: 60%;
					text-align: right;
					overflow: hidden;
					text-overflow: ellipsis;
					flex-wrap: nowrap;
				}
			}
		}
	}
</style>
