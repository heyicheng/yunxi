<template>
	<div class="main">
		<vHeader
		:menuHide.sync="menuHide"
		@handleReloadMenu="handleReloadMenu"
		>
		</vHeader>
		<nav-list 
		:menuList="menuList"
		:cHeight="containerHeight"
		>
		</nav-list>
		<div :style="{width: containerWidth + 'px', height: containerHeight + 'px'}" :class="{'container': true, 'full': menuHide}">
			<router-view></router-view>
		</div>		
	</div>
</template>

<script>
import { getItem, getRoutes } from "@util/util";
import NavList from '@components/Home/NavList';
import vHeader from '@components/Home/Header';
import { mapGetters } from "vuex";

let Component = {
	name: 'Home',
	components: {
		NavList,
		vHeader
	},
	data () {
		return {
			containerWidth: document.body.clientWidth - 200,
			containerHeight: document.body.clientHeight - 60,
			menuList: [],
			menuHide: true,
			isReload: true
		};
	},
	watch: {
		menuHide: function(newState) {
			if (newState) {
				this.containerWidth = document.body.clientWidth;
			}else {
				this.containerWidth = document.body.clientWidth - 200;				
			}
		}
	},
	beforeCreate() {
	},
	created(){
		this.menuHide = this.$router.history.current.name == 'welcome' ? true : false;
		setTimeout(()=>{
			this.$store.dispatch('getLinkAgeList');
			this.$store.dispatch('getSelectOptions');
		}, 200);
	},
	mounted() {
		window.addEventListener('resize', ()=>{
			this.containerWidth =  this.menuHide ? document.body.clientWidth : document.body.clientWidth - 200;
			this.containerHeight = document.body.clientHeight - 60;
		},false);
		
		!this.menuHide && this.handleReloadMenu();
	},
	methods: {
		hideMenu() {
			this.menuHide = !this.menuHide;
		},
		handleReloadMenu(isMenuClick=false) {
			let menuList = getItem('menuList');
			let currentMenu = getItem('currentMenu');
			setTimeout(()=>{
				this.menuList = menuList;
				this.$router.push({
					name: !isMenuClick ? this.$router.history.current.name : menuList[0].children[0].name
				});
			},0);
			
		}
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.hello{
	width: 100%;
	height: 100%;
}

.main {
	width: 100%;
	height: 100%;
}
.container {
	position: absolute;
	top: 60px;
	left: 200px;
	padding: 20px;
	z-index: 10;
	overflow: auto;
	overflow-x: hidden;
	font-size: 16px;
	background: #fff;
	transition: left 0.5s, width 0.5s;
	-moz-transition: left 0.5s, width 0.5s;
	-webkit-transition: left 0.5s, width 0.5s;
	-o-transition: left 0.5s, width 0.5s;
}
.container.full {
	left: 0;
}
</style>
