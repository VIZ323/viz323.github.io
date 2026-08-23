# 小蛙回家路 iOS

这是当前 H5 游戏的原生 iPhone 封装工程。游戏资源随 App 一起打包，无网络也可以运行；原有按住/松开操作、进度记录和音效保持不变，并通过 Swift 接入了 iPhone 原生触感反馈。

## 打开工程

1. 用 Xcode 打开 `FrogHome.xcodeproj`。
2. 选择 `FrogHome` Target → `Signing & Capabilities`。
3. 选择自己的 Apple Developer Team。
4. 如果 `com.viz323.froghome` 已被占用，将 Bundle Identifier 改成自己账号下唯一的值。
5. 连接 iPhone 或选择一个 iPhone 模拟器，点击运行。

工程当前配置：

- iPhone only
- iOS 16.0+
- 仅竖屏
- App 名称：小蛙回家路
- 版本：1.0.0（Build 1）
- 简体中文、繁体中文、英语、日语、韩语；自动跟随系统，也可在首页切换
- 无广告、无登录、无联网依赖
- 不跟踪、不收集用户数据

## 同步 H5 改动

根目录的 H5 是唯一开发源。每次修改后执行：

```bash
cd ios/FrogHome
./scripts/sync-web-assets.sh
```

脚本会更新 `FrogHome/Web`。提交 iOS 版本前应同时提交这份快照，确保归档内容可复现。

如果修改了 `AppStore/AppIconSource.svg`，执行 `./scripts/render-app-icon.sh` 重新生成 App Store 图标。

## 真机与归档

1. 用真机验证触摸蓄力、松手起跳、音效、触感、首次教程、本地最高纪录和落水重开。
2. Xcode 菜单选择 `Product` → `Archive`。
3. 在 Organizer 中选择 `Distribute App` → `App Store Connect` → `Upload`。
4. 等待构建处理完成后，到 App Store Connect 为 1.0.0 选择该 Build。

上传前必须递增 Build 号。同一版本的新构建依次使用 2、3、4……；发布功能更新时再修改 Marketing Version。

## App Store Connect

逐项操作见 [`APP_STORE_CHECKLIST.md`](./APP_STORE_CHECKLIST.md)，五种语言的商店文案草稿见 [`AppStore`](./AppStore)。

当前版本没有接入广告或统计 SDK，因此隐私清单和 App Store 隐私回答均按“不收集数据”准备。如果以后加入穿山甲、优量汇、AdMob、登录、云存档或统计，必须先重新核对 SDK 隐私清单、跟踪授权、隐私政策和 App Store 隐私回答，不能直接沿用当前声明。

## 审核注意

工程不是远程网页入口：完整游戏离线打包，具备持续可玩的无尽玩法、本地进度、音效和原生触感。但 App Review 仍会依据 4.2 Minimum Functionality 判断娱乐价值和完成度，上架前应至少完成一轮真机 TestFlight 测试、正式截图和稳定性检查。
