@echo off
echo 手动打包焊机操作控制应用...
echo.

REM 创建输出目录
if not exist "dist" mkdir dist
if not exist "dist\app" mkdir dist\app

REM 复制应用文件
echo 复制应用文件...
copy main.js dist\app\
copy welding-control.html dist\app\
copy welding-machine.png dist\app\
copy package.json dist\app\

REM 复制 node_modules 中的 electron
echo 复制 Electron...
xcopy /E /I node_modules\electron\dist dist\electron

REM 创建启动脚本
echo 创建启动脚本...
echo @echo off > dist\焊机操作控制.bat
echo start "" "electron\electron.exe" "app" >> dist\焊机操作控制.bat

echo.
echo 打包完成！输出目录: dist\
echo 运行 dist\焊机操作控制.bat 启动应用
pause
