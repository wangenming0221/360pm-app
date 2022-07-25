<template>
	<uni-drawer
		ref="showRight" 
		mode="right" 
		:width="260"
		:mask-click="true"
		@change="scrollShow"
	>
		<scroll-view style="height: 100%;" scroll-y="true">
			<uni-list>
				<uni-list-item 
					v-for="(item,index) of list"
					:key="index"  
					:title="item.deptName">
					<template v-slot:footer>
						<view class="lookdetail" @click="handleDetail(item)">查看详情</view>
					</template>
				</uni-list-item>
			</uni-list>
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';

	const props = defineProps({
		list:{
			type:Array,
			default:()=>[]
		},	
	});

	const showRight = ref(null);
	
	const open = () => {
		showRight.value.open();
	};

	const emits = defineEmits(['goBack','scrollShow'])

	const handleDetail = (e) => {
		emits('goBack', e)
	};
	
	const scrollShow = (e) => {
        emits('scrollShow', e);
    };

	watch(
		() => props.list,
		(newVal, oldVal) => {
			if(newVal) {
				open();
			}
		},
		{
			deep:true
		}
	);

</script>

<style lang="scss">
.lookdetail{
	font-size: 30rpx;
	color: #17C977;
	display: flex;
	align-items: center;
}
</style>
