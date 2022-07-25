<template>
    <view class="login">
        <view class="top">
            <image :src="header" class="header"></image>
        </view>
        <uni-transition timingFunction="ease-in-out" mode-class="slide-left" :show="show">
            <view class="form">
                <view class="item">
                    <uni-easyinput
                        prefixIcon="person-filled"
                        :trim="true"
                        :inputBorder="false" 
                        v-model="model.username" 
                        placeholder="请输入用户名">
                    </uni-easyinput>
                </view>
                <view class="item">
                    <uni-easyinput
                        prefixIcon="locked-filled"
                        type='password'
                        :trim="true"
                        :inputBorder="false" 
                        v-model="model.password" 
                        placeholder="请输入密码">
                    </uni-easyinput>
                </view>
            </view>
       </uni-transition>
       <uni-transition timingFunction="ease-in-out" mode-class="slide-bottom" :show="show">
            <button
                :loading="loading" 
                type="default" 
                class="uni_button" 
                @click="login">
                登录
            </button>
       </uni-transition>
    </view>
</template>

<script setup>
    import { reactive, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
    import { mainDataStore } from '@/store/pinia';
    import { post } from '@/api/request.js';

    const store = mainDataStore();

    const show = ref(true);
    const loading = ref(false);

    const header = `${store.baseUrl}/syty360pm/appPicture/mine/login_header.png`;

    const model = reactive({
        username:'', //admin ceshi01
        password:'' //st2018 123456
    });

    const login = async() => {
        if(model.username == '') {
            uni.showToast({
				title:'请输入用户名',
				icon:'none'
			});
            return
        }
        if(model.password == '') {
             uni.showToast({
				title:'请输入密码',
				icon:'none'
			});
            return
        }
        return await new Promise((resolve, reject) => {
			loading.value = true;
            const params = {
                data:{
                    username:model.username,
                    password:model.password
                },
                url:'/360-manage-system/login'
            }
            post(params)
                .then((res) => {
                    if(res.data) {
                        uni.setStorageSync('token',res.data.access_token);
						uni.setStorageSync('username',model.username);
						uni.setStorageSync('password',model.password);
                        store.getUserInfo('wc');
                    } else {
                        reject();
                         uni.showToast({
                            title:res.msg,
                            icon:'none'
                        });
                        loading.value = false;
                    }
                });
        });
    };
	
	onLoad(() => {
		//自动登录
		if(uni.getStorageSync('username')) {
			model.username = uni.getStorageSync('username');
		};
		if(uni.getStorageSync('password')) {
			model.password = uni.getStorageSync('password');
		};
		if(model.username && model.password) {
			login();
		};
	});

</script>

<style lang="scss">
    .login{
        
        .top{
            height: 500rpx;
		    width: 100%;
            background: url('https://syty360pm.oss-cn-zhangjiakou.aliyuncs.com/syty360pm/appPicture/mine/login_back.png') no-repeat;
		    background-size:100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .header{
                height: 140rpx;
                width: 140rpx;
                filter: drop-shadow(10rpx 10rpx 10rpx rgba(0,0,0,0.3));
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

        .form{
            width: 80%;
            margin: 0 auto;

            .item{
                border-bottom: 1px solid #D8DCE0;
                margin-top: 40rpx;
            }
        }

        .uni_button{
            height: 100rpx;
            line-height: 100rpx;
            width: 80%;
            margin: 0 auto;
            margin-top: 40rpx;
            text-align: center;
            font-size: 36rpx;
            color: #FFFFFF;
            border-radius: 999rpx;
            box-shadow: 0 3rpx 3rpx rgb(31 110 207 / 20%);
            background: #1f6ecf;
            margin-top: 200rpx;
        }
    }
</style>>