<template>
  <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
  <view class="main-body">
      <our-loading isFullScreen :active="allFinished" text="loading..." />
      <uni-segmented-control 
        :current="current" 
        :values="items" 
        :style-type="styleType"
		:active-color="activeColor" 
        @clickItem="onClickItem" />
      <view class="gap" style="height:40rpx;"></view>
      <uni-search-bar 
        :placeholder="placeholder"
        v-model="searchValue"
        cancelText="搜索" 
        @confirm="handleSearch"
        @cancel="handleSearch"
        />
        <view class="is-select">
            <view class="title">已选人员</view>
            <view class="line"></view>
            <view class="box">
                <view class="item" v-for="(item, index) of checkList" :key="index">
                    {{ item.nickName }}
                    <view class="close">
                        <uni-icons type="clear" size="24" @click="remove(item)"></uni-icons>    
                    </view>
                </view>
            </view>
        </view>
        <view class="gap" style="height:40rpx;"></view>
        <!-- 常用人员 -->
        <view class="usage" v-show="current === 0">
            <view class="title">常用人员</view>
            <view>
                    <view 
						@click="checkClick(item)"
						class="usage-item" 
						v-for="(item, index) of usageList" 
						:key="index">
                        <image class="header" :src="header_image" />
                        <view class="name">
                            {{ item.nickName }}
                        </view>
                        <view class="phone">
                            {{ item.phonenumber }}
                        </view>
                       <view class="checkbox">
                           <view 
							   v-if="checkList.indexOf(item) != -1"
							   class="checked">
						   </view>	
                        </view>
                    </view>
                
            </view>
        </view>   
        <view class="gap" style="height:40rpx;"></view>
        <!-- 全部人员 -->
        <view class="all"  v-show="current === 0">
            <view class="title">全部人员</view>
            <view class="mainbody-c-box">
                    <view 
						@click="checkClick(item)"
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
                       <view class="checkbox">
                          <view
							v-if="checkList.indexOf(item) != -1"
							class="checked">
						  </view>	
                        </view>
                    </view>
                </view>
            <v-no-data v-show="list.length === 0"></v-no-data>
            <uni-load-more v-show="total > 15" :status="status" />
        </view> 
         <!-- 全部角色 -->
        <view class="all"  v-show="current === 1">
            <view class="title">全部角色</view>
            <v-role-box @modelOpen="modelOpen" :list="roleList"></v-role-box>
            <v-no-data v-show="roleList.length === 0"></v-no-data>
            <uni-load-more v-show="roleTotal > 15" :status="roleStatus" />
        </view> 
        <!-- 悬浮按钮 -->
        <uni-fab 
                ref="fab" 
                :content="content" 
                :horizontal="horizontal" 
                :vertical="vertical"
                :direction="direction" 
                @trigger="trigger"
            />

        <v-my-model @scrollShow="scrollShow" ref="myModel"></v-my-model>
  </view>
</template>

<script setup>
    import { ref, onUnmounted, watch } from 'vue';
    import { mainDataStore } from '@/store/pinia';
    import { storeToRefs } from 'pinia';
    import { onLoad, onReachBottom } from '@dcloudio/uni-app';
    import { get } from '@/api/request.js';
    import vRoleBox from './components/RoleBox';
    import vMyModel from './components/model';
    import vNoData from '@/components/NoData';

    const store = mainDataStore();
    const { checkList } = storeToRefs(store);
    const header_image = `${store.baseUrl}/syty360pm/appPicture/index/personList.png`;
    const myModel = ref();
    const show = ref(false);

    const current = ref(0);
    const items = ['人员名称','角色名称'];
    const styleType = 'text';
    const activeColor = '#007aff';
    const searchValue = ref('');
    const placeholder = ref('');

    const usageList = ref([]);
	// 全局混入
    const allFinished = ref(true);
	const timer = ref(null);	

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

    const total = ref(0);
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(20);

    const roleTotal = ref(0); //角色总数
    const roleStatus = ref('more'); //角色状态
    const rolePage = ref(1); //角色页码
    const roleList = ref([]) //角色列表
	
    const onClickItem = (e) => {
		if (current.value !== e.currentIndex) {
			current.value = e.currentIndex;
		}
	};
    //移除已选
    const remove = (obj) => {
		const index = checkList.value.findIndex(item => item.userId === obj.userId);
		if(index < 0) return;
		checkList.value.splice(index, 1);
    };
    
	const checkClick = (options) => {
		store.SET_CHECK(options);
	};
    // 父组件回调
    const modelOpen = (options) => {
       myModel.value.handleShow(options)
    };
    const scrollShow = (e) => {
        show.value = e;
    };

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
    //获取角色列表
    const getRoleList = async() => {
		const params = {
			data:{
				current:rolePage.value,
				size:size.value,
				roleName:searchValue.value,
			},
			url:'/360-manage-system/system/role/list'
		};
		await get(params)
			.then(res => {
				if(res.data){
                    roleTotal.value = res.data.total;
                    if(res.data.records.length > 0) {
                        roleList.value = [...roleList.value,...res.data.records];
                    }
				};
			})
			.finally(() => {
                roleStatus.value = 'more';
			});
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
                            arr.push(item)
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
                            arr.push(item)
                        });
                        list.value = [...list.value,...arr];
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

    const nextRolePage = () => {
		rolePage.value ++;
		roleStatus.value = 'loading';
		timer.value = setTimeout(() => {
            getRoleList();
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

    const handleRoleBottom = () => {
        if(roleStatus.value == 'loading'){
			return false;
		};
		if(rolePage.value >= (roleTotal.value/size.value)){
			roleStatus.value = 'noMore';
			return false;
		};
	   nextRolePage();
    }

    //搜索
    const handleSearch = () => {
        switch(current.value) {
            case 0:
                total.value = 0;
                page.value = 1;
                status.value = 'more';
                list.value = [];
                getList();
            break;
            case 1:
                roleTotal.value = 0;
                rolePage.value = 1;
                roleStatus.value = 'more';
                roleList.value = [];
                getRoleList();
            break;    
        }
    };

    onReachBottom(() => {
        if(current.value === 0) {
            handleBottom();
        } else {
            handleRoleBottom();
        }
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});

    onLoad(() => {
		checkList.value = [];
        getUsage();
        getList();
        getRoleList();
    });

    watch(current, (val) => {
        searchValue.value = '';
        switch(val) {
            case 0:
                placeholder.value = '请搜索用户姓名或电话';
            break;
            case 1:
                placeholder.value = '请搜索角色名称';
            break;    
        }
    },{deep:true,immediate:true});

</script>

<style lang="scss">
    .main-body{

        .title{
            font-size: 36rpx;
            color: #49496A;
            font-weight: bold;
            height: 120rpx;
            line-height: 120rpx;
        }
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
                    
                }
            }
        }
		
		.checkbox{
		    margin-left: auto;
			border: 3px solid #E7E9EF;
			height: 40rpx;
			width: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.checked{
			width: 30rpx;
			height: 30rpx;
			border-radius: 6rpx;
			background-color: #2C7AF2;
		}
    }
</style>
