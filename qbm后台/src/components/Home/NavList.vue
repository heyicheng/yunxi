<template>
	<Menu :style="{height:cHeight + 'px'}" ref="navList" class="sidebar-menu-con" :active-name="names.activeName" :theme="theme" :open-names="[names.openName]" @on-select="handleClick" mode="vertical" width="200" >
		<template v-for="item in menuList">
			<MenuItem v-if="!item.children || item.children.length<=1" :name="item.name" :key="item.name">
				<Icon :type="item.icon" :size="iconSize"></Icon>
				<span class="layout-text" :key="item.name">{{item.title}}</span>
			</MenuItem>
			<Submenu v-if="item.children && item.children.length>1" :name="item.name">
				<template slot="title">
					<Icon :type="item.icon" :size="iconSize"></Icon>
					{{item.title}}
				</template>
				<template v-for="child in item.children">
					<MenuItem :name="child.name" :key="child.name">{{child.title ? child.title : child.meta.title}}</MenuItem>
				</template>
			</Submenu>
		</template>
	</Menu>
</template>

<script>
import { mapGetters } from 'vuex';

let Component = {
	props: {
		menuList: Array,
		cHeight: Number,
	},
	data () {
		return {
			theme: 'light',
			iconSize: '20px',
		};
	},
	computed: {
		...mapGetters({
			names: 'names'
		})
	},
	created() {
	},
	beforeMount() {
	},
	beforeUpdate() {		
	},
	updated() {
		this.$nextTick(()=>{
			this.$refs.navList.updateOpened();
			this.$refs.navList.updateActiveName();
		});
	},
	methods: {
		handleClick(name) {
			let willpush = true;
			if (this.beforePush !== undefined) {
				if (!this.beforePush(name)) {
					willpush = false;
				}
			}
			if (willpush) {
				this.$router.push({
					name: name
				});
			}
		},
	},
	mounted () {
	}
	
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
ul {
	list-style-type: none;
	padding: 0;
	width: 200px;
	height: 100%;
}

li {
	display: inline-block;
	width: 100%;
}
.sidebar-menu-con{
	width: 200px;
	height: 100%;
	position: fixed;
	top: 60px;
	left: 0;
	z-index: 9;
	transition: width .3s;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
	background-color: #2d8cf0!important;
	color: #fff;
	border: none;
}
</style>
