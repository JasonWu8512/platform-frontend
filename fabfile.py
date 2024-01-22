# -*- coding: utf-8 -*-
# @Time    : 2020/10/27 3:59 下午
# @Author  : zoey
# @File    : fibfile.py
# @Software: PyCharm
from fabric.api import *

#配置远程服务器
env.hosts = ['172.31.112.10']
#端口
env.port = '22'
#用户
env.user = 'deploy'
#密码
env.password = 'niuniuniu168'


@task
def deploy():
    run('uname -s')
    # run('echo niuniuniu168| sudo -S docker network create --gateway 172.16.1.1 --subnet 172.16.1.0/24 app_bridge')
    run('echo niuniuniu168| sudo -S docker pull harbor.jlgltech.com/qa/noa:latest')
    run("echo niuniuniu168| sudo -S docker stop $(sudo -S docker ps -a|grep noa| awk '{print $1}')")
    run("echo niuniuniu168| sudo -S docker rm $(sudo -S docker ps -a|grep noa| awk '{print $1}')")
    run('echo niuniuniu168| sudo -S docker run --restart=unless-stopped --network=host -v /data/jacoco/report:/data/jacoco/report --name noa-web -d -p 8080:8080 harbor.jlgltech.com/qa/noa:latest')
    run("echo niuniuniu168| sudo -S docker rmi $(sudo -S docker images |grep none |awk '{print $3}')")

