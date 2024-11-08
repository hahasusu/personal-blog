import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.BE4fazHS.js";const c=JSON.parse('{"title":"docker 安装 postgis","description":"","frontmatter":{},"headers":[],"relativePath":"docker/postgis.md","filePath":"docker/postgis.md"}'),t={name:"docker/postgis.md"},l=n(`<h1 id="docker-安装-postgis" tabindex="-1">docker 安装 postgis <a class="header-anchor" href="#docker-安装-postgis" aria-label="Permalink to &quot;docker 安装 postgis&quot;">​</a></h1><p>安装和配置postgis/postgreSQL</p><h2 id="运行容器" tabindex="-1">运行容器 <a class="header-anchor" href="#运行容器" aria-label="Permalink to &quot;运行容器&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 对外避免使用默认5432端口，建议使用复杂密码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgis</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --privileged</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -e</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> POSTGRES_PASSWORD=YOU_PASSWORD</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 54321:5432</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /root/docker/postgresql/data:/var/lib/postgresql/data</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgis/postgis:16-3.4</span></span></code></pre></div><h2 id="进入容器" tabindex="-1">进入容器 <a class="header-anchor" href="#进入容器" aria-label="Permalink to &quot;进入容器&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 退出</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span></span></code></pre></div><h2 id="数据库操作" tabindex="-1">数据库操作 <a class="header-anchor" href="#数据库操作" aria-label="Permalink to &quot;数据库操作&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换至postgres用户</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">su</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgres</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入psql</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">psql</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查询所有数据库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\l</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 修改postgres 密码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ALTER</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> USER</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgres</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> WITH</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> PASSWORD</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;YOU_NEW_PASSWORD&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 退出</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span></span></code></pre></div>`,8),e=[l];function p(h,k,r,d,o,F){return a(),i("div",null,e)}const C=s(t,[["render",p]]);export{c as __pageData,C as default};