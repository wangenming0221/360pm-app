<template>
	<our-loading isFullScreen :active="allFinished" text="loading..." />
	<view class="commissionLoad">
		<view class="header">
			<view class="header-top">
				<view class="a">
					{{ messagesInfo.taio_task_name }}
				</view>
				<view class="b"> 
					<view class="b-item">
						<view 
							:style='{ 
								backgroundColor
								:messagesInfo.taio_state == "1"
								? "#409EFF"
								: messagesInfo.taio_state == "2"
								? "#67C23A"
								: messagesInfo.taio_state == "3"
								? "#E6A23C"
								: messagesInfo.taio_state == "4"
								? "#F56C6C"
								: messagesInfo.taio_state == "5"
								? "#909399"
								: messagesInfo.taio_state == "6"
								? "#C0C4CC"
								: "#F2F6FC"}'>
						</view>
						<view>
							{{ messagesInfo.taio_state == '1' ? '未开始'
							:(messagesInfo.taio_state == '2' ? '进行中'
							:(messagesInfo.taio_state == '3' ? '已完成'
							:(messagesInfo.taio_state == '4' ? '已超期'
							:(messagesInfo.taio_state == '5' ? '已预警'
							:(messagesInfo.taio_state == '6' ? '已取消' : '已提交'))))) }}
						</view>
					</view>
				</view>
			</view>
			<view class="header-times" >
				<view>
					<view class="time">
						{{ 
							messagesInfo.taio_begin_time ?
							messagesInfo.taio_begin_time.substring(0,10)
							:''
						}}
					</view>
					<view>计划开始时间</view>
				</view>
				<view class="center">
					时间至
				</view>
				<view>
					<view class="time">
						{{ 
							messagesInfo.taio_end_time ?
							messagesInfo.taio_end_time.substring(0,10)
							:''
						}}
					</view>
					<view>计划结束时间</view>
				</view>
			</view>


			<view class="header-type">
				任务类型：<text>
					{{ 
						messagesInfo.ctio_form == '0' 
						? '通用任务' 
						: (messagesInfo.ctio_form == '1' 
						? '临时任务' 
						: (messagesInfo.ctio_form == '2' 
						? '协同管理临时任务' : '公司级任务'))
					}}
				</text>
			</view>
		</view>
		<vHeadLine 
			title="任务基本信息" 
			paddingLeft="20rpx"
			width="10rpx">
		</vHeadLine>
		<v-box :messagesInfo="messagesInfo"></v-box>
		<view class="commissionLoad_foot"></view>
		<v-buttons :messagesInfo="messagesInfo" :user_fkid="user_fkid"></v-buttons>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { get,post } from '@/api/request.js';
	import { mainDataStore } from '@/store/pinia';
	import vHeadLine from '@/components/HeadLine';
	import vBox from './components/Box';
	import vButtons from './components/Buttons';
	import ourLoading from '@/components/our-loading/our-loading';
	
	const store = mainDataStore();
	const allFinished = ref(true);
	const pkid = ref('');
	const user_fkid = ref('');
	const messagesInfo = ref({});

	const getInfo = async() => {
		
		if(!uni.getStorageSync('token')) {
			uni.showToast({
				title:'未获取到token',
				icon:'error'
			});
			return
		}
		
		await store.getUserInfo('open');
		
		const params = {
			data:{
				pkid:pkid.value,
			},
			url: '/360-manage-core-operatemanage/TaskOperation/get/selectOne'
		};
		get(params)
			.then(res => {
				if(res.data){
					messagesInfo.value = res.data;
				} else {
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			})
			.finally(()=>{
                allFinished.value = false;
			});
	};
	
	onLoad((options) => {
		// if(options.pkid&& options.token){
		// 	pkid.value = options.pkid;
		// }
		// if(options.pkid&&  options.token && uni.getStorageSync('username') && uni.getStorageSync('password')) {
		// 	const params = {
		// 	    data:{
		// 	        username:uni.getStorageSync('username'),
		// 	        password:uni.getStorageSync('password')
		// 	    },
		// 	    url:'/360-manage-system/login'
		// 	}
		// 	post(params)
		// 	    .then((res) => {
		// 	        if(res.data) {
		// 	            uni.setStorageSync('token',res.data.access_token);
		// 				uni.setStorageSync('username',uni.getStorageSync('username'));
		// 				uni.setStorageSync('password',uni.getStorageSync('password'));
		// 	            store.getUserInfo('wc');
		// 	        } else {
		// 	            reject();
		// 	             uni.showToast({
		// 	                title:res.msg,
		// 	                icon:'none'
		// 	            });
		// 	        }
		// 	    });
		// }else {
		// 	uni.setStorageSync('token', options.token);
		// 	getInfo();
		// }
		if(options.pkid && options.token) {
			uni.setStorageSync('token', options.token);
			pkid.value = options.pkid;
			getInfo();
		}
	});
</script>

<style lang="scss">
	page{
		background-color: #EFF4F6;
	}
	.commissionLoad{
			
		.header{
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 20rpx;
			
			.header-top{
				display: flex;
				justify-content: space-between;
				
				.a{
					font-size: 35rpx;
					color: #666666;
					font-weight: bold;
					max-width: 75%;
				}
				.b{
					display: flex;
					
					.b-item{
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: rgba(0,0,0,0.4);
						margin-right: 10rpx;
						
						view:nth-child(1){
							border-radius: 999rpx;
							height: 20rpx;
							width: 20rpx;
							margin-right: 10rpx;
						}
						
					}
				}
			}
			.header-bottom{
				border-bottom: 1px solid rgba(0,0,0,0.1);
				height: 140rpx;
				line-height: 140rpx;
				font-size: 29rpx;
				color: rgba(0,0,0,0.4);
			}
			
			.header-times{
				margin-top: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #666666;
				
				.center{
					height: 60rpx;
					width: 150rpx;
					border-radius: 999rpx;
					background-color: #EFF4F6;
					text-align: center;
					line-height: 60rpx;
				}
				.time{
					margin-bottom: 20rpx;
					color: #049EFF;
					
					span{
						margin-left: 20rpx;
					}
				}
			}
			
			.header-type{
				height: 140rpx;
				line-height: 140rpx;
				font-size: 29rpx;
				
				text{
					font-size: 30rpx;
					font-weight: bold;
				}
			}
		}
		.commissionLoad_foot{
			height: 200rpx;
			background-color: #FFFFFF;
		}
	}
</style>
