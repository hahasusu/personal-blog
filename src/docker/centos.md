#  docker 安装 centos

安装centos并配置ssh 允许远程SSH连接

## 拉取镜像

```shell
docker pull centos:7
```

## 运行容器

 `--privileged和/usr/sbin/init是允许你开启特权运行,否则无法执行systemctl`

```shell
docker run -itd -p 22:22 --name centos7 --privileged centos:7 /usr/sbin/init
```

## 进入容器

```sh
docker exec -it centos7 /bin/bash
```

## 安装ssh

```sh
yum install -y openssh-server openssh-clients
```

## 修改配置

开启允许root登录,取消前面的注释#  PermitRootLogin yes  将UseDNS 改成no

```sh
vi /etc/ssh/sshd_config
```

## 重启sshd服务

```sh
systemctl restart sshd
```

## 设置root密码

```sj
passwd
```

参考：

https://cloud.tencent.com/developer/article/2298371?from=15425