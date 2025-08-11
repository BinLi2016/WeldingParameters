@echo off
echo 设置代理环境变量
echo 请修改下面的代理地址为您的实际代理服务器地址

set HTTP_PROXY=http://your-proxy-server:port
set HTTPS_PROXY=http://your-proxy-server:port
set ELECTRON_GET_USE_PROXY=true

echo 代理已设置，现在可以运行构建命令
echo npm run pack
pause 