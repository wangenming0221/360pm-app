<template>
  <view class="rank-list">
      <our-loading isFullScreen :active="!rank" text="loading..." />
      <view class="head-back"></view>
      <view class="menus">
          <view 
            class="item-box"
            @click="change(index, item)" 
            v-for="(item, index) of menuList" 
            :key="index">
            <view :class="active === index ? 'item':''" >
                {{ item.title }}
            </view>
          </view>
      </view>
      <view class="table-box">
        <view class="table-header">
            <view class="header-item" v-for="(item, index) of headerList" :key="index">{{ item }}</view>
        </view>
        <scroll-view 
            scroll-y="true" 
            class="scroll-y">
               <view
				@click="goDetail(item)"
			   class="scroll-item" 
			   v-for="(item, index) of list" 
			   :key="index">
                   <view class="item-child" v-if="index < 3">
                       <image 
                        :src="index === 0 
                        ? rankA 
                        : (index === 1 
                        ? rankB 
                        : rankC)" alt="" />
                   </view>
                   <view v-else class="item-child">
                       {{ index + 1 }}
                    </view>
                   <view class="item-child">{{ item.project_name }}</view>
                   <view class="item-child">{{ item.dept_name }}</view>
                   <view class="item-child">{{ item.nick_name }}</view>
				   <view class="item-child">{{ active === 0 ?  `${item.rate}` : item.num }}</view>
               </view>
                <v-no-data v-show="noShow"></v-no-data>
                <uni-load-more v-show="total > 15" :status="status" />
        </scroll-view>
      </view>  
  </view>
</template>

<script setup>
    import { ref, watch, onUnmounted } from 'vue';
	import { onReachBottom } from '@dcloudio/uni-app';
    import { mainDataStore } from '@/store/pinia';
    import { get } from '@/api/request.js';
    import vNoData from '@/components/NoData';

    const store = mainDataStore();
    const rank = ref(false);
    const active = ref(0);
    const r_taio_state = ref('3');
    const timer = ref(null);
    const timer2 = ref(null);
	const noShow = ref(false);
    const total = ref(0);
    const page = ref(1);
    const size = ref(15);
    const list = ref([]);
    const status = ref('more');
       
    const rankA = `${store.baseUrl}/syty360pm/appPicture/index/rank_1.png`;
    const rankB = `${store.baseUrl}/syty360pm/appPicture/index/rank_2.png`;
    const rankC = `${store.baseUrl}/syty360pm/appPicture/index/rank_3.png`;

    const menuList = [
        {
            title:'按时完成排行',
            id:'3'
        },
        {
            title:'延期排行',
            id:'4'
        },
        {
            title:'未完成排行',
            id:'1,2,4,5'
        },
    ];
    const headerList = [
		'排名',
		'项目名称',
		'分公司',
		'负责人',
		'数量'
		// active.value === 0 
		// ? '按时完成率'
		// : (active.value === 1 
		// ? '延期数' : '未完成数')
	];
    const change = (index, e) => {
        if(active.value === index) {
            return false
        } else {
            noShow.value = false
            clearTimeout(timer2.value);
            timer2.value = null
            list.value = [];
            active.value = index;
            r_taio_state.value = e.id

            timer2.value = setTimeout(() => {
                if(list.value.length === 0){
                    noShow.value = true
                }
            },1000);
        }
    };
 // 排行榜
		const getList = async() => {
                rank.value = false;
				const params = {
					data:{
						taio_state:r_taio_state.value,
                        current:page.value,
						size:size.value,
					},
					url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectRankingTabulation'
				};
				await get(params)
					.then(res => {
						if(res.data){
							if(res.data){
                                total.value = res.data.total
                                if(res.data.records.length > 0){
                                    list.value = [...list.value,...res.data.records];
                                } else {
                                    noShow.value = true
                                }
							};
						};
					})
					.finally(() => {
						rank.value = true;
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
	//前往详情页
	const goDetail = (options) => {
		uni.navigateTo({
			url:`/pagesA/rankDetail/rankDetail?type=${menuList[active.value].title}&user_fkid=${options.user_fkid}&taio_state=${r_taio_state.value}`
		});
	};

    onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null;
	});
    
    watch(r_taio_state, (val) => {
		getList();
	},{deep:true,immediate:true});


</script>

<style lang="scss">
    .rank-list{

        .head-back{
            height: 250rpx;
            width: 100%;
            background: url('https://syty360pm.oss-cn-zhangjiakou.aliyuncs.com/syty360pm/appPicture/index/rank-back.png') no-repeat;
			background-size:100% 100%;
        }

        .menus{
            background-color: #4A69FF;
            display: flex;
            justify-content: space-around;
            height: 100rpx;
            line-height: 100rpx;
            color: #FFFFFF;
            font-size: 32rpx;
            

            .item-box{
                position: relative;
                width: 33.33%;
                text-align: center;
            }
            .item{
                font-weight: bold;
            }
            .item:after{
                content: '';
                width:0;
                height:0;
                left:120rpx;
                top:85rpx;
                position: absolute;
                border-right:10rpx solid transparent;
                border-left:10rpx solid transparent;
                border-bottom:20rpx solid #FFFFFF;
            }
        }

        .table-box{
            width: 95%;
            margin: 0 auto;

            .table-header{
                display: flex;
                font-size: 32rpx;
                color: #2D3558;
                height: 100rpx;
                line-height: 100rpx;
                .header-item:nth-child(1){
                    width: 15%;
                }
                .header-item:nth-child(2){
                    width: 25%;
                }
                .header-item{
                    width: 20%;
                }
            }

            .scroll-y{
                height: 57vh;
                padding-bottom: 40rpx;

                .scroll-item{
                    height: 100rpx;
                    line-height: 100rpx;
                    display: flex;
                    border-top: 1px solid #DCDCDC;
                    font-size: 32rpx;
                    color: #444444;
                    font-weight: bold;

                    .item-child:nth-child(1){
                        width: 15%;
                        display: flex;
                        align-items: center;

                         image{
                            height: 50rpx;
                            width: 50rpx;
                        }
                    }
                    .item-child:nth-child(2){
                        width: 25%;
                    }
                    .item-child{    
                        width: 20%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
					.item-child:nth-child(5){
					    color: #f5c09e;
					}
                }
            }
        }
    }
</style>