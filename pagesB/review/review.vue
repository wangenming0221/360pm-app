<template>
    <view class="review">
        <our-loading isFullScreen :active="allFinished" text="loading..." />
        <uni-search-bar 
            placeholder="请搜索用户姓名或电话"
            v-model="searchValue"
            cancelText="搜索" 
            @confirm="handleSearch"
            @cancel="handleSearch"
            />
        <view class="is-select" v-if="JSON.stringify(selectObj) != '{}'">
            <view class="title">已选人员</view>
            <view class="line"></view>
            <view class="box">
                <view class="item">
                    {{ selectObj.nickName }}
                    <view class="close">
                        <uni-icons type="clear" size="24" @click="remove(selectObj)"></uni-icons>    
                    </view>
                </view>
            </view>
        </view>
        <view class="gap" style="height:40rpx;"></view>
        <radio-group @change="groupChange">
        <!-- 常用人员 -->
        <view class="usage">
            <view class="title">常用人员</view>
            <view>
                <view class="usage-item" v-for="(item, index) of usageList" :key="index">
                    <image class="header" :src="header_image" />
                   <view class="name">
                        {{ item.nickName }}
                    </view>
                    <view class="phone">
                        {{ item.phonenumber }}
                    </view>
                    <view class="checkbox">
                        <radio :checked="item.checked" :value="item.userId" />
                    </view>
               </view>
            </view>
        </view>   
        <view class="gap" style="height:40rpx;"></view>
         <!-- 全部人员 -->
        <view class="all">
            <view class="title">全部人员</view>
            <view class="mainbody-c-box">
               <view 
                    class="item"
                    v-for="(item,index) of list"
                    :key="index">
                    <image class="header" :src="header_image" />
                    <view class="name">
                        {{ item.nickName }}
                    </view>
                    <view class="phone">
                        {{ item.phonenumber }}
                   </view>
                    <view class="radio">
                        <radio :checked="item.checked" :value="item.userId" />
                    </view>
                </view>
            </view>
            <v-no-data v-show="list.length === 0"></v-no-data>
            <uni-load-more v-show="total > 15" :status="status" />
        </view> 
        </radio-group>
         <!-- 悬浮按钮 -->
        <uni-fab 
                ref="fab" 
                :content="content" 
                :horizontal="horizontal" 
                :vertical="vertical"
                :direction="direction" 
                @trigger="trigger"
            />
    </view>
</template>

<script setup>
    import { ref, onUnmounted, watch, computed } from 'vue';
    import { mainDataStore } from '@/store/pinia';
    import { storeToRefs } from 'pinia'
    import { onLoad, onReachBottom } from '@dcloudio/uni-app';
    import { get } from '@/api/request.js';
    import vNoData from '@/components/NoData';
    
    const store = mainDataStore();
    const { reviewObj } = storeToRefs(store);
    const header_image = `${store.baseUrl}/syty360pm/appPicture/index/personList.png`;
      // 悬浮按钮选项
    const content = [
        {
            iconPath:`${store.baseUrl}/syty360pm/appPicture/index/gosure.png`,
            selectedIconPath:`${store.baseUrl}/syty360pm/appPicture/index/gosure.png`,
            text: '确认选择',
            active: false
        },
        {
            iconPath: `${store.baseUrl}/syty360pm/appPicture/index/gotop.png`,
            selectedIconPath: `${store.baseUrl}/syty360pm/appPicture/index/gotop.png`,
            text: '回到顶部',
            active: false
        }
	];
    const horizontal = 'left'; //水平对齐方式。left:左对齐，right：右对齐
    const vertical = 'bottom'; //垂直对齐方式。bottom:下对齐，top：上对齐
    const direction = 'horizontal'; //展开菜单显示方式。horizontal:水平显示，vertical：垂直显示
   
    const selectObj = computed({
        get() {
			return reviewObj.value
		},
		set(value) {}
    });

    const searchValue = ref('');
    const allFinished = ref(true);

    const usageList = ref([]);

    const timer = ref(null);	
    const total = ref(0);
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(20);

    const trigger = (e) => {
        switch(e.index) {
            case 0:
                uni.navigateBack({
                    delta:1
                });
            break;
            case 1:
                uni.pageScrollTo({
                    scrollTop:0,
                    duration:300
                });
            break;    
        }
	};
    //获取人员列表
    const getList = async() => {
		const params = {
			data:{
				current:page.value,
				size:size.value,
                nickName:searchValue.value
			},
			url:'/360-manage-system/system/user/list'
		};
		await get(params)
			.then(res => {
				if(res.data){
                    total.value = res.data.total;
                    if(res.data.records.length > 0) {
                        const arr = [];
                        res.data.records.map(item => {
                            arr.push(
                                Object.assign(item, {checked:false})
                            )
                        });
                        list.value = [...list.value,...arr];
                        let arr1 = usageList.value;
                        let arr2 = list.value;
                        let add = arr2.filter(item => !arr1.some(ele=>ele.userId==item.userId));
                        list.value = add;
                    }
				};
			})
			.finally(() => {
                status.value = 'more';
				allFinished.value = false
			});
	};
     //获取常用人员
    const getUsage = async() => {
        	const params = {
			data:{
                current:1,
			    size:2
            },
			url:'/360-manage-core-operatemanage/SysUserCommon/get/selectAll',
		};
		await get(params)
			.then(res => {
				if(res.data){
                    if(res.data.records.length > 0) {
                        const arr = [];
                        res.data.records.map(item => {
                            arr.push(
                                Object.assign(item, {checked:false})
                            )
                        });
                        usageList.value = arr;
                    }
				};
			});
    };
    const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
            getList();
		},500);
	};
    const handleBottom = () => {
		if(status.value == 'loading'){
			return false;
		};
		if(page.value >= (total.value/size.value)){
			status.value = 'noMore';
			return false;
		};
	   nextPage();
	};
      //移除已选
    const remove = (obj) => {
        const index = list.value.findIndex(item => {
            return item.userId === obj.userId;
        });
        const index2 = usageList.value.findIndex(item => {
            return item.userId === obj.userId;
        });
        if(index > -1) {
            list.value[index].checked = false;
            store.SET_REVIEW({})
        }
        if(index2 > -1) {
            usageList.value[index2].checked = false;
            store.SET_REVIEW({})
        }
    };
    // 常用人员复选框
    const groupChange = (element) => {
        const arr = [...list.value, ...usageList.value];
        let obj = {};
        arr.map(item => {
            if(item.userId == element.detail.value) {
               item.checked = true
               obj = Object.assign({}, item);
            }
        });
        store.SET_REVIEW(obj)
    };
    //搜索
    const handleSearch = () => {
        total.value = 0;
        page.value = 1;
        status.value = 'more';
        list.value = [];
        getList();
    };

    onReachBottom(() => {
        handleBottom();
	});
    onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});
    onLoad(() => {
		reviewObj.value = {};
        getUsage();
        getList();
      
    });
  
</script>

<style lang="scss">
    .review{

         .is-select{
            width: 92%;
            margin: 0 auto;

            .box{
                display: flex;
                flex-wrap: wrap;
                padding-top: 20rpx;

                .item{
                    margin-left: 20rpx;
                    padding: 20rpx;
                    background-color: #F4F6F9;
                    box-sizing: border-box;
                    border: 1px solid #2C7AF2;
                    color: #49496A;
                    font-size: 32rpx;
                    border-radius: 8rpx;
                    margin-bottom: 20rpx;
                    position: relative;
                    
                    .close{
                        position: absolute;
                        right: -30rpx;
                        top: -30rpx;
                    }
                }
            }
        }
        .usage{
            width: 92%;
            margin: 0 auto;

            .usage-item{
                 height: 120rpx;
                display: flex;
                align-items: center;
                border-top: 1px solid #E3E3E3;
                color: #49496A;
                font-size: 32rpx;

                .header{
                    height: 65rpx;
                    width: 65rpx;
                    margin-right: 40rpx;
                }
                .name{
                    width: 40%;
                }
                .checkbox{
                    margin-left: auto;
                }
            }
        }
        .all{
            width: 92%;
            margin: 0 auto;

            .mainbody-c-box{    

                .item{
                    height: 120rpx;
                    display: flex;
                    align-items: center;
                    border-top: 1px solid #E3E3E3;
                    color: #49496A;
                    font-size: 32rpx;

                    .header{
                        height: 65rpx;
                        width: 65rpx;
                        margin-right: 40rpx;
                    }
                    .name{
                        width: 40%;
                    }
                    .radio{
                        margin-left: auto;
                    }
                }
            }
        }
    }
</style>