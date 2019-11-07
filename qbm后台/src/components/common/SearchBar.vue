<template>
	<div>
		<div :class="{searchBarCard: true, showBar: searchShow}">
			<Form ref="search" :label-width="80">
				<slot></slot>
				<FormItem width="56">
					<Button type="primary" @click="handleSubmit('search')">搜索</Button>
					<Button @click="hideSearch" style="margin-left: 10px;">取消</Button>
				</FormItem>
			</Form>
		</div>
		<div v-show="searchShow" class="mark" @click="hideSearch"></div>
	</div>
	
</template>

<script>



let Component = {
	props: {
		searchShow: Boolean,
		formItem: Object
	},
	data () {
		return {
			cityList: [
				{
					value: '',
					label: 'all'
				},
				{
					value: 'New York',
					label: 'New York'
				},
				{
					value: 'London',
					label: 'London'
				},
				{
					value: 'Sydney',
					label: 'Sydney'
				},
				{
					value: 'Ottawa',
					label: 'Ottawa'
				},
				{
					value: 'Paris',
					label: 'Paris'
				},
				{
					value: 'Canberra',
					label: 'Canberra'
				}
			],
			levelTwoDisabled: true,
			levelThreeDisabled: true,
		};
	},
	mounted() {
		
	},
	methods: {
		handleSubmit() {
			this.$emit('searchSubmit');
			this.$emit('toggleSearch');
		},
		handleClose() {
			
		},
		hideSearch() {
			this.$emit('toggleSearch');
		}
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.searchBarCard {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 999;
		width: 460px;
		height: 100%;
		padding: 20px;
		background: #fff;
		border-left: 1px #aaa solid;
		transform: translate(100%,0);
		transition: transform 0.5s;
	}
	.showBar {
		transform: translate(0, 0);
	}
	.mark {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 998;
		width: 100%;
		height: 100%;
		background-color: rgba(55, 55, 55, .2);
		transition: display 0.5s;
	}
</style>
