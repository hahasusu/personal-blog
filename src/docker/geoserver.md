# docker 安装geoserver



## 拉取镜像

```shell
docker pull docker.osgeo.org/geoserver:2.25.x
```

## 运行容器

```shell
docker run -it -p8080:8080 \
  --mount type=bind,src=/MY/DATADIRECTORY,target=/opt/geoserver_data \
  docker.osgeo.org/geoserver:2.25.x
```

## 进入程序

```
http://localhost:8080/geoserver
```

## 参考

https://docs.geoserver.org/2.25.x/en/user/installation/docker.html