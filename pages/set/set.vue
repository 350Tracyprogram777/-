<template>
	<view></view>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted, computed, ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { superData, superTools, msg } from '@/common/ss-superModules/superConfig.js';
import { useUserStore } from '@/store';
const sysApi=uniCloud.importObject('system-test')
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
onLoad(() => {
	sysApi.getClass().then(res=>{
		console.log(res)
		for(let item of res.data)
		{
		}
	})
	getPhone({text:"宽带",value:'6322c30c4c97840001724025'})
	
});

function getPhone(classDic){
	const url =
		`https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(34.784816,113.971746,2500)&page_size=20&page_index=1&keyword=${classDic.text}&key=FAJBZ-ZHOC2-G2PUI-C6KJU-RSMG2-QCFVG`;
	uni.request({
		url: url,
		method: 'GET',
		success: function(res) {
			if (res.statusCode == 200) {
				let arr=[]
				// console.log('------', res.data.data);
				for (let item of res.data.data) {
					if (!item.tel) {
						continue;
					}
					const phones=item.tel.split(";")
					let other=[]
					if(phones.length>1){
						for(let i=1;i<phones.length;i++)
						{
							other.push({name:"",phone:phones[i]})
							
						}
					}
					let dic = {
						_id:item.id,
						community_id: '',
						user_id: 'admin',
						images: [],
						cover: '',
						sys_msg: '',
						name: item.title,
						phone: item.tel.split(";")[0],
						other:other,
						remark: '数据来自腾讯地图',
						address: item.address,
						address_name: item.title,
						gps: {
							latitude: item.location.lat,
							longitude: item.location.lng
						},
						state: 0,
						class: 10,
						category_id:classDic.value,
						create_date: new Date().getTime()
					};
					// console.log('9090',dic)
					arr.push(dic)
				}
				
				// sysApi.addBook(arr).then(res=>{
				// 	console.log(res)
				// })
				
				console.log(classDic.text,arr)
				
			}
		}
	});
}
</script>

<style></style>
