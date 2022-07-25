<template>
	<view class="currchi_c_search">
		<view class="ccs_searchBox">
			<uni-search-bar
			  placeholder="请输入任务名称"
			  v-model="searchValue"
			  cancelText="搜索" 
			  clearButton="auto"
			  @confirm="confirm"
			  @cancel="confirm"/>
		</view>
		<view class="ccs_menusBox">
			<view class="item" v-for="(item, index) of menus" :key="index" @click="select(index)">
				<div class="item-font-box" v-if="index === 0" :style="{color:item.select ? '#6392FE' : '#ACB3C7'}">
					{{ dtgx ? dtgx : item.title }}
				</div>
				<div class="item-font-box" v-if="index === 1" :style="{color:item.select ? '#6392FE' : '#ACB3C7'}">
					{{ xmgx ? xmgx : item.title }}
				</div>
				<div class="item-font-box" v-if="index === 2" :style="{color:item.select ? '#6392FE' : '#ACB3C7'}">
					{{ item.title }}
				</div>
				<uni-icons :type="item.select ? 'top' : 'bottom'" :color="item.select ? '#6392FE' : '#ACB3C7'" size="14"></uni-icons>
			</view>
			<view class="item" @click="select(3)">
				<uni-icons type="settings" color="#6392FE" size="26"></uni-icons>
				<text style="color: #6392FE;">筛选</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	
	const props = defineProps({
		show:{
			type:Boolean,
			default:() => false
		},
		dtgx:{
			type:String,
			default:() => ''
		},
		xmgx:{
			type:String,
			default:() => ''
		}
	})
	
	const searchValue = ref('');
	const menus = ref([
		{
			title:'单体工序',
			select:false
		},
		{
			title:'项目工序',
			select:false
		},
		{
			title:'业务线',
			select:false
		}
	]);
	
	const emits = defineEmits(['select', 'confirm'])
	
	const select = (index) => {
		if(index != 3) {
			menus.value[index].select = true;
		}
		emits('select', index);
	};
	//搜索框
	const confirm = (e) => {
		searchValue.value = e.value;
		emits('confirm',e.value);
	};
	
	watch(
		() => props.show,
		(newVal, oldVal) => {
			if(!newVal) {
				menus.value.map(element => {
					return element.select = false
				});
			}
		}
	);
	
</script>

<style lang="scss">
	.currchi_c_search{
		background-color: #ffffff;
		
		.ccs_searchBox{
			border-bottom: 1px solid #D8DCE0;
		}
		.ccs_menusBox{
			height: 130rpx;
			display: flex;
			align-items: center;
			padding: 0 20rpx 0 20rpx;
			border-bottom: 1px solid #D8DCE0;
			
			.item{
				height: 45rpx;
				line-height: 45rpx;
				border-left: 1px solid #D8DCE0;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				
				.item-font-box{
					width: 110rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.item:nth-child(1){
				border: none;
			}
		}
	}
</style>