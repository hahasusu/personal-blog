# ruoyi-vue-plus 数据加密传输

## 技术需求

在前后端应用开发中，有些敏感数据如密码、个人隐私等信息如果以明文的方式传输，存在信息泄露和被篡改风险。对于敏感数据需要在前端先加密在进行传输。

## 加密原理

### 加密方法

目前常见的加密方式有两种，一种是对称加密（AES为代表），一种是非对称加密（RSA为代表）。

> **对称加密**只有一个秘钥，加密和解密都是用同一个秘钥，所以叫做对称加密。
>
> **非对称加密**有两个秘钥，一个是**公钥**，一个是**私钥**。非对称的特点在于，公钥加密的私钥可以解密，但私钥加密的，公钥解不出来，只能验证是否由私钥进行加密。这样可以保证就算有人拿到公钥，也**解密**不出私钥加密后的信息，公钥可以在网上安全的传输。而且公钥可以**验证**这个密文是不是由私钥加密出来的，也起到了验证的作用，一举两得。
>
> 一般**公钥加密私钥解密**的情况是用来传输数据，**私钥加密公钥验证**的情况是用来验证签名。

### 组合使用

对称加密（AES）的优势在于加密较快，但劣势在于秘钥一旦给出去就不安全了。非对称加密（RSA）的优势在于安全，就算提供公钥出去，别人也解密不了数据，但加密速度较慢。实际使用的过程中常常将两者组合使用（**AES+RSA**）：

> 1、先生成一个**随机AES秘钥字符串**。
>
> 2、使用**RSA公钥加密AES秘钥**，然后再用**AES秘钥加密真正的内容**。
>
> 3、把**skey=加密的AES秘钥，body=AES秘钥加密的内容**传过去。
>
> 4、对面使用**RSA私钥解密AES秘钥**，然后用**AES秘钥解密出内容**。

这样可以安全的传输AES秘钥，避免了RSA加密的慢速度。

## 代码实现

### 前端加密

```javascript
// 当需要加密时：
// 生成一个 AES 密钥
const aesKey = generateAesKey();
// 加密AES密钥（RAS加密），存放在header中，传递给后端
config.headers[encryptHeader] = encrypt(encryptBase64(aesKey));
// 用AES密钥对内容进行加密
config.data = typeof config.data === 'object' ? encryptWithAes(JSON.stringify(config.data), aesKey) : encryptWithAes(config.data, aesKey);
```

前端加密主要引用**crypto-js** 和 **jsencrypt** 类库

- 使用 JSEncrypt 非对称加密（RSA）

```javascript
import JSEncrypt from 'jsencrypt';
// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY;

// 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
const privateKey = import.meta.env.VITE_APP_RSA_PRIVATE_KEY;

// 加密
export const encrypt = (txt: string) => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
};

// 解密
export const decrypt = (txt: string) => {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
};
```

- 使用CryptoJS对称加密（AES）

```javascript
import CryptoJS from 'crypto-js';
/**
 * 使用密钥对数据进行加密
 * @param message
 * @param aesKey
 * @returns {string}
 */
export const encryptWithAes = (message: string, aesKey: CryptoJS.lib.WordArray) => {
  const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
```



### 后端解密

```java
// 获取 AES 密钥
String headerRsa = request.getHeader(headerFlag);
// 解密 AES 密钥 （RAS解密）
String decryptAes = EncryptUtils.decryptByRsa(headerRsa, privateKey);
String aesPassword = EncryptUtils.decryptByBase64(decryptAes);
// 获取 加密内容
request.setCharacterEncoding(Constants.UTF8);
byte[] readBytes = IoUtil.readBytes(request.getInputStream(), false);
String requestBody = new String(readBytes, StandardCharsets.UTF_8);
// 解密内容 （用AES密钥解密）
String decryptBody = EncryptUtils.decryptByAes(requestBody, aesPassword);
```

后端解密主要由**hutool-crypto** 实现

```java
import cn.hutool.crypto.SecureUtil;  
    /**
     * AES解密
     *
     * @param data     待解密数据
     * @param password 秘钥字符串
     * @return 解密后字符串
     */
    public static String decryptByAes(String data, String password) {
        if (StrUtil.isBlank(password)) {
            throw new IllegalArgumentException("AES需要传入秘钥信息");
        }
        // aes算法的秘钥要求是16位、24位、32位
        int[] array = {16, 24, 32};
        if (!ArrayUtil.contains(array, password.length())) {
            throw new IllegalArgumentException("AES秘钥长度要求为16位、24位、32位");
        }
        return SecureUtil.aes(password.getBytes(StandardCharsets.UTF_8)).decryptStr(data, StandardCharsets.UTF_8);
    }
```



## 参考资料

https://blog.csdn.net/Michelle_Zhong/article/details/134018557
