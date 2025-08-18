@echo off
echo 启动焊接参数管理器...
echo.

if exist "dist\win-unpacked\焊接参数管理器.exe" (
    echo 找到应用程序，正在启动...
    start "" "dist\win-unpacked\焊接参数管理器.exe"
) else (
    echo 错误：找不到应用程序文件
    echo 请先运行 npm run pack 来构建应用程序
)

pause 