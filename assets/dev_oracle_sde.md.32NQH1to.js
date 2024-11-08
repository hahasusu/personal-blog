import{_ as a,c as s,o as e,a4 as t}from"./chunks/framework.BE4fazHS.js";const u=JSON.parse('{"title":"在oracle中创建SDE空间库","description":"","frontmatter":{},"headers":[],"relativePath":"dev/oracle_sde.md","filePath":"dev/oracle_sde.md"}'),i={name:"dev/oracle_sde.md"},l=t(`<h1 id="在oracle中创建sde空间库" tabindex="-1">在oracle中创建SDE空间库 <a class="header-anchor" href="#在oracle中创建sde空间库" aria-label="Permalink to &quot;在oracle中创建SDE空间库&quot;">​</a></h1><h2 id="配置oracle-32位客户端" tabindex="-1">配置ORACLE 32位客户端 <a class="header-anchor" href="#配置oracle-32位客户端" aria-label="Permalink to &quot;配置ORACLE 32位客户端&quot;">​</a></h2><p>ArcMap是32位程序；所以连接oracle时，本机必须安装oracle 32位客户端，简便起见，直接<a href="https://www.oracle.com/technetwork/cn/database/features/instant-client/index-092699-zhs.html" target="_blank" rel="noreferrer">官网</a>下载oracle instant client，进行配置便可。</p><p>下载解压到文件夹如C:\\instantclient_12_1，然后在Path变量中新增该文件夹路径。</p><h2 id="创建sde空间库" tabindex="-1">创建SDE空间库 <a class="header-anchor" href="#创建sde空间库" aria-label="Permalink to &quot;创建SDE空间库&quot;">​</a></h2><p>在ArcGIS中选择Create Enterprise Geodatabase工具：</p><p><img src="https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226142549.png" alt=""></p><p>输入相关信息后开始创建：</p><p><img src="https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226143229.png" alt=""></p><p>绿色部分提示如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>The ST_Geometry shape library path may be invalid, or the EXTPROC is not configured correctly in the Oracle instance. [ (Unable to determine current version of ST_SHAPELIB. Please check the ST_Geometry shape library path on the Oracle server, which is set to &quot;c:\\progra~2\\arcgis\\desktop10.3\\DatabaseSupport\\Oracle\\Windows64\\st_shapelib.dll&quot;. Refer to the ArcGIS help topics for more details.</span></span>
<span class="line"><span>)]</span></span></code></pre></div><p>意思是<strong>ST_Geometry shape library</strong>路径可能不正确。</p><blockquote><p>如果创建出错，尝试将instance 项设置成 <strong>localhost:1521/orcl</strong></p></blockquote><h3 id="配置st-shapelib路径" tabindex="-1">配置ST_SHAPELIB路径 <a class="header-anchor" href="#配置st-shapelib路径" aria-label="Permalink to &quot;配置ST_SHAPELIB路径&quot;">​</a></h3><p>登录<strong>sde</strong>用户，在sqlplus 或者sql developer中里执行以下语句查看</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">select</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dba_libraries </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> library_name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ST_SHAPELIB&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p><img src="https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190226144410.png" alt=""></p><p>看到默认路径和实际路径不一致，执行以下语句，将ST_SHAPELIB变量修改为正确位置：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> or</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> replace</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> library ST_SHAPELIB  </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;C:\\Program Files (x86)\\ArcGIS\\Desktop10.3\\DatabaseSupport\\Oracle\\Windows64\\st_shapelib.dll&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="配置orcle-extproc代理" tabindex="-1">配置ORCLE EXTPROC代理 <a class="header-anchor" href="#配置orcle-extproc代理" aria-label="Permalink to &quot;配置ORCLE EXTPROC代理&quot;">​</a></h3><p>1、打开<strong>ORACLE_HOME\\product\\12.1.0\\dbhome_1\\NETWORK\\ADMIN</strong>目录下的 listener.ora 文件，原配置文件为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>(ENVS = &quot;EXTPROC_DLLS=ONLY:c:\\oracle\\product\\12.1.0\\dbhome_1\\bin\\oraclr12.dll&quot;)</span></span></code></pre></div><p>修改为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>(ENVS = &quot;EXTPROC_DLLS=ANY&quot;)</span></span></code></pre></div><p>2、打开<strong>ORACLE_HOME\\product\\11.2.0\\dbhome_1\\hs\\admin</strong> 目录下的 extproc.ora文件，</p><p>将最后一行的SET EXTPROC_DLLS= 修改为 SET EXTPROC_DLLS=ANY</p><p>3、重启 OracleOraDb11g_home1TNSListener服务和 OracleServiceORCL服务。</p><h2 id="删除sde空间库" tabindex="-1">删除SDE空间库 <a class="header-anchor" href="#删除sde空间库" aria-label="Permalink to &quot;删除SDE空间库&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 用户名和表空间均sde</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">drop</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> user</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> sde cascade</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">drop</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">space sde including contents </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">and</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> datafiles;</span></span></code></pre></div><h2 id="sde使用" tabindex="-1">SDE使用 <a class="header-anchor" href="#sde使用" aria-label="Permalink to &quot;SDE使用&quot;">​</a></h2><p>在catalog中，Database Connections 下点击Add Database Connection 实例名填写 <strong>localhost:1521/orcl</strong></p><p><img src="https://mou-ali-oss.oss-cn-hangzhou.aliyuncs.com/hexo/20190228094152.png" alt=""></p><ul><li><a href="https://malagis.com/arcgis-10-2-operate-video-12.html" target="_blank" rel="noreferrer">ArcGIS 10.2操作入门视频教程（12）ArcSDE基本知识</a></li><li><a href="https://malagis.com/arcgis-10-2-operate-video-13.html" target="_blank" rel="noreferrer">ArcGIS 10.2操作入门视频教程（13）ArcSDE版本管理</a></li></ul><h2 id="sde版本控制及原理" tabindex="-1">SDE版本控制及原理 <a class="header-anchor" href="#sde版本控制及原理" aria-label="Permalink to &quot;SDE版本控制及原理&quot;">​</a></h2><p>数据集（要素类、要素数据集或表）注册为版本后，数据库中将会创建两个增量表：用于插入和更新的 A（添加）表以及用于删除的 D（删除）表。每次更新或删除数据集中的记录时，都会向这两个表或其中一个表添加行。</p><p>如：我在数据库中新建了一个Line要素类，然后将其注册为版本后，数据库中出现了如下两个表：a8,D8，8代表该要素类在[table_registry]表中的数据集的ID。</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><p><a href="http://desktop.arcgis.com/zh-cn/arcmap/10.3/manage-data/gdbs-in-oracle/connect-oracle.htm" target="_blank" rel="noreferrer">http://desktop.arcgis.com/zh-cn/arcmap/10.3/manage-data/gdbs-in-oracle/connect-oracle.htm</a></p></li><li><p><a href="https://blog.csdn.net/kone0611/article/details/78503384" target="_blank" rel="noreferrer">ORALCE SDE GEOMETRY SHAPE LIBRARY 路径问题</a></p></li><li><p><a href="https://www.cnblogs.com/wmm15738807386/p/6722994.html" target="_blank" rel="noreferrer">ORA-28595: Extproc 代理: DLL 路径无效解决办法</a></p></li><li><p><a href="https://blog.csdn.net/kone0611/article/details/50259599" target="_blank" rel="noreferrer">ArcGIS SDE数据库版本控制的总结</a></p></li></ul>`,38),r=[l];function n(o,p,h,c,d,k){return e(),s("div",null,r)}const E=a(i,[["render",n]]);export{u as __pageData,E as default};
