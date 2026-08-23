# App Store 上架清单

## 1. 开发者账号

- [ ] Apple Developer Program 会员有效。
- [ ] App Store Connect 的 Agreements、Tax and Banking 没有待处理项目。
- [ ] 在 Certificates, Identifiers & Profiles 创建唯一 App ID，并与 Xcode 的 Bundle Identifier 一致。
- [ ] 在 App Store Connect 新建 iOS App，SKU 可填写 `frog-home-ios-001`。

## 2. Xcode 工程

- [ ] 选择正确的 Team，自动签名无报错。
- [ ] Bundle Identifier 与 App Store Connect 记录完全一致。
- [ ] App 图标、显示名称、版本号和 Build 号正确。
- [ ] Release 真机游玩无白屏、无卡死、无网络依赖。
- [ ] `Product` → `Archive` 成功，并通过 Organizer 验证、上传。

## 3. 商店信息

- [ ] 使用 `AppStore/zh-Hans.md` 填写简体中文名称、副标题、关键词、描述。
- [ ] 使用 `AppStore/en-US.md` 添加英语本地化；如果暂不做英文版游戏界面，截图和说明不要误导用户。
- [ ] 分类建议：主分类 Games，子分类 Casual。
- [ ] 填写版权信息、支持 URL 和隐私政策 URL。
- [ ] 完成内容版权、年龄分级和出口合规问卷。
- [ ] 上传 1–10 张无透明通道的 iPhone 截图；优先准备当前要求的最大 iPhone 竖屏规格。
- [ ] 审核备注写明：游戏离线运行；操作是按住蓄力、松开起跳；没有账号和付费墙。

建议 URL：

- 支持页：`https://viz323.github.io/support.html`
- 隐私政策：`https://viz323.github.io/privacy.html`

提交前务必在无登录状态的浏览器中打开这两个 URL，确认已公开可访问。

## 4. 隐私

- [ ] 当前无广告、无统计、无服务端，因此 App Privacy 选择“No, we do not collect data from this app”。
- [ ] 填写公开可访问的隐私政策 URL。
- [ ] 确认归档内含 `PrivacyInfo.xcprivacy`。
- [ ] 若后来加入任何第三方 SDK，重新扫描其收集、跟踪和 Required Reason API 声明。

## 5. 全球发布

- [ ] App Store Connect → Pricing and Availability → App Availability。
- [ ] 选择 `All Countries or Regions`，并确认未来新增地区也自动可用。
- [ ] 首发建议选择手动发布，审核通过后再决定统一上线时间。
- [ ] 若 App 免费，价格设为 Free；若改为付费，先完成 Paid Apps Agreement。
- [ ] 检查个别地区因法规产生的额外合规提示；“全部地区”并不绕过当地法律要求。

Apple 当前支持在 175 个国家或地区发布；实际数字和界面可能调整，提交时以 App Store Connect 显示为准。

重要例外：

- 中国大陆：游戏需要向 Apple 提交国家新闻出版署核发的网络游戏出版物号及证明文件，适用时还需要有效 ICP 备案信息。没有这些材料时，可以先发布其他地区，但中国大陆会显示不可用。
- 越南：Apple 明确提示游戏在当地分发需要相应许可；按 App Store Connect 的合规提示提交材料，否则先取消该地区。
- 其他地区：根据账号主体、定价和内容，可能出现税务、交易者身份、年龄分级或当地许可提示，应逐项完成后再确认可用状态。

## 6. TestFlight 与审核

- [ ] 先邀请内部测试，至少覆盖一台刘海屏和一台较小屏幕 iPhone。
- [ ] 测试首次安装、后台切回、来电/音频中断、连续游玩 10 分钟和重新安装。
- [ ] 检查首页、教程、结算弹窗、最高纪录、音效开关与安全区。
- [ ] 选择已上传 Build，完成所有必填项后 Add for Review → Submit for Review。
- [ ] 保存审核截图和问题记录；若被拒，先针对具体条款修复，不要只在备注里争辩。

## 官方参考

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [管理 App 的国家或地区可用性](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store)
- [上传构建](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds)
- [管理 App 隐私](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- [截图规格](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
