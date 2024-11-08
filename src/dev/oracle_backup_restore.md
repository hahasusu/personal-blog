# oracle 数据备份及还原 

## 需求

将orcle用户onemap下的表和数据导入到onemap2000用户

## 创建用户

在sqlplus或则oracle sql developer中执行创建语句，创建onemap2000用户：
```sql
CREATE USER onemap2000 IDENTIFIED BY "ONEMAP"
  DEFAULT TABLESPACE ONEMAP;
GRANT CONNECT, RESOURCE TO onemap2000;
GRANT DBA TO onemap2000;
```

## exp方式

### 导出

```shell
exp onemap/password@orcl file=c:\onemap.dmp
```

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190218111220.png)

### 导入

```shell
imp onemap2000/password@orcl fromuser=onemap touser=onemap2000 file=c:\onemap.dmp ignore=y
```

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190218111352.png)

*以上导入导出命令均在cmd命令中完成。

## expdp方式

- expdp `数据泵`是ORCALE10G提供的新的导入导出工具。
- 官方描述：Oracle DataPump technology enables Very High-Speed movement of data and metadata from one database to another.
- 主要特性

1. 支持并行处理导入、导出任务
2. 支持暂停和重启动导入、导出任务
3. 支持通过Database Link的方式导出或导入远端数据库中的对象
4. 支持在导入时通过Remap_schema、Remap_datafile、Remap_tablespace几个参数实现导入过程中自动修改对象属主、 数据文件或数据所在表空间。
5. 导入/导出时提供了非常细粒度的对象控制。通过Include、Exclude两个参数，甚至可以详细制定是否包含或不包含某个对象。

### 导出

登录sqlplus，定义dmp文件夹：

```shell
create directory dmp as 'C:\dmp';
select * from dba_directories;
grant read,write on directory dmp to onemap;
```

在cmd命令下执行expdp:

```shell
expdp onemap/ONEMAP@orcl directory=dmp dumpfile=onemap.dmp logfile=onemap.log schemas=onemap EXCLUDE=TABLE:\"IN('ZT_WPJCFJ','ZT_WPJCFJ2')\" 
```

eclude表示不需要导出的表，window下双引号用`\`进行转义。

include同样的用法。

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190220125257.png)

### 导入

```shell
impdp onemap2000/ONEMAP@orcl directory=dmp dumpfile=onemap.dmp remap_schema=onemap:onemap2000
```

导入成功！

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190220130304.png)

## 参考

Oracle中用exp/imp命令参数详解：https://blog.csdn.net/lsyuan1989/article/details/50418665

Oracle expdp命令使用详细：https://blog.csdn.net/zhongguomao/article/details/78933333

EXPDP和IMPDP数据泵进行导出导入的方法:https://www.cnblogs.com/promise-x/p/7477360.html