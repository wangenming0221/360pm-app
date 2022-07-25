<template>
    <view class="desk-table">
		<swiper class="swiper-box">
            <swiper-item 
                class="swiper-item" 
                v-for="(item ,index) in list" 
                :key="index">
                <image :src="item.content"  />
            </swiper-item>
		</swiper>
        <view class="menus-box">
            <view class="item" v-for="(item, index) of menuList" :key="index" @click="goDetail(item.type)">
                <image :src="item.icon"></image>
                <view class="info">
                    <view class="title">{{ item.title }}</view>
                    <view class="data"><text>{{ item.data }}</text><text>个</text></view>
                </view>
            </view>
        </view>
        <!-- 悬浮按钮 -->
        <view class="fab-box">
            <uni-fab 
                ref="fab" 
                :content="content" 
                :horizontal="horizontal" 
                :vertical="vertical"
                :direction="direction" 
                @trigger="trigger"
            />
        </view>
    </view>
</template>

<script setup>
    import { ref } from 'vue';
    import { mainDataStore } from '@/store/pinia';
	import { storeToRefs } from 'pinia';
    import { get } from '@/api/request.js';
    import { onLoad, onShow } from '@dcloudio/uni-app';

    const store = mainDataStore();
	const { checkList, reviewlist } = storeToRefs(store);
    const list = [
        {
            content:`${store.baseUrl}/syty360pm/appPicture/index/desk-banner.png`
        }
    ];

    const menuList = ref([
        {
            title:'我执行的',
            data:0,
            icon:`${store.baseUrl}/syty360pm/appPicture/index/desk-menu1.png`,
            type:'1'
        },
        {
            title:'我审核的',
            data:0,
            icon:`${store.baseUrl}/syty360pm/appPicture/index/desk-menu2.png`,
            type:'2'
        },
        {
            title:'我分派的',
            data:0,
            icon:`${store.baseUrl}/syty360pm/appPicture/index/desk-menu1.png`,
            type:'3'
        },
        {
            title:'周期任务管理',
            data:0,
            icon:`${store.baseUrl}/syty360pm/appPicture/index/desk-menu3.png`,
            type:'4'
        }
    ]);
    // 悬浮按钮选项
    const content = [
        {
            iconPath:`${store.baseUrl}/syty360pm/appPicture/index/desk-yc.png`,
            selectedIconPath:`${store.baseUrl}/syty360pm/appPicture/index/desk-yc.png`,
            text: '一次任务',
            active: false
        },
        {
            iconPath: `${store.baseUrl}/syty360pm/appPicture/index/desk-zq.png`,
            selectedIconPath: `${store.baseUrl}/syty360pm/appPicture/index/desk-zq.png`,
            text: '周期任务',
            active: false
        }
	];
    const horizontal = 'left'; //水平对齐方式。left:左对齐，right：右对齐
    const vertical = 'bottom'; //垂直对齐方式。bottom:下对齐，top：上对齐
    const direction = 'horizontal'; //展开菜单显示方式。horizontal:水平显示，vertical：垂直显示
 
    const trigger = (e) => {
        uni.navigateTo({
            url:`/pagesB/addTask/addTask?type=${e.index}`
        });
	};

    const goDetail = (type) => {
        uni.navigateTo({
            url:`/pagesB/tableWork/tableWork?type=${type}`
        });
    };

    const getInfo = async() => {
        const params = {
			data:{
				user_fkid:uni.getStorageSync('user_fkid')
			},
			url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectMyWorkbench'
		};
		await get(params)
			.then(res => {
				if(res.data){
                    const { myExecute, myExamine, myAssignment, cycle } = res.data;
                    menuList.value[0].data = myExecute;
                    menuList.value[1].data = myExamine;
                    menuList.value[2].data = myAssignment;
                    menuList.value[3].data = cycle;
				}
			});
    };

    onLoad(() => {
        getInfo();
    });
	
	onShow(() => {
		checkList.value = [];
		reviewlist.value = [];
	});

</script>

<style lang="scss">
    page{
        background-color: #F2F6F8;
    }
    .desk-table{

        .swiper-box{
            width: 100%;
			height: 260rpx;

            .swiper-item{
                /* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 260rpx;
				width: 100%;
				
				image{
					width: 100%;
					height: 100%;
				}
            }
        }

        .menus-box{
            display: flex;
            flex-wrap: wrap;

            .item{
                width:50%;
                height: 230rpx;
                box-sizing:border-box;
				background-color: #fff;
                display: flex;
                align-items: center;
                padding-left: 50rpx;


                image{
                    width: 120rpx;
                    height: 120rpx;
                }
                .info{
                    margin-left: 30rpx;
                    font-size: 28rpx;
                    text-align: center;
                    
                    .title{
                        margin-bottom: 20rpx;
                        color: #49496A;
                    }
                    .data{
                        font-weight: bold;
                        color: #ACB3C7;

                        text:nth-child(2) {
                            margin-left: 8rpx;
                            font-size: 24rpx;
                        }
                    }
                }
            }   
            .item:nth-child(1){
                border-right:1rpx solid #E3E3E3;    
                border-bottom:1rpx solid #E3E3E3;    
            }
            .item:nth-child(2){
                border-bottom:1rpx solid #E3E3E3;    
            }
            .item:nth-child(3){
                 border-right:1rpx solid #E3E3E3;    
            }
        }

        .fab-box{
            margin: 0 auto;
        }
    }
</style>