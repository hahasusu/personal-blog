# centos 环境下安装docker

## 在线安装

### 自动安装

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## 离线安装

下载最新安装包：https://download.docker.com/linux/static/stable/x86_64/
```shell
# 下载
wget https://download.docker.com/linux/static/stable/x86_64/docker-20.10.22.tgz
# 解压
tar -zxvf docker-20.10.22.tgz
sudo cp docker/* /usr/bin/
# 在后台运行
sudo nohup dockerd &
# 查看版本
docker -v
# 运行helloword
docker run hello-world
```

## 删除docker
```shell
# 删除 docker
sudo rm -rf /usr/bin/docker*
# 删除 containerd
sudo rm -rf /usr/bin/containerd*
# 删除 docker 运行时 ID
sudo rm -rf /var/run/docker*
# 卸载 docker-compose
sudo rm -rf /usr/local/bin/docker-compose

sudo rm -rf /var/lib/docker*
sudo rm -rf /var/lib/containerd*
```