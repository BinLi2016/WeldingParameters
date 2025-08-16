# 焊接参数管理器 - 构建说明

## 构建命令

### 开发模式
```bash
# 启动开发模式
npm run dev

# 启动测试模式
npm run test
```

### 打包应用程序（不创建安装程序）
```bash
# 打包当前平台
npm run pack

# 打包 Windows 版本
npm run pack:win

# 打包 macOS 版本
npm run pack:mac

# 打包 Linux 版本
npm run pack:linux
```

### 构建安装程序
```bash
# 构建当前平台安装程序
npm run build

# 构建 Windows 安装程序
npm run build:win

# 构建 macOS 安装程序
npm run build:mac

# 构建 Linux 安装程序
npm run build:linux

# 构建所有平台安装程序（不发布）
npm run dist
```

## 构建输出

- **打包版本**: 输出到 `dist/win-unpacked/` 目录，包含可执行文件
- **安装程序**: 输出到 `dist/` 目录，包含安装程序文件

### 快速启动
运行 `run-app.bat` 可以直接启动已构建的应用程序

### Windows 构建输出
- `焊接参数管理器 Setup.exe` - NSIS 安装程序
- `焊接参数管理器.exe` - 便携版可执行文件

### macOS 构建输出
- `焊接参数管理器.dmg` - DMG 安装包

### Linux 构建输出
- `焊接参数管理器.AppImage` - AppImage 可执行文件

## 注意事项

1. **Windows 构建**: 需要在 Windows 系统上进行
2. **macOS 构建**: 需要在 macOS 系统上进行
3. **Linux 构建**: 需要在 Linux 系统上进行
4. **图标文件**: 确保 `welding-machine.png` 文件存在且格式正确

## 构建配置

构建配置在 `package.json` 的 `build` 部分，包括：
- 应用程序 ID 和名称
- 包含的文件列表
- 各平台的构建目标
- 安装程序配置 