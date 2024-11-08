import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Mou's Notes",
    description: "A VitePress Site",
    head: [["link", { rel: "icon", type: "image/svg", href: "/logo.svg" }]],
    srcDir: "./src",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: "/logo.svg",
      nav: [
        { text: "Home", link: "/" },
        {
          text: "Dev",
          link: "/dev/postgresql_backup_restore",
          activeMatch: "/dev/",
        },
        { text: "Docker", link: "/docker/vitepress", activeMatch: "/docker/" },
        { text: "Examples", link: "/markdown-examples" },
      ],
      outline: {
        level: "deep",
        label: "页面导航",
      },
      sidebar: {
        "/docker/": [
          {
            text: "Docker 安装",
            items: [
              { text: "CentOS 安装 Docker ", link: "/docker/install_centos" },
            ],
          },
          {
            text: "Docker 使用",
            items: [
              { text: "Docker 常用命令", link: "/docker/command" },
              { text: "Docker Dockerfile", link: "/docker/docker_file" },
              { text: "Docker Compose", link: "/docker/compose" },
            ],
          },
          {
            text: "Docker 实例",
            items: [
              { text: "Docker 安装 VitePress", link: "/docker/vitepress" },
              { text: "Docker 安装 PostGIS", link: "/docker/postgis" },
              { text: "Docker 安装 Minio", link: "/docker/minio" },
              { text: "Docker 安装 Nginx", link: "/docker/nginx" },
              { text: "Docker 安装 CentOS", link: "/docker/centos" },
              { text: "Docker 安装 GeoServer", link: "/docker/geoserver" },
              { text: "Docker 安装 kafka", link: "/docker/kafka" },
              { text: "Docker 安装 elastricsearch", link: "/docker/elastricsearch" },
              { text: "Docker 安装 elk", link: "/docker/docker_elk" },
            ],
          },
        ],
        "/dev/": [
          {
            text: "开发技术",
            items: [
              {
                text: "python 实现批量导出PDF ",
                link: "/dev/python_batch_export",
              },
              { text: "linux 安装nodejs环境 ", link: "/dev/linux_nodejs" },
              { text: "maven 配置本地jar ", link: "/dev/maven_local_jar" },
              { text: "spring cache 使用", link: "/dev/springcache" },
              { text: "cookie和session简单示例", link: "/dev/cookie_session" },
            ],
          },
          {
            text: "开发框架",
            items: [
              { text: "ruoyi-vue-plus 登录流程 ", link: "/dev/ruoyi_login" },
              { text: "ruoyi-vue-plus 缓存 ", link: "/dev/ruoyi_cache" },
              { text: "ruoyi-vue-plus 加密传输 ", link: "/dev/ruoyi_crypt" },
              { text: "ruoyi-vue-plus POJO转换 ", link: "/dev/ruoyi_pojo" },
            ],
          },
          {
            text: "数据库",
            items: [
              {
                text: "postgreSQL 备份及还原 ",
                link: "/dev/postgresql_backup_restore",
              },
              {
                text: "oracle     备份及还原 ",
                link: "/dev/oracle_backup_restore",
              },
              {
                text: "oracle 创建SDE空间库 ",
                link: "/dev/oracle_sde",
              },
            ],
          },
        ],
      },
      footer: {
        message:
          '备案号：<a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2023003331号</a>',
        copyright: "Copyright © 2019-2024 Mou",
      },
      search: {
        provider: "local",
      },
      socialLinks: [
        { icon: "github", link: "https://github.com/vuejs/vitepress" },
      ],
    },
    mermaid: {},
  })
);
