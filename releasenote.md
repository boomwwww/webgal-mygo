## 发布日志

**本仓库发布源代码，并在 Release 中附带 WebGAL 引擎网页版压缩包。**

**如果你想要体验使用便捷的图形化编辑器创建、制作并实时预览 WebGAL 游戏，请 [下载 WebGAL 图形化编辑器](https://github.com/OpenWebGAL/WebGAL_Terre/releases)。**

### 在此版本中

#### 新功能

新增流程图功能。玩家可以在菜单或底部控制栏查看已解锁的剧情节点，并跳转回已解锁的场景。

流程图支持多条线路、节点解锁记录和未解锁节点显示控制，重置游戏数据时会一并清理流程图进度。

优化编辑器实时预览。调整背景、立绘、Spine、Live2D 和特效时，预览定位与实际画面更一致，快速切换预览目标时同步结果更稳定。

优化读档、回到流程图节点和自动继续时的画面与声音恢复，减少状态不一致。

#### 修复

修复打开 Backlog 后自动播放仍可能继续推进的问题。

修复播放 Backlog 语音时，多个回想语音或当前游戏语音可能同时播放的问题。

修复视频播放失败时流程可能卡住，以及 skipOff 视频仍可被双击跳过的问题。

修复 next 连续执行中接场景跳转时，后续流程可能失效的问题。

修复场景跳转目标异常时可能加载无效场景文件的问题。

修复 bgm:none 无法正确停止背景音乐的问题。

修复 changeBg / changeFigure / setTransform 的变换参数为空或格式异常时，动画表现可能不正确的问题。

修复自定义文本框模板中的已读文本样式部分不生效的问题。

修复脚本注释包含多个分号时后续内容丢失的问题。

修复资源预加载可能重复处理同一资源，或包含无效空路径资源的问题。

<!-- English Translation -->
## Release Notes

**This repository releases source code and includes a WebGAL engine web package in each Release.**

**If you want to create, edit, and preview WebGAL games with a graphical editor, please [download the WebGAL graphical editor](https://github.com/OpenWebGAL/WebGAL_Terre/releases).**

### In this version

#### New Features

Added the flowchart feature. Players can view unlocked story nodes from the menu or bottom control panel and jump back to unlocked scenes.

Flowcharts support multiple routes, node unlock progress, and locked-node visibility controls; resetting game data now also clears flowchart progress.

Improved editor live preview. When adjusting backgrounds, figures, Spine, Live2D, and effects, preview positioning is closer to the actual screen, and synchronization is more stable when switching preview targets quickly.

Improved screen and audio restoration after loading saves, returning to flowchart nodes, or continuing automatically, reducing state mismatches.

#### Fixes

Fixed autoplay possibly continuing after opening the Backlog.

Fixed multiple backlog voices, or backlog voice and current game voice, playing at the same time.

Fixed video playback failures possibly blocking progress, and fixed skipOff videos still being skippable by double-clicking.

Fixed follow-up flow possibly failing when a next chain leads into a scene jump.

Fixed abnormal scene jump targets possibly loading invalid scene files.

Fixed bgm:none not stopping background music correctly.

Fixed incorrect animation behavior when changeBg / changeFigure / setTransform receive empty or malformed transform arguments.

Fixed some read-text styles in custom textbox templates not taking effect.

Fixed script comments losing content after additional semicolons.

Fixed resource preloading possibly processing the same resource repeatedly or including invalid empty resource paths.

<!-- Japanese Translation -->
## リリースノート

**このリポジトリではソースコードを公開し、Release には WebGAL エンジンの Web 版パッケージも同梱しています。**

**グラフィカルエディターで WebGAL ゲームを作成、編集、リアルタイムプレビューしたい場合は、[WebGAL グラフィカルエディターをダウンロードしてください](https://github.com/OpenWebGAL/WebGAL_Terre/releases)。**

### このバージョンについて

#### 新機能

フローチャート機能を追加しました。プレイヤーはメニューまたは下部コントロールから解放済みのストーリーノードを確認し、解放済みのシーンへ戻れるようになります。

フローチャートは複数ルート、ノード解放状態、未解放ノードの表示制御に対応しました。ゲームデータをリセットすると、フローチャートの進行状況も一緒に削除されます。

エディターのリアルタイムプレビューを改善しました。背景、立ち絵、Spine、Live2D、エフェクトを調整する際、プレビュー上の位置が実際の画面により近くなり、プレビュー対象を素早く切り替えた時の同期も安定しました。

ロード、フローチャートノードへの復帰、自動継続時の画面と音声の復元を改善し、状態のずれを減らしました。

#### 修正

バックログを開いた後もオート再生が進み続ける場合がある問題を修正しました。

バックログ音声が複数同時に再生されたり、ゲーム内の現在のボイスと重なって再生されたりする問題を修正しました。

動画の再生に失敗した時に進行が止まる場合がある問題と、skipOff の動画をダブルクリックでスキップできてしまう問題を修正しました。

next の連続実行中にシーン移動が続くと、その後の進行が失敗する場合がある問題を修正しました。

異常なシーン移動先によって無効なシーンファイルが読み込まれる場合がある問題を修正しました。

bgm:none で BGM が正しく停止しない問題を修正しました。

changeBg / changeFigure / setTransform の変換引数が空、または不正な形式の場合に、アニメーション表示が正しくならない問題を修正しました。

カスタムテキストボックステンプレートの既読テキストスタイルが一部反映されない問題を修正しました。

スクリプトコメントに複数のセミコロンが含まれると、後続の内容が失われる問題を修正しました。

リソースのプリロードで同じリソースが重複処理されたり、無効な空パスのリソースが含まれたりする問題を修正しました。
