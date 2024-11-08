# docker 安装elk

## 创建目录

```bash
#创建目录
mkdir -p /docker_files/elk/{elasticsearch/{data,plugins},logstash/config}
#授权
chmod -R 777 /docker_files/elk/elasticsearch/
```

## logstash 配置文件

```bash
tee /docker_files/elk/logstash/config/logstash.conf << \EOF
input {
  tcp {
     mode => "server"
     host => "0.0.0.0"
     port => 5041
     type => "amaxlog"
     codec => json_lines
  }
}

filter {
  date {
    match => [ "timestamp", "yyyy-MM-dd HH:mm:ss.SSS" ]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
   hosts => ["10.28.19.110:9200"]
   index => "amaxlog-%{+YYYY.MM.dd}"
   codec => json
   action => "index"
  }
}
EOF
```

## docker-compose

```bash
tee /docker_files/elk/elk-docker-compose.yml << \EOF
version: '3'
services:
  elasticsearch:
    image: elasticsearch:7.17.21  # 镜像
    container_name: elk_elasticsearch  # 定义容器名称
    restart: always  # 开机启动，失败也会一直重启
    environment:
      - "cluster.name=elasticsearch" # 设置集群名称为elasticsearch
      - "discovery.type=single-node" # 以单一节点模式启动
      - "ES_JAVA_OPTS=-Xms512m -Xmx1024m" # 设置使用jvm内存大小
    volumes:
      - /docker_files/elk/elasticsearch/plugins:/usr/share/elasticsearch/plugins # 插件文件挂载
      - /docker_files/elk/elasticsearch/data:/usr/share/elasticsearch/data # 数据文件挂载
    ports:
      - 9200:9200
  kibana:
    image: kibana:7.17.21
    container_name: elk_kibana
    restart: always
    depends_on:
      - elasticsearch # kibana在elasticsearch启动之后再启动
    environment:
      - "ELASTICSEARCH_URL=http://elasticsearch:9200" # 设置访问elasticsearch的地址
      - "I18N_LOCALE=zh-CN" # kibana中文界面显示
    ports:
      - 5601:5601
  logstash:
    image: logstash:7.17.21
    container_name: elk_logstash
    restart: always
    volumes:
      # 挂载logstash的配置文件
      - /docker_files/elk/logstash/config/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch # kibana在elasticsearch启动之后再启动
    links:
      - elasticsearch:es # 可以用es这个域名访问elasticsearch服务
    ports:
      - 5041:5041
EOF
```

## 运行

```bash
#运行
docker-compose -f elk-docker-compose.yml up -d
#卸载
docker-compose -f elk-docker-compose.yml down
```



## 参考

https://blog.csdn.net/wangxin_wangxin/article/details/131636262