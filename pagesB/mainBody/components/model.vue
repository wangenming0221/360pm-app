<template>
    <view>
    <uni-drawer
        :mask-click="true" 
        mode="right"
        :width="310"
        ref="showRight" 
        @change="change"
	>
        <scroll-view @scrolltolower="handleBottom" class="modelScroll" scroll-y="true">
					<view class="selectAll" @click="selectAll">
						全选
					</view>
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

            <view class="listEmpty" v-if="list.length === 0">
                <uni-icons type="mail-open" size="40" color="rgba(0,0,0,0.4)"></uni-icons>
                <text>暂无数据。。。</text>
            </view>
            <uni-load-more v-if="total > 15" :status="status" />
		</scroll-view>
    </uni-drawer>
    </view>
</template>
<script setup>
    import { ref, watch, onUnmounted } from 'vue';
    import { mainDataStore } from '@/store/pinia';
    import { storeToRefs } from 'pinia';
    import { get } from '@/api/request.js';

    const store = mainDataStore();
    const { checkList } = storeToRefs(store);
    const header_image = `${store.baseUrl}/syty360pm/appPicture/index/personList.png`;
    
    const showRight = ref(null);
    const roleId = ref('');
    const status = ref('more');
    const list = ref([]);
	const size = ref(15);
	const page = ref(1);
    const total = ref(0);
	const timer = ref(null);

    const handleShow = (options) => {
        roleId.value = options.roleId
		showRight.value.open();
	};

    const emits = defineEmits(['scrollShow','groupChange']);

    const change = (e) => {
        emits('scrollShow', e);
    };

	const getList = async() => {
				const params = {
					data:{
						roleId:roleId.value,
						current:page.value,
						size:size.value,
					},
					url:'/360-manage-system/system/role/authUser/allocatedList'
				};
				await get(params)
					.then(res => {
						if(res.data){
							total.value = res.data.total
							if(res.data.records.length > 0){
                                const arr = [];
                                   res.data.records.map(item => {
                                        arr.push(item)
                                    });
								list.value = [...list.value,...arr];
							}
						}
					})
					.finally(()=>{
						status.value = 'more';
					});
	};
	
	const checkClick = (options) => {
		store.SET_CHECK(options);
	};
	
	const selectAll = () => {
		list.value.map(item => {
			store.SET_CHECK(item);
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

    onUnmounted(() => {
		clearTimeout(timer.value);
		timer.value = null;
	});

    watch(roleId, val => {
        list.value = [];
        page.value = 1;
        status.value = 'more';
        total.value = 0;
        getList();
    },{deep:true,immediate:true});

    defineExpose({
        handleShow
    });
</script>
<style lang="scss">
    .modelScroll{
        height: 100%;
        padding-top:20rpx;
		
		.selectAll{
			height: 80rpx;
			line-height: 80rpx;
			padding-left: 40rpx;
			font-size: 34rpx;
			color: #2C7AF2;
		}

        .item{
            width: 90%;
            margin: 0 auto;
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
                width: 25%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
    }
</style>