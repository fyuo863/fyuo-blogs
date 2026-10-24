# 预测字幕 0.1.1

## 本地试用

```powershell
npm --prefix frontend ci
npm --prefix frontend run build
npm --prefix frontend run build:captions
npm --prefix frontend run preview:captions
```

用桌面 Chrome / Edge 打开 http://127.0.0.1:5188/p/predictive-captions 。

1. 选择中文或英文，点击“加载模型”。首次从 Hugging Face 下载 Whisper base 的配置、分词器和量化权重；需要可访问该模型站点。模型较大，下载进度按文件显示，不代表整体进度。
2. 就绪后选择麦克风或标签页音频，点击“开始”。选择共享音频时需勾选“分享标签页音频”；不同平台对屏幕/系统音频支持不同，无音轨会明确报错。
3. 黑色是识别字幕，带虚线下划线的灰色是预测；预测错误显示红色并划去，320 毫秒后换成实际字幕。减少动态效果设置下禁用闪烁动画，保留红色和划线。
4. 点击“停止”释放音轨、AudioContext 和推理 Worker。未显示的片段被舍弃，已经显示的文字保留。再次开始需要重新加载模型，已有缓存可复用。

## 实际实现与边界

- 推理：Transformers.js 4.3.0 + ONNX Runtime WASM，单线程 Worker，Whisper base q8；不需要 GPU、Python、后端或 API 密钥，也不使用可能依赖云端的 Web Speech API。
- 运行时 JS / WASM 全部随 ZIP 携带。WASM 拆成每个不超过 7 MiB 的二进制文件，加载时在内存重组，满足宿主每个文件 8 MiB 上限。
- 模型在首次使用时作为静态文件从 Hugging Face 下载（onnx-community/whisper-base），音频及字幕不发送到网络。模型缓存保存在浏览器 Cache Storage；清缓存、隐私模式或存储回收后仍需再次下载。页面本身仍需从网站加载，因此不等于离线安装的 PWA。
- 音频在 AudioWorklet 内以 16 kHz 采样，简单能量门限识别人声片段；约 650 毫秒静音或最长 6 秒提交一段。WASM 完成整段识别后逐字/词显示。设备慢时存在秒级延迟，积压超过两段会停止并报错，不默默丢弃后继续显示。
- 中文按字、英文按词预测，采用附带的小型四阶统计词表，并从本次已经显示的字幕学习；无需另一个大模型。未知上下文不预测，不能期待大模型的语义准确率。
- 预测只接收已显示的文字，不读取尚未显示的识别文本；但是它预测的是**下一个显示的字幕单元**，不保证提前于真实说话。对于已经识别完成、尚未逐字显示的片段，预测属于回放式验证。这是首版低资源方案的明确限制。
- 界面没有保存或上传录音。普通应用日志不打印音频及字幕。切换页面会清理捕获资源，侧栏缩略预览不会自动下载模型或打开音源。
- 浏览器本地运行依赖 WebAssembly、Worker、AudioWorklet、MediaDevices；推荐新版桌面 Chrome / Edge。未承诺手机性能或所有浏览器支持共享音频。

## 上传

产物：`frontend/plugin-packages/predictive-captions-0.1.1.zip`。在管理中心上传 ZIP 草稿，选择 0.1.1 发布，再访问 `/p/predictive-captions`。本次只构建，没有上传、发布或更新服务器。

### 主站麦克风策略（上线前需要）

现有 `nginx.conf` 公共域响应为 `microphone=()`，会阻止本插件的麦克风访问。仅上传 ZIP 无法覆盖服务器响应头。可在 nginx 的 http 配置范围加入如下 map，然后将公共域现有 Permissions-Policy 改为引用此变量；管理域保持禁用。使用 `$request_uri`，避免 SPA 内部重写到 index.html 后丢失路径。

```nginx
map $request_uri $caption_media_policy {
    default "camera=(), microphone=(), display-capture=(), geolocation=()";
    ~^/p/predictive-captions/?(?:\?|$) "camera=(), microphone=(self), display-capture=(self), geolocation=()";
}
# 公共域 server 内替换原有 Permissions-Policy；不要叠加两个冲突的同名头
add_header Permissions-Policy $caption_media_policy always;
```

先执行 nginx -t，成功后 reload 并验证响应头。必须直接打开字幕页或完整刷新；从其他页面通过 SPA 导航不会改变文档原有的权限策略。权限策略不能隔离同源 module 插件，因此仍仅应安装可信插件。上述配置本次未应用到服务器。

## 验证

- `node --test frontend/plugins/predictive-captions/prediction.test.js`
- `npm --prefix frontend run lint`
- `npm --prefix frontend run test:e2e -- predictive-captions.spec.js`
- Windows 实际模型测试：`$env:CAPTION_MODEL_TEST='1'; npm --prefix frontend run test:e2e -- predictive-captions.spec.js`

真实模型测试使用 Windows SAPI 合成的英文 WAV（内容：Hello. How are you today? Thank you for your help.），在 Chromium 中执行模型并断言转写内容；同时验证缓存后禁止 HTTPS 网络仍能再次推理。音源权限、预测红闪和清理另用可重复的浏览器模拟覆盖，不能把模拟测试称为实际系统音频权限验收。另使用 Windows Huihui 合成中文样本验证基础转写。合成样本不代表真实麦克风、口音和噪声下的准确率。

## 0.1.1 修正

- 麦克风启用回声消除、噪声抑制，关闭自动增益，避免把背景噪声持续放大。
- 分段要求至少 240 毫秒有效声音；静音、低电平噪声、直流偏置和短点击不送入模型。
- 增加解码重复惩罚和病态循环检测，整段异常输出丢弃，不将其改写成虚构字幕。连续填充音会被抑制，正常短重复保留。
- 改用稍大的 Whisper base q8；首次需重新下载模型，CPU 和内存需求高于 tiny。模型仍可能误识别；能量门限不是完整的人声分类器。
