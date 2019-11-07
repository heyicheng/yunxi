<template>
	<div class="header">
		<div class="logo" @click="handleBackHome">
			<img src="../../img/logo-min-white.png">
		</div>
		<div class="middle-con">
			<Menu ref="headerNav" mode="horizontal" theme="primary" @on-select="handleLoadNavMenu" :active-name="names.openName=='welcome' ? '': this.activeName">
				<div class="layout-nav">
					<MenuItem name="functional">
						<Icon type="android-apps"></Icon>
						功能管理
					</MenuItem>
					<MenuItem name="system">
						<Icon type="android-settings"></Icon>
						系统管理
					</MenuItem>
					<MenuItem name="finLife">
						<Icon type="android-archive"></Icon>
						乐享生活圈
					</MenuItem>
				</div>
			</Menu>
		</div>
		<div class="avator-con">
			<Dropdown transfer  @on-click="handleLogout">
				<Avatar icon="person" size="large" />
				<a href="javascript:void(0);">
					<span class="header-user-name">{{ username }}</span>
					<Icon type="arrow-down-b"></Icon>
				</a>
				<DropdownMenu slot="list">
					<DropdownItem name="modifyPwd">修改密码</DropdownItem>
					<DropdownItem name="logout">退出登录</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Modal
				v-model="modifyPwdMmodal"
				title="修改密码"				
				@on-ok="ok"
				@on-cancel="cancel"
				class-name="vertical-center-modal"
				width="420"
				>
				<Form ref="modifyPwdValidate" :model="modifyPwdValidate" :rules="modifyPwdRuleValidate" :label-width="90">
					<FormItem label="原密码" prop="oldPwd">
						<Input type="password" v-model="modifyPwdValidate.oldPwd" placeholder="原密码"></Input>
					</FormItem>
					<FormItem label="新密码" prop="newPwd">
						<Input type="password" v-model="modifyPwdValidate.newPwd" placeholder="新密码"></Input>
					</FormItem>
					<FormItem label="确认新密码" prop="checkNewPwd">
						<Input type="password" v-model="modifyPwdValidate.checkNewPwd" placeholder="确认新密码"></Input>
					</FormItem>
				</Form>
				<div slot="footer">
					<Button type="ghost" @click="handleReset('modifyPwdValidate')">重置</Button>
					<Button type="primary" @click="handleSubmit('modifyPwdValidate')" style="margin-left: 8px">确定</Button>
				</div>
			</Modal>
		</div>
	</div>
	
</template>

<script>
import { mapGetters } from 'vuex';
import { delCookie, setItem, getItem } from '@util/util';

let Component = {
	props: {
		menuHide: Boolean
	},
	data () {
		//表单验证
		const validateOldPwd = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入原密码'));
			} else {
				callback();
			}
		};
		const validateNewPwd = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入新密码'));
			} else {
				if (this.modifyPwdValidate.checkNewPwd !== '') {
					// 对第二个密码框单独验证
					this.$refs.modifyPwdValidate.validateField('checkNewPwd');
				}
				callback();
			}
		};
		const validateCheckNewPwd = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入新密码'));
			} else if (value !== this.modifyPwdValidate.newPwd) {
				callback(new Error('两次新密码不一下致!'));
			} else {
				callback();
			}
		};
		return {
			username: '张三',
			activeName: '',
			value: false,
			modifyPwdMmodal: false,
			modifyPwdValidate: {
				oldPwd: '',
				newPwd: '',
				checkNewPwd: ''
			},
			modifyPwdRuleValidate: {
				oldPwd: [
					{ validator: validateOldPwd, trigger: 'blur' }
				],
				newPwd: [
					{ validator: validateNewPwd, trigger: 'blur' }
				],
				checkNewPwd: [
					{ validator: validateCheckNewPwd, trigger: 'blur' }
				],
			}
		};
	},
	computed: {
		...mapGetters({
			names: 'names'
		})
	},
	beforeUpdate() {
		let currentMenu = getItem('currentMenu');		
		this.activeName = this.$router.history.current.name == 'welcome'? '' : currentMenu;				
	},
	updated() {
	},
	mounted() {
		let currentMenu = getItem('currentMenu');
		this.activeName = this.$router.history.current.name == 'welcome'? '' : currentMenu;
	},
	methods: {
		handleLogout(name) {
			if (name === "modifyPwd"){
				console.log(name);
				this.modifyPwdMmodal = true;
			} else if (name === "logout") {
				delCookie('userId');
				this.$router.push({
					name: 'login'
				});
			}
		},
		handleLoadNavMenu(name) {
			this.$store.dispatch('setMenuList', name).then(()=>{
				setTimeout(()=>{
					this.$emit('handleReloadMenu', true);
					this.$emit('update:menuHide', false);
				},50);
			});
		},
		ok () {
			this.$refs["modifyPwdValidate"].resetFields();
			this.$Message.info('确定');
			// this.$Message.info('Clicked ok');
			// this.$emit('togglePopup', {btn: 'ok', num: 1, content: this.content});
			// this.content = "";
		},
		cancel () {
			this.$refs["modifyPwdValidate"].resetFields();
			console.log("取消");
            //this.$Message.info('取消');
		},
		handleSubmit (name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					console.log("验证通过");
					this.$Message.success('Success!');
				} else {
					console.log("验证不通过");
					this.$Message.error('Fail!');
				}
			});
		},
		handleReset (name) {
			//重置表单
			this.$refs[name].resetFields();
		},
		handleBackHome() {
			this.$router.push({
				name: 'home'
			});
			this.$emit('update:menuHide', true);
		},
	},
	
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.ivu-icon-arrow-down-b{
		color: #fff;
	}
	.header {
		position: relative;
		z-index: 99;
		box-sizing: border-box;
		width: 100%;
		height: 60px;
		background-color: #2d8cf0;
		color: #fff;
		.logo{
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 200px;
			height: 60px;
			text-align: center;
		}
	}
	.middle-con{
		position: absolute;
		left: 200px;
		top: 0;
		bottom: 0;
		width: 400px;
	}
	.avator-con{
		position: absolute;
		right: 30px;
		top: 10px;
		bottom: 0;
		.header-user-name{
			display: inline-block;
			color: #fff;
			padding-left: 5px;
		}
	}
</style>
