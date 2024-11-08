# docker 安装 postgis

安装和配置postgis/postgreSQL

## 运行容器

```shell
# 对外避免使用默认5432端口，建议使用复杂密码
docker run --name postgis --privileged -e POSTGRES_PASSWORD=YOU_PASSWORD -p 54321:5432 -v /root/docker/postgresql/data:/var/lib/postgresql/data -d postgis/postgis:16-3.4
```

## 进入容器
```shell
# 进入容器
docker exec -it postgis bash
# 退出
exit
```

## 数据库操作
```shell
# 进入容器
docker exec -it postgis bash
# 切换至postgres用户
su postgres
# 进入psql
psql
# 查询所有数据库
\l
# 修改postgres 密码
ALTER USER postgres WITH PASSWORD 'YOU_NEW_PASSWORD';
# 退出
exit
```