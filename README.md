# 焊接参数管理系统 (Welding Parameters Management System)

此项目包含两个独立的焊接应用程序：

## 项目结构

```
WeldingParameters/
├── welding-parameter-manager/    # 焊接参数管理器
│   ├── package.json             # 参数管理器的依赖配置
│   ├── main.js                  # 主进程文件
│   ├── index.html               # 用户界面
│   ├── renderer.js              # 渲染进程脚本
│   ├── styles.css               # 样式文件
│   ├── welding_config.json      # 焊接配置
│   ├── welding-machine.png      # 应用图标
│   ├── manifest.json            # 清单文件
│   └── run-app.bat              # 启动脚本
├── welding-control/              # 焊机操作控制
│   ├── package.json             # 控制器的依赖配置
│   ├── main.js                  # 主进程文件
│   ├── welding-control.html     # 控制界面
│   ├── welding-machine.png      # 应用图标
│   └── run-app.bat              # 启动脚本
├── shared/                       # 共享资源
│   ├── scripts/                 # 共享脚本
│   │   ├── build-with-mirror.bat
│   │   ├── set-proxy.bat
│   │   └── BUILD.md
│   └── welding-machine.png      # 共享图标
├── GUI/                         # 原始文件 (待清理)
├── Robot.py                     # 机器人控制脚本
├── launch-apps.bat              # 应用选择启动器
└── setup-apps.bat               # 依赖安装脚本
```

## 应用程序说明

### 1. 焊接参数管理器 (Welding Parameter Manager)
- **功能**: 管理和配置焊接参数
- **文件**: `welding-parameter-manager/` 目录
- **启动**: 使用 `welding-parameter-manager/run-app.bat` 或主启动器

### 2. 焊机操作控制 (Welding Control)
- **功能**: 实时控制焊接机器操作
- **文件**: `welding-control/` 目录  
- **启动**: 使用 `welding-control/run-app.bat` 或主启动器

## 快速开始

### 1. 安装依赖
```bash
# 方式一：使用自动安装脚本
setup-apps.bat

# 方式二：手动安装
cd welding-parameter-manager
npm install
cd ../welding-control  
npm install
```

### 2. 启动应用
```bash
# 使用主启动器选择应用
launch-apps.bat

# 或直接启动特定应用
cd welding-parameter-manager
npm start

cd welding-control
npm start
```

## 开发说明

### 独立开发
每个应用现在都是独立的：
- 独立的 `package.json` 和依赖
- 独立的构建配置
- 独立的版本控制
- 独立的部署

### 构建应用
```bash
# 构建焊接参数管理器
cd welding-parameter-manager
npm run build

# 构建焊机操作控制
cd welding-control  
npm run build
```

### 共享资源
公共脚本和资源放在 `shared/` 目录中，避免重复。

## 重组优势

1. **更好的源代码控制**: 每个应用可以独立管理版本
2. **独立打包**: 可以单独构建和分发每个应用
3. **清晰的依赖管理**: 避免依赖冲突
4. **易于维护**: 关注点分离
5. **可扩展性**: 便于添加新的应用程序

## 迁移说明

原始的 `GUI/` 文件夹仍然保留，但应用文件已复制到新的结构中。确认新结构工作正常后，可以删除 `GUI/` 文件夹。
