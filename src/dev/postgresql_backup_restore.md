# PostgreSQL 备份与还原


## pg_dump 

> pg_dump 将一个PostgreSQL数据库转储到一个脚本文件或者其它归档文件中

官方文档： https://www.postgresql.org/docs/12/app-pgdump.html

pg_dump常用参数：

```
## 通用选项：
-f, --file=FILENAME          输出文件名或目录名
-F, --format=c|d|t|p         输出文件格式（自定义、目录格式、tar包格式、纯文本）
-j, --jobs=NUM               使用多个并行作业进行转储
-v, --verbose                详细信息模式

## 详细模式：
-b, --blobs                  在转储中包括大对象
-c, --clean                  在重新创建之前，先清除（删除）数据库对象
-C, --create                 在转储中包括命令,以便创建数据库（包括建库语句，无需在导入之前先建数据库）
-n, --schema=SCHEMA          只转储指定名称的模式
-N, --exclude-schema=SCHEMA  不转储已命名的模式
-t, --table=TABLE            只转储指定名称的表
--column-inserts             以带有列名的INSERT命令形式转储数据

## 控制输出内容选项：
-d, --dbname=DBNAME          数据库名
-h, --host=HOSTNAME          数据库服务器的主机名或套接字目录
-p, --port=PORT              数据库服务器的端口号
-U, --username=NAME          以指定的数据库用户联接
-w, --no-password            永远不提示输入口令
-W, --password               强制口令提示 (自动)
--role=ROLENAME              在转储之前执行SET ROLE命令　
```

备份：

```bash
pg_dump -h localhost -U postgres -p 5432  epgis  > d:\epgis.pgdump
```

还原：

```bash
createdb newDBname
psql -h localhost -U postgres -d  newDBname < d:\epgis.pgdump
```

linux 下先查看postgre安装路径

whereis postgres

在切换到路径下执行，一般在/usr/bin 路径下



## pg_restore

pg_dump -Ft 为压缩为tar模式时，只能用pg_restore恢复

-Fc备份为二进制格式, 压缩存储. 并且可被 pg_restore 用于精细还原

备份：

```bash
pg_dump -U postgres -Ft  epgis > d:\epgis.tar
```

恢复：

```bash
pg_restore -U postgres -d epgis < d:\epgis.tar
```



## 参考

https://tool.4xseo.com/a/2435.html
