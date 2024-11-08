# docker 创建 Minio

Minio 是一个基于Apache License v2.0开源协议的对象存储服务。它兼容亚马逊S3云存储服务接口，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，对象文件可以是任意大小，从几 kb 到最大 5T 不等。

## 拉取&运行容器
```shell
docker run \
-p 9000:9000 \
-p 9001:9001 \
--name minio \
-d --restart=always \
-e "MINIO_ROOT_USER=user" \
-e "MINIO_ROOT_PASSWORD=password" \
-v /root/docker/minio2/data:/data \
-v /root/docker/minio2/config:/root/.minio \
minio/minio server /data --console-address ":9001" -address ":9000"
```

## docker-compose
```yml
version: '3'
services:
  minio:
    image: minio/minio:RELEASE.2023-03-24T21-41-23Z
    container_name: minio
    ports:
      # api 端口
      - "9000:9000"
      # 控制台端口
      - "9001:9001"
    restart: always
    privileged: true
    environment:
      # 时区上海
      TZ: Asia/Shanghai
      # 管理后台用户名
      MINIO_ROOT_USER: user
      # 管理后台密码，最小8个字符
      MINIO_ROOT_PASSWORD: password
      # https需要指定域名
      #MINIO_SERVER_URL: "https://xxx.com:9000"
      #MINIO_BROWSER_REDIRECT_URL: "https://xxx.com:9001"
      # 开启压缩 on 开启 off 关闭
      MINIO_COMPRESS: "off"
      # 扩展名 .pdf,.doc 为空 所有类型均压缩
      MINIO_COMPRESS_EXTENSIONS: ""
      # mime 类型 application/pdf 为空 所有类型均压缩
      MINIO_COMPRESS_MIME_TYPES: ""
    volumes:
      # 映射当前目录下的data目录至容器内/data目录
      - /root/docker/minio/data:/data
      # 映射配置目录
      - /root/docker/minio/config:/root/.minio/
    command: server --address ':9000' --console-address ':9001' /data  # 指定容器中的目录 /data
```
启动和卸载compose镜像
```shell
cd compose_file_path
# 启动
docker-compose up -d
# 停止并移除服务。这将停止并删除所有相关的容器、网络和卷
docker-compose down
```