@echo off
echo 设置 Electron 镜像环境变量

set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_CUSTOM_DIR={{ version }}

echo 使用国内镜像: %ELECTRON_MIRROR%
echo 开始构建...

npm run pack

pause 