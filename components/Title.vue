<template>
	<view class="TitleComponent">
		<view class="left">{{ text }}</view>
			<picker	
				mode='selector'
				:range="selected"
				range-key="name"
				@change="handleChange">
				<view v-if="selectedShow" class="select">
					{{ selectMsg }}
				</view>
			</picker>
			<uni-icons v-if="selectedShow" type="bottom"></uni-icons>
		<view class="right" @click="goPath">
			<uni-icons v-if="isShow" type="forward"></uni-icons>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, watch } from 'vue';
	
	const props = defineProps({
		name:{
			type:String,
			default:()=>''
		},
		text:{
			type:String,
			default:()=>'未定义'
		},
		isShow:{
			type:Boolean,
			default:()=>false
		},
		selectedShow:{
			type:Boolean,
			default:()=>true
		},
		path:{
			type:String,
			default:()=>''
		},
	});

	const selectMsg = ref('');
	const changeId = ref('');
	const selected = ref([]);

	onMounted(() => {
		if(props.name === 'role' || props.name === 'plan') {
				selected.value = [
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
						 name:'已取消',
						 id:6
					},
					{
						 name:'进行中',
						 id:2
					},
				];
			} else if (props.name === 'project') {
				selected.value = [
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
						 name:'进行中',
						 id:2
					},
					{
						 name:'未开始',
						 id:1
					},
				];
			} else if (props.name === 'mode') {
				selected.value = [
					{
						 name:'全部',
						 id:''
					},
					{
						 name:'已完成',
						 id:3
					},
					{
						 name:'进行中',
						 id:2
					},
					{
						 name:'未开始',
						 id:1
					},
				];
			} else {
				selected.value = [
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
				];
			}
	});

	const emits = defineEmits(['callRole','callPlan','callRank','popupChange']);

	watch(changeId,(val) => {
		switch(props.name) {
			case 'role':
				emits('callRole',val)
			break;
			case 'plan':
				emits('callPlan',val)
			break;
			case 'rank':
				emits('callRank',val)
			break;
			case 'mode':
				emits('callMode',val)
			break;
			case 'project':
				emits('callProject',val)
			break;
		};
	},{ deep:true });

	const handleChange = (e) => {
		changeId.value = selected.value[e.detail.value].id;
		selectMsg.value = selected.value[e.detail.value].name
	};

	onMounted(() => {
		selectMsg.value = selected.value[0].name;
	});

	const goPath = () => {
		if(props.path){
			uni.navigateTo({
				url:props.path
			});
		};
	};
</script>

<style lang="scss">
	.TitleComponent{
		display: flex;
		height: 140rpx;
		line-height: 140rpx;
		align-items: center;

		.left{
			font-family: "Microsoft YaHei";
			color: #010101;
			font-weight: bold;
			font-size: 36rpx;
			letter-spacing: 4rpx;
		}
		.select{
			color: #A0A1A0;
			font-size: 36rpx;
			margin-left: 40rpx;
		}

		.right{
			margin-left: auto;
			display: flex;
			align-items: center;
		}
	}
</style>
