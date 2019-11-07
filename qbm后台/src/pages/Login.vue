<template>
	<div class="login" @keydown.enter="handleSubmit">
		<div class="login-con">
			<h1 class="login-logo">
				<img src="../img/login-logo.png" alt="钱保姆后台管理系统">
			</h1>
			<div class="form-con">
				<Form ref="loginForm" :model="loginForm" :rules="rules">
					<FormItem prop="j_username">
						<Input v-model="loginForm.j_username" @keyup.enter="handleSubmit" size="large" placeholder="用户名" clearable></Input>
					</FormItem>
					<FormItem prop="j_password">
						<Input type="password" v-model="loginForm.j_password" @keyup.enter="handleSubmit" size="large" placeholder="登录密码" clearable></Input>
					</FormItem>
					<FormItem prop="verify">
						<Input type="text" v-model="loginForm.verify" @keyup.enter="handleSubmit" size="large" :maxlength="4" placeholder="验证码" style="width: 190px;"></Input>
						<img :src="vcodeImg" class="vcode" id="verifyImg" @click="changeVcode">
					</FormItem>
					<FormItem>

						<Button type="warning" :loading="loading" @click="handleSubmit" size="large" long>
							<span v-if="!loading">登录</span>
							<span v-else>登录中...</span>
						</Button>
					</FormItem>
				</Form>
			</div>
		</div>
	</div>
</template>

<script>
import { setCookie, setItem, getItem } from '@util/util';

export default {
	data () {
		return {
			loading: false,
			loginForm: {
				j_username: '',
				j_password: '',
				verify: '',
			},
			vcodeImg:  this.$url.webUrl+"/login/pcrimg.html",
			rules: {
				j_username: [
					{ required: true, message: '用户名不能为空'}
				],
				j_password: [
					{ required: true, message: '密码不能为空' }
				],
				verify: [
					{ required: true, message: '验证码不能为空'},
					{ type: 'string', min: 4,message: '请输入4位验证码'}
				]
			}
		};
	},
	methods: {
		changeVcode(){
			this.vcodeImg += Math.random();
		},
		handleSubmit () {

			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					this.$http({
						method: 'post',
						url: '/operator/login.html',
						params: {
							...this.loginForm
						},
					}).then((response) => {
						console.log(response);
						if(response.result){
							setCookie('JSESSIONID', response.data);
							setCookie('userId', response.data);
							this.$Message.success({
								content: '登录成功!',
								onClose:()=>{
									this.loading = false;
									this.$router.push({
										name: 'home'
									});
								}
							});
						}else{
							this.$Message.error({
								content: response.msg,
								onClose:()=>{
									this.loading = false;
									this.vcodeImg += Math.random();
								}
							});
						}
					}).catch((err) => {
						this.$Message.error(err);
					});
				}
			});
		},
	}
};
</script>

<style lang='scss' >
.login{
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #f8f6f2;
	.login-con{
		position: absolute;
		width: 300px;
		height: 230px;
		left: 50%;
		top: 50%;
		margin-left: -150px;
		margin-top: -150px;
		.login-logo{
			text-align: center;
		}

		.form-con{
			padding: 10px 0 0;
			.ivu-input-large,.ivu-btn-large{
				height: 40px;
			}
			.ivu-btn-large{
				font-size: 16px;
			}
		}
		.vcode{
			height: 40px;
			background-color: #fff;
			float: right;
			width: 100px;
			border-radius: 4px;
			border: 1px solid #dddee1;
			cursor: pointer;
		}
	}
}


</style>
