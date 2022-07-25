<template>
	<view class="currency">
		<header-info :info="info"></header-info>
		<my-liner v-if="list" :list="list"></my-liner>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { get } from '@/api/request.js';
	import headerInfo from './components/headerInfo';
	import myLiner from './components/myLiner';
	
	const info = ref({});
	const list = ref([]);
	
	const getInfo = async() => {
			const params = {
				data:{
			
				},
				url:'/360-manage-core-operatemanage/CommonTaskInfo/get/selectCommonStatistics'
			};
			await get(params)
				.then(res => {
					if(res.data){
						info.value = Object.assign({}, res.data[0]);
						for(let i = 1; i<res.data.length; i++) {
							list.value[i - 1] = res.data[i];
						}
					};
				});
	};
	
	onLoad(() => {
		getInfo();
	});
</script>

<style lang="scss">
	.currency{
		
		
	}
</style>
