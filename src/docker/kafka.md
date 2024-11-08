# docker-compose 部署kafka

## 创建数据文件夹并赋予1001权限
```sh
mkdir /docker_files/kafka
chown -R 1001:1001 /docker_files/kafka  
```
## compose file
- kafka.yml
```yml
version: "3"

networks:
  geolink:
    driver: bridge

services:
  kafka:
    container_name: kafka
    image: docker.io/bitnami/kafka:3.7
    ports:
      - 9092:9092
      - 9093:9093
    privileged: true
    networks:
      - geolink
    volumes:
      - /docker_files/kafka:/bitnami/kafka:rw
    environment:
      # KRaft settings
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      # Listeners
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      # 定义外网访问地址，必须填写宿主机ip地址和端口,ip不能是0.0.0.0 
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://192.168.11.7:9092 
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
```
其中192.168.11.7 为docker宿主机的IP地址

## 运行
```sh
docker-compose -f kafka.yml up -d
```

## 命令使用

```sh
docker exec -it kafka bash
# 创建主题
kafka-topics.sh --create --topic testTopic --bootstrap-server localhost:9092
# 查看主题列表
kafka-topics.sh --list --bootstrap-server localhost:9092
# 查看主体详情
kafka-topics.sh --topic testTopic --describe --bootstrap-server localhost:9092
# 生产数据
kafka-console-producer.sh --topic testTopic  --bootstrap-server localhost:9092
```



## 详细配置参数

https://hub.docker.com/r/bitnami/kafka