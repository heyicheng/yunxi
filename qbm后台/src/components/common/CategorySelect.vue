<template>
	<FormItem label="商品品类">
		<Select :value="levelOne" @on-change="selectAbledTwo($event)" style="width:100px">
			<Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
		</Select>
		<Select :value="levelTwo" @on-change="selectAbledThree" style="width:100px" :disabled="levelTwoDisabled">
			<Option v-for="item in levelTwoList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
		</Select>
		<Select :value="levelThree" @on-change="setLevelThree" style="width:100px" :disabled="levelThreeDisabled">
			<Option v-for="item in levelThreeList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
		</Select>
	</FormItem>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 *
 * <CategorySelect
	:levelOne.sync="formItem.levelOne"
	:levelTwo.sync="formItem.levelTwo"
	:levelThree.sync="formItem.levelThree"
	></CategorySelect>
 */

let Component = {
	props: {
		levelOne: [Number, String],
		levelTwo: [Number, String],
		levelThree: [Number, String],
	},
	data () {
		return {
			levelTwoList: [],
			levelThreeList: [],
			levelTwoDisabled: true,
			levelThreeDisabled: true,
		};
	},
	computed: {
		...mapGetters({
			categoryList: 'categoryList'
		})
	},
	mounted() {

	},
	methods: {
		selectAbledTwo(value) {
			if (value) {
				this.$emit('update:levelOne', value);
				this.getList(value, 1);
			} else {
				this.levelTwoDisabled = true;
				this.levelThreeDisabled = true;
				this.$emit('update:levelTwo', 0);
				this.$emit('update:levelThree', 0);
				return false;
			}

		},
		selectAbledThree(value) {
			if (value) {
				this.$emit('update:levelTwo', value);
				this.getList(value, 2);
			} else {
				this.levelThreeDisabled = true;
				this.$emit('update:levelThree', 0);
				return false;
			}
		},
		setLevelThree(value) {
			this.$emit('update:levelThree', value);
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
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

</style>
