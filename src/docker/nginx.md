# docker 安装nginx

安装nginx 并配置ssl 证书

## 运行容器

```bash
docker run -itd -p 80:80 --name nginx nginx:latest
```

```bash
# 进入容器并查看版本 -v 查看版本号 -V 查看版本及配置详情
docker exec -it nginx /bin/bash
nginx -v
```



## 拷贝文件到宿主机

```bash
mkdir /root/docker/nginx/
mkdir /root/docker/nginx/ssl/
docker cp nginx:/etc/nginx/nginx.conf /root/docker/nginx/ 
docker cp nginx:/etc/nginx/conf.d /root/docker/nginx/conf/
docker cp nginx:/usr/share/nginx/html/ /root/docker/nginx/html/
docker cp nginx:/var/log/nginx/ /root/docker/nginx/logs/
```

## 停止并删除容器

```bash
docker stop nginx
docker rm nginx
```

## 重新创建容器

```bash
docker run  --name nginx -d -p 80:80 -p 443:443 \
-v /root/docker/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /root/docker/nginx/conf:/etc/nginx/conf.d \
-v /root/docker/nginx/ssl:/etc/nginx/ssl \
-v /root/docker/nginx/html:/usr/share/nginx/html \
-v /root/docker/nginx/logs:/var/log/nginx \
-e TZ=Asia/Shanghai \
--restart=always \
--privileged=true nginx
```

## nginx 目录机构

运行tree命令，可以查看宿主机文件夹的结构

```bash
tree docker/nginx
nginx
├── conf
│   └── default.conf
├── html
│   ├── 50x.html
│   └── index.html
├── logs
│   ├── access.log -> /dev/stdout
│   └── error.log -> /dev/stderr
├── ssl
└── nginx.conf

```

## 查看 nginx 日志

```shell
[root@VM-20-14-opencloudos logs]# ll
总用量 0
lrwxrwxrwx 1 root root 11 4月  10 10:54 access.log -> /dev/stdout
lrwxrwxrwx 1 root root 11 4月  10 10:54 error.log -> /dev/stderr
```

默认nginx的日志是软连接，默认输出到日志台，需要通过docker logs 查看控制台日志信息

```shell
docker logs -f nginx
```



## nginx 配置

nginx主要有两个配置文件：
`nginx.conf` 为主配置文件
`conf.d`目录下一般存放单个域名的解析文件

### nginx.conf

```shell
# nginx用户
user  nginx;
# 工作进程数
worker_processes  auto;
# 全局日志及记录类型 [ debug | info | notice | warn | error | crit ]
error_log  /var/log/nginx/error.log notice;
# 进程pid文件
pid        /var/run/nginx.pid;

events {
	# 每个工作进程的最大连接数量
    worker_connections  1024;
}

# http服务代理
http {
	# 设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    # 默认文件类型
    default_type  application/octet-stream;
    # 日志格式设置
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

	# 日志文件的存放路径
    access_log  /var/log/nginx/access.log  main;

	#开启高效文件传输模式
    sendfile        on;
    #tcp_nopush     on;

	# keepalive超时时间
    keepalive_timeout  65;

    #gzip  on;
	# 包含和关联各个域名配置文件
    include /etc/nginx/conf.d/*.conf;
}
```

### conf.d

查看conf.d/default.conf

```shell
server {
	# http 监听端口
    listen       80;
    listen  [::]:80;
    server_name  localhost;

	# 日志信息
    #access_log  /var/log/nginx/host.access.log  main;

	# 代理配置	
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

## 配置静态网站

编辑conf/default.conf

将静态文件上传至html 文件夹下，以vitepress为例。

```shell
location / {
    root   /usr/share/nginx/html/vitepress;
    index  index.html index.htm;
};
```



## 配置https

将ssh 文件复制到nginx/ssh 文件夹

在conf 文件夹下新建443.conf

```shell
server {

     listen 443 ssl;

     server_name youdomain.com;

     ssl_certificate ssl/youdomain.com_bundle.crt;

     ssl_certificate_key ssl/youdomain.com.key;

     ssl_session_timeout 5m;

     ssl_protocols TLSv1.2 TLSv1.3;

     ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;

     ssl_prefer_server_ciphers on;

     location / {
         root html;
         index  index.html index.htm;
     }
 }

```

在容器中可以通过nginx -t 验证配置文件是否有错误

```shell
nginx -t
```

如果需要实现http 重定向到https，在default.conf中：

```shell
server {
 listen 80;
 #请填写绑定证书的域名
 server_name youdomain.com; 
 #把http的域名请求转成https
 return 301 https://$host$request_uri; 
}
```

## 参考

- Nginx配置免费HTTPS详细教程

https://blog.csdn.net/XiaoXiaoYunXing/article/details/134440485

- Nginx 服务器 SSL 证书安装部署（Linux）

https://cloud.tencent.com/document/product/400/35244