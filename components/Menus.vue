<template>
	<v-ring-header>
		<viwe class="list" v-if="getMenus">
			<view class="al-tabs" :style="{backgroundColor:bg,color:color}">
				<scroll-view class="al-tabs-scroll" scroll-x="true" :scroll-left="scrollLeft" scroll-with-animation>
					<view class="al-scroll-view">
						<view class="al-tab-item" v-for="(item,index) in list" :key="index" @click="clickTab(index,item.id)">
							<text v-if="currentIndex != index" class="name">{{item.name}}</text>
							<text v-else class="name tab-active" :style="{color:activeColor}">{{item.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</viwe> 
	</v-ring-header>	
</template>

<script setup>
	import { ref, watch, nextTick, onMounted } from 'vue';
	import vRingHeader from './RingHeader';
	const props = defineProps({
		list:{
			type:Array,
			default:() => [
					{
						 name:'全部',
						 id:''
					},
					{
						 name:'已完成',
						 id:3
					},
					{
						 name:'已延期',
						 id:4
					},
					{
						 name:'已预警',
						 id:5
					},
					{
						 name:'已取消',
						 id:6
					},
					{
						 name:'进行中',
						 id:2
					},
					{
						 name:'未开始',
						 id:1
					},
			],
		},
		getMenus:{
			type:Boolean,
			default:() => true
		},
		current:{
			type:Number,
			default:0
		},
		bg:{
			type:String,
			default:'none'
		},
		color:{
			type:String,
			default:'#fff'
		},
		activeColor:{
			type:String,
			default:'#fff'
		},
	});
	
	const currentIndex = ref(0);
	const scrollLeft = ref(0);
	const tabViewWidth = ref(0);//tab视图的宽度
	const tabQueryInfo = ref([]);

	const emits = defineEmits(['change']);

	const clickTab = (index,id) => {
		if(currentIndex.value === index) {
			return false
		} else {
			currentIndex.value = index
			emits('change',id)
		}
	};

	const scrollByIndex = () => {
		let tabInfo=tabQueryInfo.value[currentIndex.value];
		if(tabInfo.left<tabViewWidth.value/2){
			scrollLeft.value=0;
			return;
		}
		scrollLeft.value = tabInfo.left-tabViewWidth.value/2+tabInfo.width/2
	};

	const scrollInit = () => {
		const query=uni.createSelectorQuery().in(this)
		query.selectAll('.al-tab-item').boundingClientRect(data=>{
			tabQueryInfo.value=data
		}).exec()
		query.select('.al-scroll-view').boundingClientRect(data=>{
			tabViewWidth.value=data.width
		}).exec()
	}

	watch(
		() => props.current,
		(n,o) => {
			nextTick(function(){
				currentIndex.value = n;
				scrollByIndex();
			})
		}
	);

	onMounted(() => {
		scrollInit();
	});

</script>

<style lang="scss" scoped>
	.list{
		padding-top: 30rpx;
		background-color: #5882FF;

		.al-tabs{
			border: none;
		}
		.al-tabs-scroll{
			white-space: nowrap;
		}
		.al-scroll-view{
			display: flex;
			align-items: center;
		}
		.al-tab-item{
			font-size: 32rpx;
			padding:20rpx 30rpx;
			.name{
				white-space: nowrap;
				padding: 10rpx 0;
				// padding: 10rpx 30rpx;
			}
			.tab-active{
				color: #fff;
				font-weight: 600;
				font-size: 110%;
				border-bottom: 2px solid #fff;
			}
		}
		// 隐藏scroll-view下的滚动条
		scroll-view ::v-deep ::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
		}
	}
</style>
