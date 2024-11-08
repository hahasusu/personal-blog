# ruoyi-vue-plus POJO转换

## 技术需求

 在日常开发中通常有三种实体(模型)，DO/BO/VO；

DO（Domain object）：领域对象，一般对应于数据库实体，通常也PO、ENTITY

BO（business object）：业务对象，一般包含相关字段效验或者业务逻辑效验等。

VO（view object）：显示层对象，一般传递给前端使用

如果直接把数据库查询到的DO实体输出到前端，可能会有些包含一些冗余字段或者隐私字段。等于直接把数据库表结构暴露了。所以需要通过工具将DO转换成VO。

## 实现方法

1、可以用org.springframework.beans.BeanUtils.copyProperties(src,dest)方法

```java
CategoryVo categoryVo = new CategoryVo();
BeanUtils.copyProperties(category,categoryVo);
System.out.println(categoryVo);
```

2、使用mapstruct 实体类映射框架，mapstruct 可以在VO定义的时候就制定映射类及字段关系。

3、[MapstructPlus](https://www.mapstruct.plus/)：Mapstruct 的增强工具，在 Mapstruct 的基础上，实现了自动生成 Mapper 接口的功能，并强化了部分功能，使 Java 类型转换更加便捷、优雅。ruoyi-vue-plus采用该框架。

```java
//假设有两个类 UserDto 和 User，分别表示数据层对象和业务层对象

@Data
UserDto
public class UserDto {
    private String username;
    private int age;
    private boolean young;
}

@AutoMapper(target = UserDto.class)
@Data
User
public class User {
    private String username;
    private int age;
    private boolean young;
}
- 注意：使用@AutoMapper Mapstruct Plus 除了会生成 User -> UserDto 的转换接口，默认还会生成 UserDto -> User 的转换接口，而且只需要一方标注就可以了
    
// 转换
@SpringBootTest
class MapstructApplicationTests {

    @Autowired
    private Converter converter;

    @Test
    public void test01(){
        User user = new User();
        user.setUsername("jack");
        user.setAge(23);
        user.setYoung(false);
        UserDto userDto = converter.convert(user, UserDto.class);
        System.out.println(userDto);    // UserDto{username='jack', age=23, young=false}
        User newUser = converter.convert(userDto, User.class);
        System.out.println(newUser);    // User{username='jack', age=23, young=false}
    }
}
//---------------------
//UserDto(username=jack, age=23, young=false)
//User(username=jack, age=23, young=false)

```

 

## 框架封装

ruoyi-plus-vue 把DO与VO的转换封装在BaseMapperPlus中

以SysUserMapper为例，SysUserMapper继承了BaseMapperPlus，BaseMapperPlus继承了BaseMapper。实现了POJO转换等通用逻辑的封装

继承关系：

```java
public interface SysUserMapper extends BaseMapperPlus<SysUser, SysUserVo>
public interface BaseMapperPlus<T, V> extends BaseMapper<T>
```
以ID查询为例：

```java
/**
 * 根据 ID 查询
 */
default <C> C selectVoById(Serializable id, Class<C> voClass) {
    T obj = this.selectById(id);
    if (ObjectUtil.isNull(obj)) {
        return null;
    }
    return MapstructUtils.convert(obj, voClass);
}
```

MapstructUtils类

```java
/**
 * Mapstruct 工具类
 * <p>参考文档：<a href="https://mapstruct.plus/introduction/quick-start.html">mapstruct-plus</a></p>
 *
 *
 * @author Michelle.Chung
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MapstructUtils {

    private final static Converter CONVERTER = SpringUtils.getBean(Converter.class);

    /**
     * 将 T 类型对象，转换为 desc 类型的对象并返回
     *
     * @param source 数据来源实体
     * @param desc   描述对象 转换后的对象
     * @return desc
     */
    public static <T, V> V convert(T source, Class<V> desc) {
        if (ObjectUtil.isNull(source)) {
            return null;
        }
        if (ObjectUtil.isNull(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * 将 T 类型对象，按照配置的映射字段规则，给 desc 类型的对象赋值并返回 desc 对象
     *
     * @param source 数据来源实体
     * @param desc   转换后的对象
     * @return desc
     */
    public static <T, V> V convert(T source, V desc) {
        if (ObjectUtil.isNull(source)) {
            return null;
        }
        if (ObjectUtil.isNull(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * 将 T 类型的集合，转换为 desc 类型的集合并返回
     *
     * @param sourceList 数据来源实体列表
     * @param desc       描述对象 转换后的对象
     * @return desc
     */
    public static <T, V> List<V> convert(List<T> sourceList, Class<V> desc) {
        if (ObjectUtil.isNull(sourceList)) {
            return null;
        }
        if (CollUtil.isEmpty(sourceList)) {
            return CollUtil.newArrayList();
        }
        return CONVERTER.convert(sourceList, desc);
    }

    /**
     * 将 Map 转换为 beanClass 类型的集合并返回
     *
     * @param map       数据来源
     * @param beanClass bean类
     * @return bean对象
     */
    public static <T> T convert(Map<String, Object> map, Class<T> beanClass) {
        if (MapUtil.isEmpty(map)) {
            return null;
        }
        if (ObjectUtil.isNull(beanClass)) {
            return null;
        }
        return CONVERTER.convert(map, beanClass);
    }

}
```