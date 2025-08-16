@echo off
echo =====================================
echo    焊接应用程序启动器
echo =====================================
echo.
echo 请选择要启动的应用程序:
echo.
echo 1. 焊接参数管理器 (Welding Parameter Manager)
echo 2. 焊机操作控制 (Welding Control)
echo 3. 退出
echo.
set /p choice=请输入选择 (1-3): 

if "%choice%"=="1" (
    echo.
    echo 启动焊接参数管理器...
    cd welding-parameter-manager
    call run-app.bat
    cd ..
) else if "%choice%"=="2" (
    echo.
    echo 启动焊机操作控制...
    cd welding-control
    call run-app.bat
    cd ..
) else if "%choice%"=="3" (
    echo 退出...
    exit
) else (
    echo 无效选择，请重新运行。
    pause
)
