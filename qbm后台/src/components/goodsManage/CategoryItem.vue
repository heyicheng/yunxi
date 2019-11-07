<template>
	<Row :gutter="10" :key="`category${index}`">
		<Col span="4" style="text-align: right;">品类{{index}}</Col>
		<Col span="4">
			<Select @on-change="selectAbledTwo" style="width:100px">
				<Option :value="0" :key="0">默认</Option>
				<Option v-for="arri in categoryList" :value="arri.id" :key="arri.id">{{ arri.varietiesName }}</Option>
			</Select>
		</Col>
		<Col span="4" style="color: #999;">{{levelOneName}}</Col>
		<Col span="4">
			<Select @on-change="updateTwo" style="width:100px" :disabled="levelTwoDisabled">
				<Option :value="0" :key="0">默认</Option>
				<Option v-for="item in levelTwoList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
			</Select>
		</Col>
		<Col span="4" style="color: #999;">{{levelTwoName}}</Col>
		<Col span="4">
			<PicturePicker
			:limit="1"
			:isMultiple="false"
			:uriList="showIcon"
			:width="38"
			:height="38"
			></PicturePicker>
		</Col>
	</Row>	
</template>

<script>
import { mapGetters } from 'vuex';
import PicturePicker from '@components/common/PicturePicker';

let Component = {
	components: {
		PicturePicker
	},
	props: {
		index: {
			type: Number,
			default: 1
		},
		levelOneName: {
			type: String,
			default: '默认'
		},
		levelTwoName: {
			type: String,
			default: '默认'
		},
		levelOne: [Number, String],
		levelTwo: [Number, String],
		showIcon: [Array, String]
	},
	data () {
		return {
			levelTwoList: [],
			levelTwoDisabled: true
		};
	},
	computed: {
		...mapGetters({
			categoryList: 'categoryList'
		})
	},
	created(){	
	},
	mounted() {
	},
	beforeUpdated() {
	},
	methods: {
        selectAbledTwo(value) {
			this.$emit('update:levelOne', value);
			if (value != 0) {
				this.getList(value, 1);
			} else {
				this.levelTwoDisabled = true;
				this.$emit('update:levelTwo', 0);
				return false;
			}
		},
		updateTwo(value) {
			this.$emit('update:levelTwo', value);
		},
        getList(parentId, level) {
			this.$http({
				method: 'post',
				url: '/goodsClassification/loadGoodsClassificationList.html',
				params: {
					parentId: parentId
				},
			}).then((response) => {
				if (response.result) {
					if (level == 1) {
						this.levelTwoList = response.dataList;
						this.levelTwoDisabled = response.dataList.length>0 ? false : true;
						this.$emit('update:levelTwo', 0);
						this.levelThreeDisabled = true;
						this.$emit('update:levelThree', 0);
					}else if (level == 2) {
						this.levelThreeList = response.dataList;
						this.levelThreeDisabled = response.dataList.length>0 ? false : true;
						this.$emit('update:levelThree', 0);
					}
					
				} else {
					this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		}
	},
	mounted(){
		
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>