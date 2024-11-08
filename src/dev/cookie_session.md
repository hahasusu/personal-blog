# cookie和session简单示例

利用springboot 写了一个简单的示例说明cookie、session原理及其作用域。

## cookie

### 代码

```java
@GetMapping("/cookie")
public CommonResponse testCookie(HttpServletRequest req, HttpServletResponse res){
     Cookie cookie = new Cookie("mycookie","mou");
     res.addCookie(cookie);
     return new CommonResponse(req.getCookies());
}
```
### 初次访问：

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190223225839.png)

初次访问，浏览器不带cookie信息，服务器端在响应头（response Headers)设置了Set-Cookie项，告诉浏览器设置cookie值为“mycookie=mou”。

### 再次访问

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190223230111.png)

可以看到，当客户端获取到cookie之后，后续的请求都会在请求头(Request Headers)带上cookie

### 补充

1. 默认cookie存放在内存里，在浏览器(页面)关闭前有效；关闭页面则cookie会被删除；
2. 通过cookie.setMaxAge(expiry)设置时效后，则会变成持久cookie,保存在硬盘里。在时间范围内有效；
3. cookie.setMaxAge(0)会命令客户端立即删除cookie。
4. cookie默认的作用域是当前目录及其子目录。cookie.setPath()可以设置cookie的作用域。常用`request.getContextPath() `和`"/"`来代表当前web应用目录以及站点根目录。

## session

### 代码

```java
@GetMapping("/session")
public CommonResponse testSession(HttpServletRequest req, HttpServletResponse res){
    HttpSession session = req.getSession(true);
    return new CommonResponse(session.getId());
}
```

### 初次访问

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190223233939.png)

初次访问时，服务端会创建session并返回sessionid，并要求创建cookie。

### 再次访问

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/orcle/20190223234156.png)

后面每次访问，浏览器会将sessionid 传递给后台。

### 补充

 HTTP是无状态的，后端只有根据前端的sessionid来识别用户信息。 Session的销毁只有三种方式：
1.调用了session.invalidate()方法
2.session过期（超时）,Tomcat默认session超时时间为30分钟。
3.服务器重新启动



## 前后端分离

以上示例为浏览器手工发送请求，在实际项目中一般采用前后端分离的方式（区别于服务端渲染模式），前端采用ajax的方式调用后端接口。我们先写好前端页面代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ajax-cookie-session</title>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script type="application/javascript">
      var API_COOKIE_URL = "http://localhost:8080/rbac/cookie";
      var API_SESSION_URL = "http://localhost:8080/rbac/session";
      $(function(){
          $("#btnCookie").on("click", function () {
              $.ajax({
                  url: API_COOKIE_URL,
                  type: "GET",
                  dataType: "JSON",
                  success: function (res) {
                      console.log(API_COOKIE_URL + ":get success!");
                      console.log(res.data);
                  }
              });
          });
          $("#btnSession").on("click", function () {
              $.ajax({
                  url: API_SESSION_URL,
                  type: "GET",
                  dataType: "JSON",
                  success: function (res) {
                      console.log(API_SESSION_URL + ":get success!");
                      console.log(res.data);
                  }
              });
          });
      });
  </script>
</head>
<body>
<button id="btnCookie">cookie请求</button>
<br/>
<br/>
<button id="btnSession">session请求</button>
</body>
</html>
```



我们把后端接口和前端项目部署在同一个tomcat下：

后端接口：localhost:8080/rbac/cookie    localhost:8080/rbac/session

前端页面：localhost:8080/client/ajax.html

### cookie测试

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190225215121.png)

可以看到，初次请求后端设置了浏览器的cookie,再次请求时可以正常得到客户端的cookie信息。

### session测试

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190225215809.png)

多次ajax 返回了同一个sessionid。

说明：**在同一个web容器下，尽管使用了前后端分离，依然可以使用cookie和session**

## 跨域请求

如果前端和后端不是部署在同一个web容器下，则前后端的调用为跨域请求。

后端接口：localhost:8080/rbac/cookie，localhost:8080/rbac/session

前端页面：localhost:8081/client/ajax.html

跨域请求需要在服务端Controller添加`@CrossOrigin`注解：

```java
@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
public class CookieSessionDemoController {
}
```



### cookie测试

点击cookie请求按钮：

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190224224924.png)

可以看到，多次请求cookie一直为null。

**跨域 ajax时，后端无法设置前端cookie**。

### session测试

当我们多次点击session请求按钮，后台响应如下：

![](https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190224132254.png)

可以看到，每次ajax请求都会产生一个新的session。

其实这个可以理解，因为session是通过cookie中的sessionid值来传递的，**跨域的情况，后端无法把sessionid值传递给前端的cookie**，导致每次请求都会开启一个新的session。

## 解决跨域cookie

跨域请求传递Cookie问题:https://www.cnblogs.com/nuccch/p/7875189.html

虽然跨域请求cookie问题可以解决，但是前后端分离项目的验证机制上有更多的选择，如[jwt](https://jwt.io)。