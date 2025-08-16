@echo off
echo =====================================
echo    焊接应用程序依赖安装
echo =====================================
echo.

echo 安装焊接参数管理器依赖...
cd welding-parameter-manager
call npm install
if %errorlevel% neq 0 (
    echo 焊接参数管理器依赖安装失败!
    pause
    exit /b 1
)
cd ..

echo.
echo 安装焊机操作控制依赖...
cd welding-control
call npm install
if %errorlevel% neq 0 (
    echo 焊机操作控制依赖安装失败!
    pause
    exit /b 1
)
cd ..

echo.
echo 所有依赖安装完成!
echo 现在可以使用 launch-apps.bat 启动应用程序。
pause
