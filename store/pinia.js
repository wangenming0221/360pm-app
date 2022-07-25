import { defineStore } from 'pinia';
import { get, post } from '@/api/request.js';

export const mainDataStore = defineStore({
	id: "mainData",
    //状态
	state:() => {
		return {
            baseUrl:'https://syty360pm.oss-cn-zhangjiakou.aliyuncs.com', //图片url地址
			modeInfo:{}, //任务详情数据
			userInfo:{}, //用户信息
			rolesInfo:{}, //用户组织
            messagesInfo:{}, //消息列表
            checkList:[], //执行主体
			reviewlist:[], //审批人（多选）
            reviewObj:{}, //审批人
            projectInfo:{}, //选中的项目名，传递给首页用来搜索
			Authorization:[],//权限
			CommissionInfo:{}, //代办下标
			taskTotal:0, //代办数量
			agency_flag:'1', //代办菜单
			taskList:[], //代办任务列表
			taskQuery:{
				data:{
					ctio_form:'',
					order_flag:1,
					user_fkid:uni.getStorageSync('user_fkid'),
					taio_state:'',
					taio_task_name:'', //任务名
					current:1,
					size:10,
				},
				url:'/360-manage-core-operatemanage/TaskActualHistory/selectAppWholeHistoryIPage'
			}, //代办任务条件
			taskHas:false, //代办列表状态
			taskStatus:'more', //代办列表状态2
		}
	},
	// 异步方法
	actions:{
        // 获取任务详情数据
		getMode(taioPkid){
			const params = {
				data:{
					taioPkid:taioPkid
				},
				url:'/360-manage-core-operatemanage/TaskActualHistory/get/selectTaskInfo'
			};
			get(params)
				.then(res => {
					this.modeInfo = Object.assign({}, res.data);
				});
		},
        // 获取用户信息
        getUserInfo(type){
			const params = {
				data:{},
				url:'/360-manage-system/system/user/getInfo'
			};
				get(params)
					.then(res => {
						if(res.data.user.userId) {
							uni.setStorageSync('user_fkid', res.data.user.userId)
							this.userInfo = Object.assign({}, res.data);
							this.getAuthorization(res.data.user.userId) //获取权限
							this.getRoles(res.data.user.userId) //获取组织
							if(type === 'wc') {
								uni.switchTab({
									url:'/pages/index/index'
								});
							}
							// uni.login({
							// 	provider:'weixin',
							//     success:(element) => {
							// 		let query = {};
							// 		// #ifdef MP-WEIXIN
							// 		query = {
							// 			code:element.code,
							// 			userId:res.data.user.userId
							// 		};
							// 		// #endif
							// 		// #ifdef APP-PLUS
							// 		query = Object.assign({}, element);
							// 		// #endif
							// 		this.getAppid(query)
							//     }
							// });
						} else {
							uni.showToast({
								title:'信息获取失败',
								icon:'error'
							})
						}
					});
		},
		getRoles(userId) {
			const params = {
				data:{
					userId
				},
				url:'/360-manage-system/system/user/deptIdUserList'
			};
			get(params)
				.then(res => {
					if(res.data.records) {
						this.rolesInfo = Object.assign({}, res.data.records[0]);
					}
				});
		},
		getAuthorization(userId) {
			const params = {
				data:{
					user_id:userId
				},
				url:'/360-manage-core-operatemanage/AppMoveMenu/selectUserRoleJurisdiction'
			};
			get(params)
				.then(res => {
					if(res.data.records) {
						const arr = [];
						res.data.records.map(item => {
							arr.push(item.app_move_type + '');
						});
						this.Authorization = arr;
					}
				});
		},
        // 登陆后跳转到首页
		getAppid(query) {
			if(query) {
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		},
        //选择审批人单用户
        SET_REVIEW(data) {
            this.reviewObj = Object.assign({}, data);;
        },
		//选择审批人（多选）
		SET_REVIEWLIST(data) {
			const index = this.reviewlist.findIndex(item => item.userId === data.userId);
			if(index > -1) return;
			this.reviewlist.push(data);
		},
		// 选择执行主体
        SET_CHECK(data) {
			const index = this.checkList.findIndex(item => item.userId === data.userId);
			if(index > -1) return;
            this.checkList.push(data);
        },
		 // 获取消息列表
		getMessages(query){
			const { current, size, isTime } = query;
			const params = {
				data:{
					current:current,
					size:size,
					user_fkid:uni.getStorageSync('user_fkid'),
				},
				url:'/360-manage-core-operatemanage/MessageInfo/get/selectAll'
			};
			get(params)
				.then(res => {
					const datas = {
						data:res.data,
						isTime:isTime
					}
					this.messagesInfo = Object.assign({}, datas);
				});
		},
		// 获取代办页下标数
		getCommission(){
			const params = {
				data:{
					user_fkid:uni.getStorageSync('user_fkid'),
				},
				url:'/360-manage-core-operatemanage/TaskActualHistory/selectAppHistoryTotal'
			};
			get(params)
				.then(res => {
					if(res.data) {
						const curPage = getCurrentPages();
						const route = curPage[curPage.length - 1].route;
						const page_a = 'pages/index/index';
						const page_b = 'pages/messages/messages';
						const page_c = 'pages/commission/commission';
						const page_d = 'pages/mine/mine';
						if(route == page_a || route == page_b || route == page_c || route == page_d) {
							uni.setTabBarBadge({
								index: 2,
								text: res.data.total.toString()
							});
						}
						this.CommissionInfo = Object.assign({}, res.data);
					}
				});
		},
		//获取代办任务列表
		getTaskList() {
			get(this.taskQuery)
				.then(res => {
					if(res.data){
						this.taskTotal = res.data.total;
						if(res.data.records.length > 0){
							this.taskList = [...this.taskList,...res.data.records];
						} else {
							this.taskHas = true
						}
					}
				})
				.finally(()=>{
					this.taskStatus= 'more';
				});
		},
	},
});