# spring cache 使用

## 技术背景

1、SpringCache是Spring提供的一个缓存框架，在Spring3.1版本开始支持将缓存添加到现有的spring应用程序中，在4.1开始，缓存已支持JSR-107注释和更多自定义的选项。

2、Spring Cache利用了AOP，实现了基于注解的缓存功能，并且进行了合理的抽象，业务代码不用关心底层是使用了什么缓存框架，只需要简单地加一个注解，就能实现缓存功能了，做到了对代码侵入性做小。

3、由于市面上的缓存工具实在太多，SpringCache框架还提供了CacheManager接口，可以实现降低对各种缓存框架的耦合。它不是具体的缓存实现，它只提供一整套的接口和代码规范、配置、注解等，用于整合各种缓存方案，比如Caffeine、Guava Cache、Ehcache。

## 技术原理

![在这里插入图片描述](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20210506202738558.png)

在SpringCache官网中，有一个缓存抽象的概念，其核心就是将缓存应用于Java方法中，从而减少基于缓存中可用信息的执行次数。换句话来说。就是每次调用目标方法前，SpringCache都会先检查该方法是否正对给定参数执行，如果已经执行过，就直接返回缓存的结果。这样就不用多次去执行数据库操作，减少cpu和io的消耗。 

## JSR107

JSR107是Java的一套缓存规范，**Java Caching**定义了5个核心接口，分别是**CachingProvider**, **CacheManager**, **Cache**, **Entry**  和 **Expiry**。

- **CachingProvider**：定义了创建、配置、获取、管理和控制多个CacheManager。一个应用可
   以在运行期访问多个CachingProvider。

- **CacheManager**：定义了创建、配置、获取、管理和控制多个唯一命名的Cache，这些Cache 存在于CacheManager的上下文中。一个CacheManager仅被一个CachingProvider所拥有。

- **Cache**：是一个类似Map的数据结构并临时存储以Key为索引的值。一个Cache仅被一个 CacheManager所拥有。

- **Entry**：是一个存储在Cache中的key-value对。

- **Expiry**：每一个存储在Cache中的条目有一个定义的有效期。一旦超过这个时间，条目为过期 的状态。一旦过期，条目将不可访问、更新和删除。缓存有效期可以通过ExpiryPolicy设置。

  ![img](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/14957136-4aa3e37e53b447d1.png)

## spring cache

Spring从3.1开始定义了**org.springframework.cache.Cache** 和**org.springframework.cache.CacheManager** 接口来统一不同的缓存技术; 并支持使用JCache(JSR-107)注解简化我们开发;

- 默认使用 **ConcurrenMapCacheManager**

- **Cache**接口为缓存的组件规范定义，包含缓存的各种操作集合;

- **Cache**接口下Spring提供了各种**xxxCache**的实现;如**RedisCache**，**EhCacheCache** , **ConcurrentMapCache**等;

- 每次调用需要缓存功能的方法时，Spring会检查检查指定参数的指定的目标方法是否 已经被调用过;如果有就直接从缓存中获取方法调用后的结果，如果没有就调用方法 并缓存结果后返回给用户。下次调用直接从缓存中获取。

## 整合redis实现（spring-boot-starter-data-redis）

### 1、引入依赖

创建项目springboot-cache，引入**spring-boot-starter-cache**、**spring-boot-starter-data-redis** 的依赖。

### 2、配置redisconfig

使用redis自定义CacheManager，同时自定义序列化方式。

```java
@EnableCaching
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        GenericFastJsonRedisSerializer serializer = new GenericFastJsonRedisSerializer();

        ParserConfig.getGlobalInstance().addAccept("com.gf.");

        //key序列化方式
        template.setKeySerializer(new StringRedisSerializer());
        //value序列化
        template.setValueSerializer(serializer);
        //value hashmap序列化
        template.setHashValueSerializer(serializer);
        template.afterPropertiesSet();

        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig();
        GenericFastJsonRedisSerializer serializer = new GenericFastJsonRedisSerializer();
        ParserConfig.getGlobalInstance().addAccept("com.gf.");
        config = config.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                .disableCachingNullValues();
        RedisCacheManager.RedisCacheManagerBuilder builder = RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(config);
        return builder.build();
    }
}
```

### 使用

```java
@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {

    @Cacheable(value = "emp" , key = "#root.args[0]" , condition = "#id > 0" , unless = "#result eq null")
    @Override
    public Employee getById(Serializable id) {
        System.out.println("getById");
        return super.getById( id );
    }

    @Override
    @CachePut(value = "emp", key = "#root.args[0].id", unless = "#result eq null ")
    public Employee updateEmployeeById(Employee entity) {
        boolean res = super.updateById( entity );
        if (res){
            return entity;
        }
        return null;
    }

    @CacheEvict(value = "emp", key = "#root.args[0]", condition = "#result eq true")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById( id );
    }
    
}
```

## 整合 redission

[ruoyi-vue-plus 源码分析之缓存](./ruoyi_cache)