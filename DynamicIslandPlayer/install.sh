#!/bin/bash

# 灵动岛播放器一键安装脚本
# 适用于 NotionNext 项目

set -e

echo "🎵 开始安装灵动岛播放器..."

# 检查是否在 NotionNext 项目中
if [ ! -f "package.json" ]; then
    echo "❌ 请在 NotionNext 项目根目录运行此脚本"
    exit 1
fi

# 创建必要的目录
mkdir -p components
mkdir -p pages/api

# 复制核心组件
echo "📁 复制核心组件..."
cp -f DynamicIslandPlayer/components/DynamicIslandPlayer.js ./components/
cp -f DynamicIslandPlayer/components/Player.js ./components/
cp -f DynamicIslandPlayer/components/InlineIslandAudio.js ./components/

# 复制API文件
echo "📁 复制API文件..."
cp -f DynamicIslandPlayer/pages/api/meting.js ./pages/api/

# 安装依赖
echo "📦 安装 APlayer 依赖..."
npm install aplayer

# 更新配置文件
echo "⚙️ 配置项目中..."
if [ -f "blog.config.js" ]; then
    # 检查是否已配置 MUSIC_PLAYER
    if ! grep -q "MUSIC_PLAYER" blog.config.js; then
        echo "请在 blog.config.js 中添加以下配置："
        echo ""
        echo "// 音乐播放器配置"
        echo "MUSIC_PLAYER: true,"
        echo "MUSIC_PLAYER_METING_ID: '2037842140,2037843139', // 替换为你的歌单ID"
        echo "MUSIC_PLAYER_AUTO_PLAY: false,"
        echo "MUSIC_PLAYER_VISIBLE: true,"
        echo ""
    fi
else
    echo "⚠️ 未找到 blog.config.js，请手动配置"
fi

# 更新 ExternalPlugins.js
echo "🔗 更新 ExternalPlugins.js..."
if [ -f "components/ExternalPlugins.js" ]; then
    if ! grep -q "DynamicIslandPlayer" components/ExternalPlugins.js; then
        echo "请在 components/ExternalPlugins.js 中添加："
        echo ""
        echo "const DynamicIslandPlayer = dynamic(() => import('@/components/DynamicIslandPlayer'), { ssr: false })"
        echo ""
        echo "并在组件渲染中添加：<DynamicIslandPlayer />"
        echo ""
    fi
else
    echo "⚠️ 未找到 components/ExternalPlugins.js，请手动集成"
fi

echo "✅ 安装完成！"
echo ""
echo "📋 接下来需要："
echo "1. 配置 blog.config.js 中的音乐播放器选项"
echo "2. 在 ExternalPlugins.js 中集成 DynamicIslandPlayer"
echo "3. 在 NotionPage.js 中使用 InlineIslandAudio"
echo "4. 设置环境变量 NOTION_ACCESS_TOKEN（可选）"
echo ""
echo "🎯 详细指南请查看 DynamicIslandPlayer/guide.md"