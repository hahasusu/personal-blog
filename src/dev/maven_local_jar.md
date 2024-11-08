# maven 集成本地Jar配置

将本地（非maven仓库）的jar 集成至项目

## pom依赖配置
```xml
<dependency>
    <groupId>you.group</groupId>
    <artifactId>artifactId</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/libs/you-local-jar.jar</systemPath>
</dependency>
```
配置后，在Itellij开发环境正常运行，如果打包部署则会提示找不到相关类。因为scope为system时，maven默认不会打包到运行库中

## 打包配置

## jar 包配置
```xml
<plugins> 
  <plugin> 
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-maven-plugin</artifactId>  
    <configuration> 
      <includeSystemScope>true</includeSystemScope> 
    </configuration> 
  </plugin> 
</plugins>
```
执行打包后，jar会输出到BOO-INF/lib 下

## war包配置

配置了<includeSystemScope>true</includeSystemScope>，war构建时会将本地jar输出到 \WEB-INF\lib-provided 下。tomcat等容器默认加载WEB-INF\lib 下的类库

因此需要在pom 中下添加如下maven-war-plugin配置
```xml
<plugin> 
    <groupId>org.apache.maven.plugins</groupId>  
    <artifactId>maven-war-plugin</artifactId>  
    <configuration> 
        <webResources> 
        <resource> 
            <!-- 存放本地jar的文件夹 src/main/resources/lib -->
            <directory>${project.basedir}/libs</directory>
            <!-- 目标lib目录 WEB-INF/lib/ -->
            <targetPath>WEB-INF/lib/</targetPath>  
            <includes>
            <!-- 匹配所有jar包 -->
            <include>**/*.jar</include> 
            </includes> 
        </resource> 
        </webResources> 
    </configuration> 
</plugin>
```