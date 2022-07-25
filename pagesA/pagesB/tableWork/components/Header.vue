<template>
    <view class="tablework-c-header">
        <view class="search">
            <uni-search-bar
                placeholder="请输入任务名称" 
                clearButton="auto"
                cancel-text="搜索"
				@confirm="handleSearch"
				@cancel="handleSearch"
                >
            </uni-search-bar>
        </view>
        <view class="control">
            <uni-segmented-control 
                :current="current" 
                :values="items" 
                :style-type="styleType"
                :active-color="activeColor" 
                @clickItem="onClickItem" />
        </view>
         
        <view class="menus">
            <view 
                @click="handleContent(index)"
                class="item" 
                v-for="(item, index) of menus" 
                :key="index">
                <view v-if="item.title === '是否超期'">
                    {{ title1 ? title1 : item.title }}
                </view>
				<view v-if="item.title === '任务类型'">
				    {{ title2 ? title2 : item.title  }}
				</view>
				<view v-if="item.title === '任务属性'">
				    {{ title3 ? title3 : item.title  }}
				</view>
                <view>
                    <image :src="icon"></image>
                </view>
            </view>
        </view>

        <view class="content" v-show="contentShow">
            <view 
                @click="change(item, index)"
                class="content_item" 
                v-for="(item, index) of content" 
                :key="index">
                {{ item.name }}
            </view>
        </view>
     
    </view>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { mainDataStore } from '@/store/pinia';

    const props = defineProps({
        type:{
            type:String,
            default:()=>''
        },
        mark:{
            type:Boolean,
            default:()=>false
        }
    });

    const store = mainDataStore();
    const icon = `${store.baseUrl}/syty360pm/appPicture/index/selected_work.png`;
    const current = ref(0);
    const items = ref(['全部','未完成','已完成']);
    const styleType = 'text';
    const activeColor = '#007aff';
    const title = ref('');
	const title1 = ref('');
	const title2 = ref('');
	const title3 = ref('');
    const contentShow = ref(false);
    const menus = ref([]);
    const content = ref([]);

    const emits = defineEmits(['handleContent', 'onClickItem', 'handleExceed', 'handleCtio', 'handleSearch']);                           

    const onClickItem = (e) => {
		if (current.value !== e.currentIndex) {
            let taio_state;
			current.value = e.currentIndex;
            switch(items.value[current.value]) {
                case '全部':
                    taio_state = ''
                break;
                case '未完成':
                    taio_state = '1,2,4,5'
                break;
                case '已完成':
                    taio_state = '3'
                break;
                 case '进行中':
                    taio_state = '2'
                break;
                case '已结束':
                    taio_state = '3,7'
                break;
            };
            emits('onClickItem', taio_state);
		}
	};
                
    const handleContent = (index) => {
        switch(index) {
            case 0:
                content.value = [
                    {
                        name:'全部',
                        id:''
                    },
                    {
                        name:'已延期',
                        id:4
                    },
                    {
                        name:'正在进行',
                        id:2
                    }
                ];
            break;
            case 1:
                content.value = [
                    {
                        name:'全部',
                        id:''
                    },
                    {
                        name:'项目通用任务',
                        id:0
                    },
                    {
                        name:'临时性任务',
                        id:'1,2'
                    },
                    {
                        name:'公司级任务',
                        id:3
                    }
                ];
            break;
            case 2:
                content.value = [
                    {
                        name:'全部',
                        id:''
                    },
                    {
                        name:'已提交',
                        id:1
                    },
                    {
                        name:'已驳回',
                        id:2
                    }
                ];
            break;    
        }
        contentShow.value = true;
        title.value = menus.value[index].title;
        emits('handleContent', contentShow.value);
    };
	//搜索
	const handleSearch = (e) => {
		if(e.value != '') {
			emits('handleSearch',e.value)
		}
	};

    const change = (item, index) => {
        switch(title.value) {
            case '是否超期':
                emits('handleExceed', item.id);
				title1.value = content.value[index].name;
            break;  
			case '任务类型':
				emits('handleCtio', item.id);
				title2.value = content.value[index].name;
			break;
			case '任务属性':
				title3.value = content.value[index].name;
			break;
        };
        contentShow.value = false;
        emits('handleContent', contentShow.value);
    };

    watch(
        () => props.mark,
        (newVal, oldVal) => {
            if(newVal === false) {
                contentShow.value = newVal;
            }
        },
    );

    onMounted(() => {
        switch(props.type) {
            case '1':
                menus.value = [
                    {
                        title:'是否超期',
                    },
                    {
                        title:'任务类型',
                    },
                    // {
                    //     title:'任务属性'
                    // }
                ];
            break;
            case '2':
                 menus.value = [
                    {
                        title:'是否超期'
                    },
                    {
                        title:'任务类型'
                    }
                ];
            break;
            case '3':
                 menus.value = [
                    {
                        title:'是否超期'
                    }
                ];
            break;
            case '4':
                 menus.value = [
                    {
                        title:'是否超期'
                    }
                ];
                items.value = ['全部','进行中','已结束'];
            break;
        }
    });

</script>

<style lang="scss">
   
    .tablework-c-header{
        position:fixed;
        top:0;
        left:0;
        z-index:999;
        background-color:#FFFFFF;
        padding-top:10rpx;
        width:100%;

        .search{
            width:95%;
            margin:0 auto;
        }
        .control{
            border-bottom:1px solid #D8DCE0;
        }
        .menus{
            display:flex;
            justify-content:space-around;
            margin-top:20rpx;
            margin-bottom:20rpx;

            .item{
                border-left:1px solid #D8DCE0;
                padding:3rpx 0 3rpx 0;
                color: #ACB3C7;
                font-size:34rpx;
                display: flex;
                justify-content: center;
                flex:1;
                

                view:nth-child(2) {
                    margin-left: 20rpx;

                    image{
                        width:30rpx;
                        height:30rpx
                    }
                }
            }
            .item:nth-child(1){
                border:none;
            }
        }

        .content{
            width: 100%;
            background-color: #FFFFFF;

           .content_item{
               height: 100rpx;
               line-height: 100rpx;
               text-align: center;
               border-top: 1px solid #D8DCE0;
               color: #273052;
               font-size: 34rpx;
           } 
        }
    }
</style>