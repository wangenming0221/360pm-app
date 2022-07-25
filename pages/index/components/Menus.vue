<template>
	<view class="index-c-menus">
		<swiper v-if="bannerList.length > 0" class="swiper-box">
			<swiper-item 
				class="swiper-item" 
				v-for="(item ,index) of bannerList" 
				:key="index">
				<image :src="item" />
			</swiper-item>
		</swiper>
		<view class="info">
			<view class="time">
				<text class="week">{{ info.week }}</text>
				<text class="date">{{ info.date }}</text>
			</view>
			<view class="weather">
				<img :src="info.icon">
				<text>{{ info.type }}</text>
				<text>{{ info.wendu }}°</text>
				<text>{{ info.fengxiang }}</text>
				<text>{{ info.fengli }}级</text>
			</view>
		</view>
		<view class="title">
			<image class="icon" :src="icon" mode=""></image>
			<view class="font">
				常用应用
			</view>
		</view>
		<view class="m-box" v-if="icons">
			<view 
			class="item" 
			v-for="(item,index) of icons" 
			v-show="item.hasAuthor"
			:key="index" 
			@click="goPath(item)"
			>
				<image class="i-img" :src="item.img" mode=""></image>
				<view class="i-title text">
					{{ item.title }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, onMounted, watch } from 'vue';
	import { mainDataStore } from '@/store/pinia';

	const props = defineProps({
		bannerList:{
			type:Array,
			default:() => []
		},
		Authorization:{
			type:Array,
			default:()=>[]
		},
	})

	const store = mainDataStore();

	const icon = `${store.baseUrl}/syty360pm/appPicture/index/icon2.png`;
	

	const icons = ref([]);
	const info = reactive({
		week:'',
		date:'',
		type:'',
		wendu:'',
		fengxiang:'',
		fengli:'',
		icon:'',
	});
	
	// const swiperClick = (index) => {
	// 	uni.navigateTo({
	// 		url:'/pagesA/adv/adv'
	// 	});
	// };
	//获取当前日期
	const getTime = () => {
		let myDate = new Date();
		let month = myDate.getMonth() + 1; //月
		let day = myDate.getDate(); //日
		let week = myDate.getDay(); //星期
		switch(week){
			case 1:
				info.week = '星期一';
			break;
			case 2:
				info.week = '星期二';
			break;
			case 3:
				info.week = '星期三';
			break;
			case 4:
				info.week = '星期四';
			break;
			case 5:
				info.week = '星期五';
			break;
			case 6:
				info.week = '星期六';
			break;
			case 0:
				info.week = '星期天';
			break;
		};
		let date = `${month}月${day}日`;
		info.date = date;
	};
	
	const getWeather = async() => {
		await uni.request({
			url:`https://free-api.heweather.com/s6/weather/now?&location=CN101070101&key=18c0ed9a14104c1188f51255c997cdd4`,
			method:'GET',
			data:{},
			success: (res) => {
				const now = res.data.HeWeather6[0].now
				info.type = now.cond_txt; //天气
				info.wendu = now.tmp; //当前温度
				info.fengxiang = now.wind_dir; //风向
				info.fengli = now.wind_sc; //风力
				info.icon = `${store.baseUrl}/syty360pm/appPicture/icons/icons/${now.cond_code}.svg`; //图标
			},
			fail: (err) => {
				uni.$u.toast('天气获取失败');
			}
		})
	};
	
	// 跳转页面
	const goPath = (page) => {
		if(page.path){
			uni.navigateTo({
				url:page.path
			});
		};
	};
	
	watch(
		()=>props.Authorization,
		(val) => {
			if(val) {
				icons.value = [];
				icons.value.push(
					{
						title:'我的工作台',
						img:`${store.baseUrl}/syty360pm/appPicture/index/menu1.png`,
						path:'/pagesB/deskTable/deskTable',
						hasAuthor:val.includes('1'),
					},
					{
						title:'通用任务库',
						img:`${store.baseUrl}/syty360pm/appPicture/index/menu2.png`,
						path:'/pagesB/currency/currency',
						hasAuthor:val.includes('2'),
					},
					// {
					// 	title:'项目管理',
					// 	img:`${store.baseUrl}/syty360pm/appPicture/index/menu3.png`,
					// 	path:'',
					// 	/pagesB/taskManagement/taskManagement
					// 	hasAuthor:val.includes('3'),
					// },
					{
						title:'公司任务库',
						img:`${store.baseUrl}/syty360pm/appPicture/index/menu4.png`,
						path:'/pagesB/taskLibrary/taskLibrary',
						hasAuthor:val.includes('4'),
					},
				);
			}
		},
		{deep:true}
	);
	
	onMounted(() => {
		getWeather();
		getTime();
	}) 
</script>

<style lang="scss">
	.index-c-menus{
		box-shadow:0 5px 5px #CCCCCC;
		border-radius: 12rpx;
		padding-bottom: 40rpx;
		
		.swiper-box{
			width: 100%;
			height: 300rpx;
			
			.swiper-item{
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 300rpx;
				width: 100%;
				color: #fff;
				
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
					
		.info{
			display: flex;
			
			.time{
				padding-left: 20rpx;
				height: 80rpx;
				line-height: 80rpx;
				
				.week{
					font-size: 34rpx;
					font-weight: bold;
				}
				.date{
					font-size: 26rpx;
					color: rgba(0,0,0,0.7);
					margin-left: 30rpx;
				}
			}
			
			.weather{
				margin-left: auto;
				font-size: 26rpx;
				height: 80rpx;
				padding-right: 20rpx;
				display: flex;
				align-items: center;
				
				image{
					width: 40rpx;
					height: 40rpx;
				}
				
				text{
					margin-left: 20rpx;
				}
			}
		}
		
		.title{
			padding-left: 20rpx;
			height: 40rpx;
			line-height: 40rpx;
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			
			.icon{
				width: 30rpx;
				height: 30rpx;
			}
			
			.font{
				font-size: 26rpx;
				font-weight: bold;
				letter-spacing: 6rpx;
				margin-left: 15rpx;
			}
		}
		
		.m-box{
			display: flex;
			
			
			.item{
				width: 100rpx;
				margin: 35rpx;
				
				.i-img{
					width: 100rpx;
					height: 100rpx;
					border-radius: 999rpx;
				}
				
				.i-title{
					font-size: 18rpx;
					font-weight: bold;
					text-align: center;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>
