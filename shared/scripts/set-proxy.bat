@echo off
echo 设置代理环境变量
echo 设置代理为: http://127.0.0.1:10809

set HTTP_PROXY=http://127.0.0.1:10809
set HTTPS_PROXY=http://127.0.0.1:10809
npm config set proxy http://127.0.0.1:10809
npm config set https-proxy http://127.0.0.1:10809
set ELECTRON_GET_USE_PROXY=true

echo 代理已设置，现在可以运行构建命令
echo npm run pack
pause 