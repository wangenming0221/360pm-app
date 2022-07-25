<template>
    <view class="classtable-work">
        <our-loading isFullScreen :active="allFinished" text="loading..." />
        <view v-show="mark" class="allModel" @click="handleMark"></view>
        <v-header 
			@handleSearch="handleSearch"
            @onClickItem="onClickItem" 
            @handleContent="handleContent"
            @handleExceed="handleExceed" 
            @handleCtio="handleCtio" 
            :mark="mark" 
            :type="type">
        </v-header>
        <v-box @switchChange="switchChange" :type="type" :list="list"></v-box>
        <v-no-data v-show="noShow"></v-no-data> 
		<uni-load-more v-show="total > 15" :status="status" />
    </view>
</template>

<script setup>
    import { ref, onUnmounted, watch } from "vue";
    import { onLoad, onReachBottom } from '@dcloudio/uni-app';
    import { get, post } from '@/api/request.js';
    import vHeader from './components/Header';
    import vBox from './components/box';
    import ourLoading from '@/components/our-loading/our-loading';
    import vNoData from '@/components/NoData';

    const type = ref('');
    const mark = ref(false);
    const allFinished = ref(true);
    const taio_state = ref('');
    const taio_is_exceed = ref('');
    const ctio_form = ref('');
	const searchVal = ref('');
    // 全局混入
    const timer2 = ref(null);
	const noShow = ref(false);
	const total = ref(0);
	const timer = ref(null);	
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);

    const handleMark = () => {
        mark.value = false;
    };
    const handleContent = (e) => {
         mark.value = e;
    };
    const onClickItem = (e) => {
        taio_state.value = e;
    };
    const handleExceed = (e) => {
       taio_state.value = e;
    };
    const handleCtio = (e) => {
        ctio_form.value = e;
    };
    // 改状态
    const switchChange = async(is_used, index, taio_pkid) => {
        const params = {
			data:{
                taio_pkid,
                is_used
            },
			url: '/360-manage-core-operatemanage/TaskActualHistory/modify/update'
		};
		await post(params)
			.then(res => {
				if(res.success) {
                    list.value[index].is_used = is_used;
                } else {
                    return
                }
			})
    };
	// 搜索
	const handleSearch = (val) => {
		searchVal.value = val;
	};
    // 列表
	const getList = async() => {
         let data = {};
         switch (type.value) {
            case '1':
                data = {
                   user_fkid:uni.getStorageSync('user_fkid')
                };
            break;
            case '2':
                data = {
                   examine_user_fkid:uni.getStorageSync('user_fkid')
                };
            break;
            case '3':
                data = {
                   created_by:uni.getStorageSync('user_fkid')
                };
            break;
            case '4':
                data = {
                   taio_is_for:'1',
				   created_by:uni.getStorageSync('user_fkid')
                };
            break;
        };
        const query = Object.assign(data,{
            taio_state:taio_state.value,
            taio_is_exceed:taio_is_exceed.value,
            ctio_form:ctio_form.value,
			taio_task_name:searchVal.value,
        });
		const params = {
			data:query,
			url: '/360-manage-core-operatemanage/TaskActualHistory/get/selectMyWorkbenchList'
		};
		await get(params)
			.then(res => {
				if(res.data){
					total.value = res.data.total;
					if(res.data.records.length > 0){
						list.value = [...list.value,...res.data.records];
					} else {
						noShow.value = true
					}
                    timer2.value = setTimeout(() => {
                        if(list.value.length === 0){
                            noShow.value = true
                        }
                    },1000);
				}
			})
			.finally(()=>{
				status.value = 'more';
                allFinished.value = false;
			});
	};

    const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
			getList()
		},500);
	};

    const handleBottom = () => {
		if(status.value == 'loading'){
			return false;
		};
		if(page.value >= (total.value/size.value)){
			status.value = 'noMore';
			return false;
		};
	   nextPage();
	};

    watch(taio_state, (val) => {
        noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
        list.value = [];
        page.value = 1;
		getList();
	},{deep:true});

    watch(taio_is_exceed, (val) => {
        noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
        list.value = [];
        page.value = 1;
		getList();
	},{deep:true});

    watch(ctio_form, (val) => {
        noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
        list.value = [];
        page.value = 1;
		getList();
	},{deep:true});
	
	watch(searchVal, (val) => {
	    noShow.value = false
		clearTimeout(timer2.value);
		timer2.value = null
	    list.value = [];
	    page.value = 1;
		getList();
	},{deep:true});

    onReachBottom(() => {
		handleBottom();
	});

	onUnmounted(() => {
		clearTimeout(timer.value);
        clearTimeout(timer2.value);
		timer.value = null;
		timer2.value = null;
	});

    onLoad((options) => {
        type.value = options.type;
        let title = '';
        switch (options.type) {
            case '1':
                title = '我执行的';
            break;
            case '2':
                title = '我审核的';
            break;
            case '3':
                title = '我分派的';
            break;
            case '4':
                title = '周期任务管理';
            break;
        };
        uni.setNavigationBarTitle({
            title
        });
        getList();
    });
</script>

<style lang="scss">
    page{
        background-color:#F2F6F8;
    }
    .classtable-work{
        position: relative;
        min-height: 1000rpx;
    
        .allModel{
            background-color: rgba(0,0,0,0.6);
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 998;
        }
    }
</style>