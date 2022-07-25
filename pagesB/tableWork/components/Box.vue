<template>
    <view class="tablework-c-box">
        <view class="item" v-for="(item, index) of list" :key="index">
            <view class="header">
                <view class="header_a">{{ item.taio_task_name }}</view>
                <view class="header_b">
					{{ 
						item.ctio_form == '0' 
						? '通用任务'
						:item.ctio_form == '1' 
						? '临时任务'
						:item.ctio_form == '2'
						? '临时任务'
						:item.ctio_form == '3'
						? '公司级任务'
						:'-'}}
				</view>
            </view>  
            <view class="body">
                <view class="body-left">
                    <view class="children">
                        <image :src="icon2"></image>
                        <view>任务发布时间:</view>
                        <view v-if="item.taio_begin_time">
                            {{ item.taio_begin_time.length > 10
                            ? item.taio_begin_time.substring(0,10) 
                            : item.taio_begin_time}}
                        </view>
                    </view>
                    <view class="dashed"></view>
                    <view class="children" style="margin-top:0;">
                        <image :src="icon2"></image>
                        <view>周期结束时间:</view>
                        <view v-if="item.taio_end_time">
							{{ item.taio_end_time.substring(0,10)  }}
						</view>
                    </view>
                    <view class="children">
                        <image :src="icon1"></image>
                        <view>执行人:</view>
                        <view>{{ item.nick_name }}</view>
                    </view>
                     <view class="children">
                        <image :src="icon1"></image>
                        <view>审核人:</view>
                        <view>{{ item.examine_name }}</view>
                    </view>
                </view>
                <view class="body-right">
                    <view class="right-switch" >
						<switch 
							v-if="type == '4'" 
							color="rgba(64,158,255)" 
							:checked="item.is_used == '0'" 
							@change="change($event, index, item.taio_pkid)" />
					</view>
                    <view 
                    class="right-status" 
                    :style="{border:(item.taio_state == '1' || item.taio_state == '4') 
                    ? '1px solid #FFA32C;':'1px solid #2C94FF;'}">
                        <view class="status-box"
                            :class="(item.taio_state == '1' || item.taio_state == '4')
                            ? 'status_a' : (item.taio_state == '2' || item.taio_state == '3') 
                            ? 'status_b':''">
                                {{ item.taio_state == '1' ? '未开始'
                                :(item.taio_state == '2' ? '进行中'
                                :(item.taio_state == '3' ? '已完成'
                                :(item.taio_state == '4' ? '已超期'
                                :(item.taio_state == '5' ? '已预警'
								:(item.taio_state == '6' ? '已取消'
								:'已提交'))))) }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup> 
    
    import { mainDataStore } from '@/store/pinia';

    const props = defineProps({
		type: {
		    type:String,
		    default:() => ''
		},
        list: {
            type:Array,
            default:() => []
        }
    });

    const store = mainDataStore();
    const icon2 = `${store.baseUrl}/syty360pm/appPicture/index/work_2.png`;
    const icon1 = `${store.baseUrl}/syty360pm/appPicture/index/work_1.png`;

    const emits = defineEmits(['switchChange']);
  
	const change = (e, index, taio_pkid) => {
        let is_used;
		switch(e.detail.value) {
            case false:
                is_used = '1'
            break;
            case true:
                is_used = '0'
            break;    
        };
        emits('switchChange', is_used, index, taio_pkid);
	};

</script>

<style lang="scss">
    .tablework-c-box{
        width:90%;
        margin:0 auto;
        margin-top:360rpx;
        
        .item{
            border-radius: 16rpx;
            background-color: #FFFFFF;
            padding-bottom: 40rpx;
            margin-bottom: 40rpx;

            .header{
                height: 100rpx;
                border-bottom: 1px solid #DFE2E5;
                margin-left: 10rpx;
                display: flex;

                .header_a{
                    line-height: 100rpx;
                    color: #273052;
                    font-size: 38rpx;
                    font-weight: Bold;
                    padding-left: 40rpx;
					max-width: 50%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
                }
                .header_b{
                    margin-left: auto;
                    font-size: 24rpx;
                    height: 50rpx;
                    line-height: 50rpx;
                    padding: 0 30rpx 0 30rpx;
                    background-color: #E1E6E4;
                    border-radius: 0 16rpx 0 16rpx;
                    color: #000000;
                }
            }
            .body{
                display: flex;
                 

                .body-left{
                    padding-left: 40rpx;

                    .children{
                        display: flex;
                        align-items: center;
                        color: #768893;
                        font-size: 28rpx;
                        margin-top: 40rpx;

                        image{
                            width:40rpx;
                            height:40rpx;
                        }
                        view{
                            margin-left: 30rpx;
                        }
                    }
                    .dashed{
                        width: 1px;
                        height:60rpx;
                        border-right: 1px dashed #C2CCD0;
                        margin-left:16rpx;
                    }
                }
                .body-right{
                    margin-left: auto;   
                    margin-right: 20rpx;

                    .right-switch{
                        margin-top: 40rpx;
                    }

                    .right-status{
                        width: 160rpx;
                        height: 160rpx;
                        margin-top: 60rpx;
                        border-radius: 999rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .status-box{
                            width: 120rpx;
                            height: 120rpx;   
                            line-height: 120rpx;
                            border-radius: 999rpx;
                            text-align: center;
                            font-size: 30rpx;
                            transform:rotate(45deg);
                        }
                        .status_a{
                            border:1px dashed #FFA32C; 
                            color: #FFA32C;
                        }
                        .status_b{
                            border:1px dashed #2C94FF; 
                            color: #2C94FF;
                        }
                    }
                }
            }
        }
    }
</style>