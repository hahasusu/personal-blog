# docker 常用命令

docker 常用命令，主要包含镜像操作、容器操作等

## 镜像操作

```shell
# 查找镜像
docker search <keyword>
# 查看本机所有镜像
docker images
# 下载镜像（若不加版本号，则下载最新版）
docker pull <container:tag>
# 根据 id删除镜像
docker rmi <container_id>
# 根据名称删除镜像
docker rmi <container_name>
# 导出镜像
docker save -o [保存的目标文件名称] [镜像名称]
# 加载本地镜像
docker load -i nginx.tar
# 构建镜像 -dockerfile
docker build
```

## 容器操作
```shell
# 创建并运行容器：
docker run --name containerName -p XX:XX -d imageName:tag 
# -d：后台运行, -p80:80： 宿主机端口：容器端口
  
# 进入容器：
docker exec -it containerName bash
# -it : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互
# bash：进入容器后执行的命令，bash是一个linux终端交互命令

# 查看容器
docker inspect containerId
  
# 查看容器状态：
docker ps
# 查看所有容器，包括已经停止的
docker ps -a  	
 
# 查看容器日志：(加 -f 可以持续查看日志) 
docker logs   
 
# 容器开启
docker start
# 容器停止
docker stop
# 容器暂停
docker pause
# 容器继续
docker unpause
# 容器开启
docker restart
# 退出容器
exit
# 删除容器（容器必须是停止状态下）
docker rm 
# 强制删除容器
docker rm -f -v nginx
```

## 清理命令prune
官方文档 https://docs.docker.com/config/pruning/
```shell
# 清理虚悬镜像
docker image prune

WARNING! This will remove all dangling images.
Are you sure you want to continue? [y/N] y

```
```shell
# 清理未被使用的镜像
docker image prune -a

WARNING! This will remove all images without at least one container associated to them.
Are you sure you want to continue? [y/N] y

```

```shell
# 清理已停止的容器
docker container prune

WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y

```

## 文件拷贝

```shell
# 文件拷贝
docker cp src_path container_id:/dest_path

```

## 查看命令

输入 docker 可以查看docker命令

输入 docker command --help 查看具体命令的使用方法
如： docker cp --help
```shell
# docker

Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Common Commands:
  run         Create and run a new container from an image
  exec        Execute a command in a running container
  ps          List containers
  build       Build an image from a Dockerfile
  pull        Download an image from a registry
  push        Upload an image to a registry
  images      List images
  login       Log in to a registry
  logout      Log out from a registry
  search      Search Docker Hub for images
  version     Show the Docker version information
  info        Display system-wide information

Management Commands:
  builder     Manage builds
  buildx*     Docker Buildx
  compose*    Docker Compose
  container   Manage containers
  context     Manage contexts
  image       Manage images
  manifest    Manage Docker image manifests and manifest lists
  network     Manage networks
  plugin      Manage plugins
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Swarm Commands:
  swarm       Manage Swarm

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes

Global Options:
      --config string      Location of client config files (default "/root/.docker")
  -c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and default context set with "docker context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket to connect to
  -l, --log-level string   Set the logging level ("debug", "info", "warn", "error", "fatal") (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default "/root/.docker/ca.pem")
      --tlscert string     Path to TLS certificate file (default "/root/.docker/cert.pem")
      --tlskey string      Path to TLS key file (default "/root/.docker/key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Run 'docker COMMAND --help' for more information on a command.

For more help on how to use Docker, head to https://docs.docker.com/go/guides/
```