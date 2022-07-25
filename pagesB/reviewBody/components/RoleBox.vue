<template>
	<view class="reviewbody-c-rolebox">
        <view 
            @click="modelOpen(item)"
            class="item"
            v-for="(item,index) of list"
            :key="index">
            <image class="header" :src="header_image" />
            <view>
                {{ item.roleName }}
            </view>
            <view class="left">
                <uni-icons type="forward"></uni-icons>
            </view>
        </view>
	</view>
</template>

<script setup>
    import { mainDataStore } from '@/store/pinia';
    

    const store = mainDataStore();
    const header_image = `${store.baseUrl}/syty360pm/appPicture/index/role_list.png`;

	const props = defineProps({
		list:{
			type:Array,
			default:() => []
		},
	});
    const emits = defineEmits(['modelOpen'])
    const modelOpen = (options) => {
        emits('modelOpen', options)
    };
</script>

<style lang="scss">
	.reviewbody-c-rolebox{    

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
            .left{
                margin-left: auto;
            }
        }
	}
</style>
