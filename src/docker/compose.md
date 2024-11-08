# Docker Compose

## 简介

Docker Compose是Docker官方的开源项目，负责实现对Docker容器集群的快速编排。Compose 可以管理多个Docker容器，将他们组成一组应用。你需要定义一个 YAML 格式的配置文件docker-compose.yml，写好多个容器之间的调用关系。然后，只要一个命令，就能同时启动/关闭这些容器。

Docker Compose官网：https://docs.docker.com/compose/

Compose 使用的三个步骤：

1.编写Dockerfile定义各个微服务应用并构建出对应的镜像文件dockerfile的使用，使用dockerfile部署springboot项目。

2.使用 docker-compose.yml 定义一个完整业务单元，安排好整体应用中的各个容器服务。

3.最后，执行docker-compose up命令 来启动并运行整个应用程序，完成一键部署上线。

## 使用

### 创建docker-compose.yml

```yml
# yaml 配置
version: '3'
services:
  web:
    build: .
    ports:
      - "5000:5000"
  redis:
    image: "redis:alpine"
```
该 Compose 文件定义了两个服务：web 和 redis。

web：该 web 服务使用从 Dockerfile 当前目录中构建的镜像。然后，它将容器和主机绑定到暴露的端口 5000。此示例服务使用 Flask Web 服务器的默认端口 5000 。

redis：该 redis 服务使用 Docker Hub 的公共 Redis 映像。
### 构建

```shell
# -d为后台执行
docker-compose up -d
```
## compose命令
```shell
# 1、基础命令
# 获得一个命令的帮助
docker-compose <command> --help
# 查看docker-compose版本信息
docker-compose version
 
# 2、构建、卸载
# 构建启动某个容器
docker-compose up -d C
# 停止并删除所有容器、网络、镜像等
docker-compose down
 
# 3、容器操作
docker-compose stop C
docker-compose start C                    
docker-compose restart C
docker-compose pause C
docker-compose unpause C
# 删除容器（删除前必须关闭容器，执行stop）
docker-compose rm C

# 4、列出所有容器
docker-compose ps
 
# 5、进入到容器
docker-compose exec C /bin/bash
 
# 6、查看容器的实时日志
# 查看容器的实时日志
docker-compose logs  -f  C
# 查看容器的实时日志(从最后10行开始)
docker-compose logs --tail 10 -f C
 
# 7、列出所有镜像
docker-compse images
 
# 8、检查并查看配置信息，配置错误时，会输出错误信息
docker-compose config
 
# 9、查看各个容器内运行的进程
docker-compose top
 
# 10、其它
# 构建镜像
docker-compose build C
# 不带缓存的构建
docker-compose build --no-cache C
# 以json形式输出容器的日志
docker-compose events --json C
```
## yml配置参考
