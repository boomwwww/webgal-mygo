## 发布日志

**本仓库发布源代码，并在 Release 中附带 WebGAL 引擎网页版压缩包。**

**如果你想要体验使用便捷的图形化编辑器创建、制作并实时预览 WebGAL 游戏，请 [下载 WebGAL 图形化编辑器](https://github.com/OpenWebGAL/WebGAL_Terre/releases)。**

### 在此版本中

#### 新功能

新增流程图功能。玩家可以在菜单或底部控制栏查看已解锁的剧情节点，并跳转回已解锁的场景。流程图支持多条线路、节点解锁记录和未解锁节点显示控制，重置游戏数据时会一并清理流程图进度。

优化编辑器实时预览，提升场景跳转和状态同步的稳定性，并支持调试变量、模板刷新和更多界面预览设置；调整背景、立绘、Spine、Live2D 和特效时，预览定位与实际画面更一致，快速切换预览目标时同步结果更稳定。

changeBg / changeFigure / setTransition / setAnimation / setTempAnimation / setTransform 支持 ignoreDefault 参数，可让自定义动画忽略未声明的默认变换和效果。

CG 鉴赏支持按 series 分组并按 order 排序，系列图片可堆叠显示并依次预览。

新增 Enable_Continue 配置项，可控制继续游戏按钮是否显示；无自动存档时按钮会置灰，游戏结束时会清理自动存档。

新增巴西葡萄牙语和韩语，并将语言设置优化为下拉选择。

优化读档、回到流程图节点和自动继续时的画面与声音恢复，减少状态不一致。

#### 修复

修复使用 vocal 参数指定语音时资源路径解析错误的问题。

修复快速预览、滚轮推进和重置舞台后，快进与动画状态可能不一致的问题。

修复长场景连续推进时可能发生调用栈溢出的问题。

修复自定义模板样式仍受引擎默认样式干扰的问题。

修复非官方引擎构建时自身版本号被错误覆盖的问题。

修复自定义模板未包含 game/tex 纹理文件时，内置雨、雪和樱花特效无法显示的问题。

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

Added the flowchart feature. Players can view unlocked story nodes from the menu or bottom control panel and jump back to unlocked scenes. Flowcharts support multiple routes, node unlock progress, and locked-node visibility controls; resetting game data now also clears flowchart progress.

Improved editor live preview with more reliable scene navigation and state synchronization, plus support for debug variables, template refreshes, and additional interface preview settings; when adjusting backgrounds, figures, Spine, Live2D, and effects, preview positioning is closer to the actual screen, and synchronization is more stable when switching preview targets quickly.

changeBg / changeFigure / setTransition / setAnimation / setTempAnimation / setTransform now support the ignoreDefault argument, allowing custom animations to ignore undeclared default transforms and effects.

The CG gallery now supports grouping by series and sorting by order, with series images displayed as a stack for sequential preview.

Added the Enable_Continue configuration option to control whether the Continue button is shown; it is disabled without an autosave, and autosaves are cleared when the game ends.

Added Brazilian Portuguese and Korean translations, and improved language settings with a dropdown selector.

Improved screen and audio restoration after loading saves, returning to flowchart nodes, or continuing automatically, reducing state mismatches.

#### Fixes

Fixed incorrect voice asset path resolution when specifying voice files with the vocal argument.

Fixed fast-forward and animation states becoming inconsistent after fast preview, mouse-wheel advancement, or stage reset.

Fixed possible call stack overflow when advancing continuously through long scenes.

Fixed custom template styles still being affected by engine default styles.

Fixed version numbers of unofficial engine packages being overwritten incorrectly during builds.

Fixed built-in rain, snow, and cherry blossom effects not displaying when custom templates do not include the game/tex texture files.

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

フローチャート機能を追加しました。プレイヤーはメニューまたは下部コントロールから解放済みのストーリーノードを確認し、解放済みのシーンへ戻れるようになります。フローチャートは複数ルート、ノード解放状態、未解放ノードの表示制御に対応しました。ゲームデータをリセットすると、フローチャートの進行状況も一緒に削除されます。

エディターのリアルタイムプレビューを改善し、シーン移動と状態同期の安定性を向上しました。デバッグ変数、テンプレート更新、より多くの画面プレビュー設定にも対応しました。背景、立ち絵、Spine、Live2D、エフェクトを調整する際、プレビュー上の位置が実際の画面により近くなり、プレビュー対象を素早く切り替えた時の同期も安定しました。

changeBg / changeFigure / setTransition / setAnimation / setTempAnimation / setTransform が ignoreDefault 引数に対応し、カスタムアニメーションで未指定のデフォルト変換やエフェクトを無視できるようになりました。

CG 鑑賞が series によるグループ化と order による並べ替えに対応し、シリーズ画像を重ねて表示して順番にプレビューできるようになりました。

続きからボタンの表示を制御する Enable_Continue 設定を追加しました。自動セーブがない場合はボタンが無効になり、ゲーム終了時には自動セーブが削除されます。

ブラジルポルトガル語と韓国語を追加し、言語設定をドロップダウン選択に改善しました。

ロード、フローチャートノードへの復帰、自動継続時の画面と音声の復元を改善し、状態のずれを減らしました。

#### 修正

vocal 引数でボイスを指定した際、アセットパスが正しく解決されない問題を修正しました。

高速プレビュー、マウスホイールによる進行、舞台リセット後に、早送りとアニメーションの状態が一致しない問題を修正しました。

長いシーンを連続して進めた際に、コールスタックのオーバーフローが発生する場合がある問題を修正しました。

カスタムテンプレートのスタイルがエンジンのデフォルトスタイルの影響を受ける問題を修正しました。

非公式エンジンのビルド時に拡張パッケージのバージョン番号が誤って上書きされる問題を修正しました。

カスタムテンプレートに game/tex のテクスチャファイルが含まれていない場合、内蔵の雨、雪、桜エフェクトが表示されない問題を修正しました。

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
