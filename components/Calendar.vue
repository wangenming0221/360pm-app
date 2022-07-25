<template>
    <view class="calendar">
		<uni-calendar
			:insert="true"
			:lunar="true" 
			@change="change"
		/>
       <!-- <view class="title-box">
            <view  
                :style="{color:titleColor}" 
                class="title-item" 
                v-for="(item, index) of header" 
                :key="index">
                {{ item }}
            </view>
        </view>
        <view class="day-box">
            <view
            @click="handleChange(item.calendar)" 
            :style="{color:item.calendar > day && item.calendar != active ? dayColor:''}"
            class="day-item"
            :class="[item.calendar === active ? 'today':'',item.calendar < day ? 'before':'']"
            v-for="(item, index) of array"
            :key="index">
                <view :class="item.calendar === active ? 'calendar':''" >
                    {{ item.calendar === day ? '今':item.calendar}}
                </view>
                <view 
                    class="lunar" 
                    :style="{color:item.calendar === active 
                    ? '#ffffff':'rgba(0,0,0,0.3)'}">
                    {{ item.lunar }}
                </view>
            </view>
        </view>   --> 
    </view>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    // import Calendar from '@/common/calendar';

    const props = defineProps({
        titleColor:{
            type:String,
            default:()=>'#333333'
        },
        dayColor:{
            type:String,
            default:()=>'#333333'
        }
    });

    const header = ['一','二','三','四','五','六','日']
    const date = new Date();
    const year = date.getFullYear(); //当前年
    const month = date.getMonth()+1; //当前月
    const day = date.getDate(); //当前日
    const d = new Date(year, month, 0); //当前日期->标准格式
    const days =  d.getDate(); //当前月总天数
    const active = ref(day); //当前选中日期
    //传递的值
    const minData = computed(() => {
        const mDay = day < 10 ? `0${day}` : day;
        const mMonth = month < 10 ? `0${month}` : month;
        return `${year}-${mMonth}-${mDay}`;
    });
    //当前月份数组
    // const array = computed(() => {
    //     const arr = [];
    //     for(let i = 1; i< days+1; i++) {
    //         const lunar = Calendar.solar2lunar(
    //             year,
    //             month,
    //             i
    //         ).IDayCn;
    //         arr.push({
    //             calendar:i,
    //             lunar:lunar
    //         });
    //     };
    //     return arr;
    // });

    // //改变日期
    // const handleChange = (e) => {
    //     if(e === active.value) {
    //         return;
    //     }
    //     const mDay = day < 10 ? `0${day}` : day;
    //     const mMonth = month < 10 ? `0${month}` : month;
    //     emits('getCalendar',`${year}-${mMonth}-${e}`);
    //     active.value = e;
    // };
	
	const emits = defineEmits(['getCalendar']);
	
	const change = (e) => {
		if(e.fulldate === active.value) {
		    return;
		}
		emits('getCalendar', e.fulldate);
		active.value = e.fulldate;
	};

    onMounted(() => {
		active.value = minData.value;
        emits('getCalendar',minData.value);
    });

</script>

<style lang="scss">
    .calendar{
        width: 100%;
      
      .title-box{
          height: 80rpx;
          line-height: 80rpx;
          border-bottom: 1px solid #E7E7E7;
          display: flex;

          .title-item{
              width: 95rpx;
              text-align: center;
              font-size: 26rpx;
          }
      }
      .day-box{
          display: flex;
          flex-wrap: wrap;
          text-align: center;
          font-size: 36rpx;

          .day-item{
              width: 95rpx;
              height: 95rpx;
              text-align: center;
              margin-top: 15rpx;
              border-radius: 999rpx;
             

              .calendar{
                  color: #ffffff;
              }
               .lunar{
                  font-size: 28rpx;
              }
          }
          .today{
              background-color: rgb(74,111,244);
              color: #ffffff;
           }
           .before{
                color: #BFBFBF;
           }
      }
    }
</style>