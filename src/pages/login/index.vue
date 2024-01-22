<template>
  <div class="login-page">
    <div :style="{'min-height':winHeight+'px'}" class="login_box">
      <div id="particles"></div>
      <div v-loading="loading" class="login">
        <div class="login_name">
          <img alt class="login-logo" src="https://dev-crm.jiliguala.com/static/img/login_logo.b63d90e7.png">
          <p>测试平台</p>
        </div>
        <el-tabs v-model="activeName">
          <!--          <el-tab-pane label="账号密码登录" name="second">-->
<!--          <el-form id="test-login-form" ref="userForm" :model="loginForm" :rules="rules" class="loginForm">-->
<!--            <el-form-item prop="name">-->
<!--              <el-input id="t-name" v-model="loginForm.name" placeholder="填写用户名" size="medium"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item prop="password">-->
<!--              <el-input-->
<!--                  id="t-pwd"-->
<!--                  v-model="loginForm.password"-->
<!--                  placeholder="填写密码"-->
<!--                  size="medium"-->
<!--                  type="password"-->
<!--                  @keyup.enter.native="loginFun"-->
<!--              />-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--              <el-button class="login-btn" type="primary" @click="loginFun">登录</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import userApi from '@/api/user'
import {PathName} from "@/constant/routeData"

export default {
  data() {
    return {
      remeber: false, //是否记住密码
      loading: false,
      activeName: 'first',
      winHeight: window.innerHeight,
      loginForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    initParticlesJS() {
      // eslint-disable-next-line no-undef
      particlesJS('particles', {

        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#ffffff"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.24837156385953366,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#373737",
            "opacity": 0.745114691578601,
            "width": 0.6409588744762158
          },
          "move": {
            "enable": true,
            "speed": 6.409588744762158,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": false
      })
    },
    loginFun() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true
          userApi.doLogin({username: this.loginForm.name, password: this.loginForm.password}).then(res => {
            this.$store.commit('SET_TOKEN', res.token)
            console.log('permissions', res.permissions)
            this.$store.commit('SET_ROLE', res.permissions)
            this.$router.push({
              name: PathName.Home
            })
            this.loading = false
          }, () => {
            this.loading = false
          })
        } else {
          this.$message.error("请提填写用户名和密码！")
        }
      })
    },
    authToken() {
      userApi.authToken({sso_auth_code: this.$route.query.sso_auth_code}).then(res => {
        // userApi.sso_account({access_token: res.data.accessToken, uid: res.data.userInfo.uid})
          this.$store.commit('SET_TOKEN', res.token)
        this.$store.commit('SET_ROLE', res.permissions)
        this.$router.push({
          name: PathName.Home
        })
        this.loading = false
        }, () => {this.loading = false})
    }

  },
  mounted() {
    console.log('ssossosso')
    this.authToken()
    // let _this = this
    // window.addEventListener('resize', function () {
    //   _this.winHeight = window.innerHeight
    // }, true)
    // //particles
    // require('particles.js')
    // this.$nextTick(() => {
    //   this.initParticlesJS()
    // })

//       生成企业微信登录二维码
//      console.log("appid", process.env.QYWX_APPID, "agentid", process.env.QYWX_AGENTID, "redirect_uri", process.env.QYEX_REDIRECT_URI)
//     window.WwLogin({
//       "id": "wx_reg",
//       "appid": process.env.QYWX_APPID,
//       "agentid": process.env.QYWX_AGENTID,
//       "redirect_uri": process.env.QYEX_REDIRECT_URI,
//       "state": "",
//       "href": "",
//     })
  },
  // beforeCreate () {
  //   if (location.search.indexOf("?") !== -1) {
  //     let data = qs.parse(location.search.substr(1))
  //     if (data.code) {
  //       this.loading = true
  //       userApi.qywxLogin(data.code).then(res => {
  //         this.loading = false
  //         console.log(res.data.data.token)
  //         this.$store.commit('SET_TOKEN', res.data.data.token)
  //         window.location.href = window.location.origin
  //       }, error => {
  //         this.loading = false
  //         this.$message.error(error.message)
  //         //失败跳转回登录页面
  //         window.location.href = window.location.origin + '/#/login'
  //       })
  //     }
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.login {
  padding: 20px;
  position: absolute;
  width: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #01051d;
  border-radius: 10px;
  opacity: .9;

  .login_name {
    color: #fff;
    margin-bottom: 15px;
  }

  .el-input__inner {
    background-color: #080e2f !important;
    color: #fff;
  }
}

.login-page {
  overflow: hidden;
  position: reletive;
}

.login-logo {
  width: 110px;
  height: auto;
  display: block;
  margin: 40px auto 50px;
}

.login_box {
  .el-form-item {
    margin-bottom: 15px;
  }

  .register-tips {
    margin-top: 10px;
  }

  .login-btn {
    width: 100%;
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 5px;
    padding: 10px 20px;
  }
}

#particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #080e2f;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
</style>
