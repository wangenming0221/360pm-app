<template>
    <view class="message-detail">
        <view class="title">{{ messages.message_title }}</view>
        <view class="box">
            <view class="item">
                <uni-icons type="wallet" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>任务名称</view>
                    <view>:</view>
                </view>
                <view>{{ messages.task_name }}</view>
            </view>
            <view class="item">
                <uni-icons type="wallet" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>任务编码</view>
                    <view>:</view>
                </view>
                <view>{{ messages.task_code }}</view>
            </view>
            <view class="item">
                <uni-icons type="wallet" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>项目名称</view>
                    <view>:</view>
                </view>
                <view>{{ messages.project_name }}</view>
            </view>
            <view class="item" v-if="messages.task_firing_time">
                <uni-icons type="notification" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>启动时间</view>
                    <view>:</view>
                </view>
                <view>{{ messages.task_firing_time }}</view>
            </view>
            <view class="item" v-if="messages.task_finish_time">
                <uni-icons type="checkbox" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>完成时间</view>
                    <view>:</view>
                </view>
                <view>{{ messages.task_finish_time }}</view>
            </view>
            <view class="item">
                <uni-icons type="person" :color="iconColor"></uni-icons>
                <view class="body">
                    <view>执行人</view>
                    <view>:</view>
                </view>
                <view>{{ messages.nick_name }}</view>
            </view>
        </view> 

        <view class="button" @click="goFinished">跳转任务</view>   
		
		<view class="button backButton" @click="goBack">返回</view>  
    </view>
</template>

<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import { post, get } from '@/api/request.js';

    const messages = ref({});
    const iconColor = '#768893';
	const id_fkid = ref('');
    //已读
	const already = async(message_pkid) => {
		const arr = [];
		arr.push({
			message_pkid,
			message_status:2
		});
		const params = {
			data:arr,
			url:'/360-manage-core-operatemanage/MessageInfo/modify/updates'
		};
		await post(params);
	};
    //详情
    const getDetail = async(pkid) => {
        const params = {
			data:{
                pkid
            },
			url:'/360-manage-core-operatemanage/MessageInfo/get/selectOne'
		};
		await get(params)
			.then(res => {
				if(res.data){
                    messages.value = Object.assign({}, res.data);
				};
			});
    };

    const goFinished = () => {
        uni.navigateTo({
            url:`/pagesC/commissionLoad/commissionLoad?pkid=${id_fkid.value}&token=${uni.getStorageSync('token')}`
        });
    };
	
	const goBack = () => {
		uni.switchTab({
		    url:`/pages/messages/messages`
		});
	};
	
    onLoad((options) => {
        if(JSON.parse(options.query).message_status == '1') {
            already(JSON.parse(options.query).message_pkid);
        }
		id_fkid.value = JSON.parse(options.query).id_fkid;
        getDetail(JSON.parse(options.query).message_pkid);
    });
</script>

<style lang="scss">
    .message-detail{
        width: 82%;
        margin: 0 auto;

        .title{
            padding-top: 40rpx;
            font-weight: bold;
            font-size: 42rpx;
        }

        .box{
            margin-top: 100rpx;
            font-size: 32rpx;

            .item{
                margin-top: 20rpx;
                display: flex;

                .body {
                    color:#768893;
                    margin-left: 15rpx;
                    width: 23%;
                    display: flex;
                    justify-content: space-between;
                    margin-right: 30rpx;
                }

                view:nth-child(3) {
                    width: 60%;
                }
            }
        }

        .button{
            width: 60%;
            height: 80rpx;
            line-height: 80rpx;
            background-color: #333;
            border-radius: 999rpx;
            margin: 0 auto;
            text-align: center;
            color: #FFFFFF;
            font-size: 36rpx;
            background:linear-gradient(to right,#5884FF,#5897FF,#58B8FF);
            margin-top: 200rpx;
        }
		.backButton{
			background:linear-gradient(to right,#FFFFFF,#FFFFFF);
			border: 1px solid rgba(0,0,0,0.4);
			color: #273052;
			margin-top: 20rpx;
		}
    }
</style>