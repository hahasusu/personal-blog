# linux 安装nodejs环境

官方推荐采用nvm来安装nodejs:https://nodejs.org/en/download/package-manager

## nvm方式安装

```bash
# installs NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.12.0`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.0`
```

执行第一步的时候会报“拒绝连接的错误”。

## git下载

从git上下载最新nvm包：

```bash
# 1、 在对应目录中下载nvm对应版本压缩包
cd ~
wget https://github.com/nvm-sh/nvm/archive/refs/tags/v0.39.7.tar.gz

# 2、 创建.nvm文件夹并解压至nvm目录
mkdir ~/.nvm
tar -zxvf v0.39.7.tar.gz -C ~/.nvm/

# 3、编辑配置环境 ~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc 任一都行
vim ~/.bashrc

# 4、在~/.bashrc的末尾，添加如下语句：
export NVM_DIR="$HOME/.nvm/nvm-0.39.7"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# 5、重新加载配置
 source ~/.bashrc

# 6、查看版本
[root@xxx ~]# nvm --version
0.39.7

# download and install Node.js
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.12.0`

# verifies the right NPM version is in the environment
npm -v # should print `10.5.0`
```



## nvm 

**Node Version Manager（NVM）** 是一种用于管理多个主动节点.js版本的工具，可以解决多个项目对不同nodejs版本的依赖问题。

nvm 常用命令

```bash
nvm off                     // 禁用node.js版本管理(不卸载任何东西)
nvm on                      // 启用node.js版本管理
nvm install <version>       // 安装node.js的命名 version是版本号 例如：nvm install 8.12.0
nvm uninstall <version>     // 卸载node.js是的命令，卸载指定版本的nodejs，当安装失败时卸载使用
nvm ls                      // 显示所有安装的node.js版本
nvm ls-remote               // 显示远程可以安装的node.js版本
nvm list available          // 显示可以安装的所有node.js的版本
nvm use <version>           // 切换到使用指定的nodejs版本
nvm v                       // 显示nvm版本
nvm install stable          // 安装最新稳定版
```

## 版本适配问题

目前centos 只支持16.2版本，使用18以上的版本会报错GLIBC错误

```shell
[root@l7 ~]# node -v
node: /lib64/libm.so.6: version `GLIBC_2.27' not found (required by node)
node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found (required by node)
node: /lib64/libstdc++.so.6: version `CXXABI_1.3.9' not found (required by node)
node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found (required by node)
node: /lib64/libc.so.6: version `GLIBC_2.28' not found (required by node)
node: /lib64/libc.so.6: version `GLIBC_2.25' not found (required by node)
```

从nodejs18 开始不再支持centos 7 ，因为glibc不兼容

https://github.com/nodejs/node/issues/43246

解决：网上有相关解决方案，比较复杂。如果想要跟高级的版本，建议直接采用docker 安装nodejs镜像

## yum安装

也可以采用yum 来安装nodejs

先确认系统是否已经安装了epel-release包(EPEL是企业版Linux的额外软件包，是Fedora小组维护的一个软件仓库项目，为RHEL/CentOS提供他们默认不提供的软件包。)

```shell
# 查看是否安装EPEL
yum info epel-release
# 如未安装，安装EPEL
yum install epel-release
# 安装nodejs
yum install nodejs
# 安装npm
yum install npm
# 查看版本
nodejs -v
```

## 修改ssh端口

```shell
# 编辑ssh配置文件
vim /etc/ssh/sshd_config
# 找到Port 22 修改为自己要的端口如：77
# If you want to change the port on a SELinux system, you have to tell
# SELinux about this change.
# semanage port -a -t ssh_port_t -p tcp #PORTNUMBER
#
Port 22
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

# 重启sshd
systemctl restart sshd

# 测试端口
ssh localhost -p 77
```

