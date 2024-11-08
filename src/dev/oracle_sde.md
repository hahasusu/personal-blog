# 在oracle中创建SDE空间库

## 配置ORACLE 32位客户端

ArcMap是32位程序；所以连接oracle时，本机必须安装oracle 32位客户端，简便起见，直接[官网](https://www.oracle.com/technetwork/cn/database/features/instant-client/index-092699-zhs.html)下载oracle instant client，进行配置便可。

下载解压到文件夹如C:\instantclient_12_1，然后在Path变量中新增该文件夹路径。


## 创建SDE空间库

在ArcGIS中选择Create Enterprise Geodatabase工具：

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226142549.png)

输入相关信息后开始创建：

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226143229.png)

绿色部分提示如下：

```
The ST_Geometry shape library path may be invalid, or the EXTPROC is not configured correctly in the Oracle instance. [ (Unable to determine current version of ST_SHAPELIB. Please check the ST_Geometry shape library path on the Oracle server, which is set to "c:\progra~2\arcgis\desktop10.3\DatabaseSupport\Oracle\Windows64\st_shapelib.dll". Refer to the ArcGIS help topics for more details.
)]
```

意思是**ST_Geometry shape library**路径可能不正确。

> 如果创建出错，尝试将instance 项设置成 **localhost:1521/orcl**

### 配置ST_SHAPELIB路径

登录**sde**用户，在sqlplus 或者sql developer中里执行以下语句查看

```sql
select * from dba_libraries where library_name='ST_SHAPELIB';  
```

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226144410.png)

看到默认路径和实际路径不一致，执行以下语句，将ST_SHAPELIB变量修改为正确位置：

```sql
create or replace library ST_SHAPELIB  as 'C:\Program Files (x86)\ArcGIS\Desktop10.3\DatabaseSupport\Oracle\Windows64\st_shapelib.dll';  
```

### 配置ORCLE EXTPROC代理

1、打开**ORACLE_HOME\product\12.1.0\dbhome_1\NETWORK\ADMIN**目录下的 listener.ora 文件，原配置文件为：

```
(ENVS = "EXTPROC_DLLS=ONLY:c:\oracle\product\12.1.0\dbhome_1\bin\oraclr12.dll")
```
修改为：

```
(ENVS = "EXTPROC_DLLS=ANY")
```

2、打开**ORACLE_HOME\product\11.2.0\dbhome_1\hs\admin** 目录下的 extproc.ora文件，

将最后一行的SET EXTPROC_DLLS=  修改为 SET EXTPROC_DLLS=ANY

3、重启 OracleOraDb11g_home1TNSListener服务和  OracleServiceORCL服务。

## 删除SDE空间库

```sql
-- 用户名和表空间均sde
drop user sde cascade
drop tablespace sde including contents and datafiles;
```

## SDE使用

在catalog中，Database Connections 下点击Add Database Connection
实例名填写 **localhost:1521/orcl**

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190228094152.png)

- [ArcGIS 10.2操作入门视频教程（12）ArcSDE基本知识](https://malagis.com/arcgis-10-2-operate-video-12.html)
- [ArcGIS 10.2操作入门视频教程（13）ArcSDE版本管理](https://malagis.com/arcgis-10-2-operate-video-13.html)

## SDE版本控制及原理

数据集（要素类、要素数据集或表）注册为版本后，数据库中将会创建两个增量表：用于插入和更新的 A（添加）表以及用于删除的 D（删除）表。每次更新或删除数据集中的记录时，都会向这两个表或其中一个表添加行。

如：我在数据库中新建了一个Line要素类，然后将其注册为版本后，数据库中出现了如下两个表：a8,D8，8代表该要素类在[table_registry]表中的数据集的ID。



## 参考

- http://desktop.arcgis.com/zh-cn/arcmap/10.3/manage-data/gdbs-in-oracle/connect-oracle.htm

- [ORALCE SDE GEOMETRY SHAPE LIBRARY 路径问题](https://blog.csdn.net/kone0611/article/details/78503384) 

- [ORA-28595: Extproc 代理: DLL 路径无效解决办法](https://www.cnblogs.com/wmm15738807386/p/6722994.html)

- [ArcGIS SDE数据库版本控制的总结](https://blog.csdn.net/kone0611/article/details/50259599)

