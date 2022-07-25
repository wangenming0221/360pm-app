import { ref } from 'vue';

const pageMixin = function (getList) {

 	const total = ref(0);
	const timer = ref(null);	
	const page = ref(1);
	const status = ref('more');
	const list = ref([]);
	const size = ref(15);

	const nextPage = () => {
		page.value ++;
		status.value = 'loading';
		timer.value = setTimeout(() => {
			getList();
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
	
	return {
		total,
		timer,
		page,
		status,
		list,
		size, 
		handleBottom,
	};
};
export default pageMixin;