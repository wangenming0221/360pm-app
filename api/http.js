const baseurl = 'https://360pro.jiuzhangdigit.com' 
// http://121.89.221.24 https://360dev.jiuzhangdigit.com //测试服务器 
// https://360pro.jiuzhangdigit.com //正式服务器 
// http://192.168.110.228:8990 王思文
// http://192.168.110.111:8990 张翔
// http://192.168.110.103:8990 李洋
// http://192.168.110.190:8990 李丹丹

export default function request(type,data,url,dataType) {
    return new Promise((resolve, reject) => {
			uni.request({
				url: baseurl+url, 
				data: data,
				header: {
					'Authorization': uni.getStorageSync('token'),
				},
				method:type,
				dataType:dataType,
				success: (res) => {
					if(res.statusCode != 200){
						uni.showToast({
							title:'网络错误',
							icon:'none'
						});
					};
					resolve(res.data);
				},
				fail(err) {
					uni.showToast({
						title:'网络错误',
						icon:'none'
					})
					reject(err)
				}
			});
    })
}
