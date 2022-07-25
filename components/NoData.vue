<template>
    <view class="no_data">
        <image :src="picture"></image>
    </view>
</template>

<script setup>
    import { mainDataStore } from '@/store/pinia';
    const store = mainDataStore();
	const picture = `${store.baseUrl}/syty360pm/appPicture/index/nodata.png`
</script>

<style lang="scss" scoped>
    .no_data{
        width: 300rpx;
        height: 200rpx;
        margin: 0 auto;

        image{
            width: 100%;
            height: 100%;
        }
    }
</style>