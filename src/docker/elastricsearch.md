# docker 安装ElasticSack



## elasticsearch

```sh
mkdir -p /docker_files/elasticsearch/plugins 
mkdir -p /docker_files/elasticsearch/data 
chmod -R 777 /docker_files/elasticsearch/

docker network create elk

docker run -d \
--restart=always \
--name elasticsearch \
--network elk \
-p 9200:9200 \
-p 9300:9300 \
--privileged \
-v /docker_files/elasticsearch/data:/bitnami/elasticsearch/data \
-v /docker_files/elasticsearch/plugins:/bitnami/elasticsearch/plugins \
-e "discovery.type=single-node" \
-e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
docker.io/bitnami/elasticsearch:7

```

## kibana

```sh
mkdir -p /docker_files/kibana 
chmod -R 777 /docker_files/kibana/

docker run -d \
-p 5601:5601 \
--name kibana \
--network elk \
-v /docker_files/kibana:/bitnami/kibana \
-e KIBANA_ELASTICSEARCH_URL=elasticsearch \
bitnami/kibana:7
```



## docker-compose

```yml
version: "3"

services:
  elasticsearch:
    image: elasticsearch:7.9.3
    container_name: elasticsearch
    restart: always
    environment:
      - "discovery.type=single-node"
      - "ES_JAVA_OPTS=-Xms1024m -Xmx4096m"
      - "cluster.name=elasticsearch"
    volumes:
      - /docker_files/elastricsearch/data:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
      - 9300:9300
    privileged: true
    networks:
      - geolink
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9200"]
      interval: 1m
      timeout: 10s
      retries: 3
      start_period: 30s
```

## 参考

https://www.elastic.co/guide/en/elasticsearch/reference/8.13/docker.html