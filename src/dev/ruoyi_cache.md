# ruoyi-vue-plus 源码分析之缓存

## 引入依赖

```xml
<!--redisson-->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
</dependency>
```

**redisson-spring-boot-starte** 会自动引入 **spring-boot-starter-data-redis** 和 **redisson** 

## 缓存配置

RedisConfig

```java
@Slf4j
@AutoConfiguration
@EnableCaching
@EnableConfigurationProperties(RedissonProperties.class)
public class RedisConfig {
    /**
     * 自定义缓存管理器 整合spring-cache
     */
    @Bean
    public CacheManager cacheManager() {
        return new PlusSpringCacheManager();
    }
}
```



## CacheUtils 工具类

CacheUtils 对CacheManager进行封装。

```java
package org.dromara.common.redis.utils;

import org.dromara.common.core.utils.SpringUtils;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.redisson.api.RMap;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.Set;

/**
 * 缓存操作工具类 {@link }
 *
 * @author Michelle.Chung
 * @date 2022/8/13
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuppressWarnings(value = {"unchecked"})
public class CacheUtils {

    private static final CacheManager CACHE_MANAGER = SpringUtils.getBean(CacheManager.class);

    /**
     * 获取缓存组内所有的KEY
     *
     * @param cacheNames 缓存组名称
     */
    public static Set<Object> keys(String cacheNames) {
        RMap<Object, Object> rmap = (RMap<Object, Object>) CACHE_MANAGER.getCache(cacheNames).getNativeCache();
        return rmap.keySet();
    }

    /**
     * 获取缓存值
     *
     * @param cacheNames 缓存组名称
     * @param key        缓存key
     */
    public static <T> T get(String cacheNames, Object key) {
        Cache.ValueWrapper wrapper = CACHE_MANAGER.getCache(cacheNames).get(key);
        return wrapper != null ? (T) wrapper.get() : null;
    }

    /**
     * 保存缓存值
     *
     * @param cacheNames 缓存组名称
     * @param key        缓存key
     * @param value      缓存值
     */
    public static void put(String cacheNames, Object key, Object value) {
        CACHE_MANAGER.getCache(cacheNames).put(key, value);
    }

    /**
     * 删除缓存值
     *
     * @param cacheNames 缓存组名称
     * @param key        缓存key
     */
    public static void evict(String cacheNames, Object key) {
        CACHE_MANAGER.getCache(cacheNames).evict(key);
    }

    /**
     * 清空缓存值
     *
     * @param cacheNames 缓存组名称
     */
    public static void clear(String cacheNames) {
        CACHE_MANAGER.getCache(cacheNames).clear();
    }

}
```

## 使用

```java
//直接使用方式
CacheUtils.put("cachename",key,value);
//注解方式
@Cacheable(cacheNames = "demo:cache#60s#10m#20", key = "#key", condition = "#key != null")
@GetMapping("/test1")
public R<String> test1(String key, String value) {
    return R.ok("操作成功", value);
}
```