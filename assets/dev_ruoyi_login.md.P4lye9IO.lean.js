import{_ as l,E as s,c as A,b as t,w as a,a5 as i,m as e,a as r,o,J as n}from"./chunks/framework.BE4fazHS.js";const f=JSON.parse('{"title":"ruoyi-vue-plus 源码分析之登录流程","description":"","frontmatter":{},"headers":[],"relativePath":"dev/ruoyi_login.md","filePath":"dev/ruoyi_login.md"}'),d={name:"dev/ruoyi_login.md"},c=e("h1",{id:"ruoyi-vue-plus-源码分析之登录流程",tabindex:"-1"},[r("ruoyi-vue-plus 源码分析之登录流程 "),e("a",{class:"header-anchor",href:"#ruoyi-vue-plus-源码分析之登录流程","aria-label":'Permalink to "ruoyi-vue-plus 源码分析之登录流程"'},"​")],-1),B=e("h2",{id:"流程图",tabindex:"-1"},[r("流程图 "),e("a",{class:"header-anchor",href:"#流程图","aria-label":'Permalink to "流程图"'},"​")],-1),u=e("h2",{id:"",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#","aria-label":'Permalink to ""'},"​")],-1);function h(p,g,m,_,b,C){const E=s("Mermaid");return o(),A("div",null,[c,B,(o(),t(i,null,{default:a(()=>[n(E,{id:"mermaid-6",class:"mermaid",graph:"flowchart%20TD%0A%20%20%20%20%20%20%20%20subgraph%20AuthController%0A%09%09A%5B%22login%3Cbr%2F%3E%E7%99%BB%E5%BD%95%22%5D--%3EB(%22clientService.queryByClientId%3Cbr%2F%3E%E6%95%88%E9%AA%8C%E5%AE%A2%E6%88%B7%E7%AB%AFID%22)%0A%09%09B--%3EC(%22loginService.checkTenant%3Cbr%2F%3E%E6%95%88%E9%AA%8C%E7%A7%9F%E6%88%B7%22)%0A%09%09C--%3ED(%22IAuthStrategy.login%3Cbr%2F%3E%E7%99%BB%E5%BD%95%E6%8E%A5%E5%8F%A3%22)%0A%09%09end%0A%09%09subgraph%20PasswordAuthStrategy%0A%09%09D--%3EE(%22PasswordAuthStrategy.login%3Cbr%2F%3E%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E5%AE%9E%E7%8E%B0%22)%0A%09%09E--%3EF(%22validateCaptcha%3Cbr%2F%3E%E9%AA%8C%E8%AF%81%E7%A0%81%22)%0A%09%09end%0A%09%09subgraph%20SysLoginService%0A%09%09F--%3EG(%22checkLogin%3Cbr%2F%3E%E7%99%BB%E5%BD%95%22)%0A%09%09G-.-%3EH(%22recordLogininfor%3Cbr%2F%3E%E8%AE%B0%E5%BD%95%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF%22)%0A%09%09H--%3EI(%22buildLoginUser%3Cbr%2F%3E%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%22)%0A%09%09end%0A%09%09%0A%09%09subgraph%20LoginHelper%0A%09%09I--%3EM(%22LoginHelper.login%22)%0A%09%09M-.-%3EN(%22StpUtil.login%3Cbr%2F%3E%E8%B0%83%E7%94%A8satoken%E7%99%BB%E5%BD%95%22)%0A%09%09end%0A"})]),fallback:a(()=>[r(" Loading... ")]),_:1})),u,(o(),t(i,null,{default:a(()=>[n(E,{id:"mermaid-11",class:"mermaid",graph:"flowchart%20LR%0A%20%20Start%20--%3E%20Stop%0A"})]),fallback:a(()=>[r(" Loading... ")]),_:1}))])}const v=l(d,[["render",h]]);export{f as __pageData,v as default};
