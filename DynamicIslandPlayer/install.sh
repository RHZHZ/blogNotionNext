#!/bin/bash

set -e

echo "[DynamicIslandPlayer] 开始复制最小接入文件..."

if [ ! -f "package.json" ]; then
  echo "[错误] 请在项目根目录执行此脚本"
  exit 1
fi

mkdir -p components
mkdir -p pages/api

cp -f DynamicIslandPlayer/components/Player.js ./components/
cp -f DynamicIslandPlayer/components/DynamicIslandPlayer.js ./components/
cp -f DynamicIslandPlayer/pages/api/meting.js ./pages/api/

echo "[完成] 已复制以下文件："
echo "  - components/Player.js"
echo "  - components/DynamicIslandPlayer.js"
echo "  - pages/api/meting.js"
echo ""
echo "接下来请手动完成："
echo "1. 如目标项目尚未挂载播放器，请在 components/ExternalPlugins.js 中同时挂载 <MusicPlayer /> 与 <DynamicIslandPlayer />"
echo "2. 在 blog.config.js / conf/widget.config.js 中配置 MUSIC_PLAYER 相关选项"
echo "3. 在环境变量中配置 MUSIC_PLAYER_METING_UPSTREAM"
echo ""
echo "如需文章内音频卡片增强，再额外复制："
echo "  - DynamicIslandPlayer/components/InlineIslandAudio.js"
echo "并参考 DynamicIslandPlayer/guide.md 继续接入。"
