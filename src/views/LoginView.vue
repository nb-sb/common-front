<template>
	<div class="login">
	  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
		<h3 class="title">后台管理系统</h3>
		<el-form-item prop="username">
		  <el-input
			v-model="loginForm.username"
			type="text"
			auto-complete="off"
			placeholder="账号"
		  >
			<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
		  </el-input>
		</el-form-item>
		<el-form-item prop="password">
		  <el-input
			v-model="loginForm.password"
			type="password"
			auto-complete="off"
			placeholder="密码"
			@keyup.enter.native="handleLogin"
		  >
			<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
		  </el-input>
		</el-form-item>
		<el-form-item prop="code" v-if="captchaEnabled" >
			<div style="display: flex;">
				<el-input
					v-model="loginForm.code"
					auto-complete="off"
					placeholder="验证码"
					style="width: 63%;"
					@keyup.enter.native="handleLogin"
				>
					<svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
				</el-input>
				<div class="login-code">
					<img :src="codeUrl" @click="getCode" class="login-code-img"/>
				</div>
			</div>
		  
		</el-form-item>
		<el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px; display: flex;">记住密码</el-checkbox>
		<el-form-item style="width:100%;">
		  <el-button
			:loading="loading"
			size="medium"
			type="primary"
			style="width:100%;height: 45px;border-radius: 10px;background:  #4964d0;;"
			@click.native.prevent="handleLogin"
		  >
			<span v-if="!loading">登 录</span>
			<span v-else>登 录 中...</span>
		  </el-button>
		  <div style="float: right;" v-if="register">
			<router-link class="link-type" :to="'/register'">立即注册</router-link>
		  </div>
		</el-form-item>
	  </el-form>

	  <div class="el-login-footer">
		<span>Copyright © 2024 戏人看戏.</span>
	  </div>
	  	<div class="bg">
			<svg-icon class="bgnb" icon-class="bg" />
		</div>
	</div>
  </template>
  
  <script>
  import SvgIcon from '@/components/SvgIcon'// svg component
  import { getCodeImg ,Login} from "@/api/login";
  import Cookies from "js-cookie";
  import { Notification, MessageBox, Message, Loading } from 'element-ui'

  export default {
	name: "Login",
	comments: {
	  SvgIcon
	},
	data() {
	  return {
		codeUrl: "",
		loginForm: {
		  username: "",
		  password: "",
		  rememberMe: true,
		  code: "",
		  uuid: ""
		},
		loginRules: {
		  username: [
			{ required: true, trigger: "blur", message: "请输入您的账号" }
		  ],
		  password: [
			{ required: true, trigger: "blur", message: "请输入您的密码" }
		  ],
		  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
		},
		loading: false,
		// 验证码开关
		captchaEnabled: true,
		// 注册开关
		register: true,
		redirect: undefined
	  };
	},
	watch: {
	  $route: {
		handler: function(route) {
		  this.redirect = route.query && route.query.redirect;
		},
		immediate: true
	  }
	},
	created() {
	  this.getCode();
	  this.getCookie();
	},
	methods: {
	  getCode() {
		getCodeImg().then(res => {
		  this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
		  if (this.captchaEnabled) {
			this.codeUrl = "data:image/gif;base64," + res.data.img;
			this.loginForm.uuid = res.data.uuid;
		  }
		});
	  },
	  getCookie() {
		const username = Cookies.get("username");
		const password = Cookies.get("password");
		const rememberMe = Cookies.get('rememberMe')
		this.loginForm = {
		  username: username === undefined ? this.loginForm.username : username,
		  password: password === undefined ? this.loginForm.password : (password),
		  rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
		};
	  },
	  handleLogin() {
		this.$refs.loginForm.validate(valid => {
		  if (valid) {
			this.loading = true;
			if (this.loginForm.rememberMe) {
			  Cookies.set("username", this.loginForm.username, { expires: 30 });
			  Cookies.set("password", (this.loginForm.password), { expires: 30 });
			  Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
			} else {
			  Cookies.remove("username");
			  Cookies.remove("password");
			  Cookies.remove('rememberMe');
			}
			Login(this.loginForm).then(response => {
				console.log(response)
				if(response.code == '0'){
					// this.$alert("<font color='red'>恭喜你，登录成功！</font>", '系统提示', {
					// 	dangerouslyUseHTMLString: true,
					// 	type: 'success'
					// }).then(() => {
					// 	this.$router.push("/home");
					// }).catch(() => {});
					this.$message({
						message: '恭喜你，登录成功！',
						type: 'success'
					})
					this.$router.push("/system/index");
				}
				
			}).catch(() => {
			  this.loading = false;
			  if (this.captchaEnabled) {
				this.getCode();
			  }
			});
			// this.$store.dispatch("Login", this.loginForm).then(() => {
			//   this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
			// }).catch(() => {
			//   this.loading = false;
			//   if (this.captchaEnabled) {
			// 	this.getCode();
			//   }
			// });
		  }
		});
	  }
	}
  };
  </script>
  
<style lang="scss" scoped>
  .login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	// background-image: url("../assets/images/login-background.jpg");
	// background-size: cover;
  }
  .title {
	margin: 0px auto 30px auto;
	text-align: center;
	color: #707070;
  }
  
  .login-form {
	border-radius: 6px;
	background: #ffffff;
	width: 400px;
	padding: 25px 25px 50px 25px;
	margin-left: 50%;
	.el-input {
	  height: 38px;
	  input {
		height: 38px;
	  }
	}
	.input-icon {
	  height: 39px;
	  width: 14px;
	  margin-left: 2px;
	}
  }
  .login-tip {
	font-size: 13px;
	text-align: center;
	color: #bfbfbf;
  }
  .login-code {
	width: 33%;
	height: 38px;
	float: right;
	img {
	  cursor: pointer;
	  vertical-align: middle;
	}
  }
  .el-login-footer {
	height: 40px;
	line-height: 40px;
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	color: #fff;
	font-family: Arial;
	font-size: 12px;
	letter-spacing: 1px;
  }
  .login-code-img {
	height: 38px;
	cursor: pointer;
  }
  .bgnb {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 90%;
		pointer-events: none;
		transform: rotate(180deg) scaleY(-1);
		fill: #333644;
		.cl-svg {
			height: 100%;
			width: 100%;
		}
	}
</style>
  