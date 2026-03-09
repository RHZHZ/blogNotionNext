param(
  [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"

Set-Location $ProjectRoot

if (-not (Test-Path "package.json")) {
  Write-Error "请在项目根目录执行此脚本，或传入 -ProjectRoot"
}

Write-Host "[DynamicIslandPlayer] 开始复制最小接入文件..."

New-Item -ItemType Directory -Force -Path "components" | Out-Null
New-Item -ItemType Directory -Force -Path "pages/api" | Out-Null

Copy-Item "DynamicIslandPlayer/components/Player.js" "components/Player.js" -Force
Copy-Item "DynamicIslandPlayer/components/DynamicIslandPlayer.js" "components/DynamicIslandPlayer.js" -Force
Copy-Item "DynamicIslandPlayer/pages/api/meting.js" "pages/api/meting.js" -Force

Write-Host "[完成] 已复制以下文件："
Write-Host "  - components/Player.js"
Write-Host "  - components/DynamicIslandPlayer.js"
Write-Host "  - pages/api/meting.js"
Write-Host ""
Write-Host "接下来请手动完成："
Write-Host "1. 如目标项目尚未挂载播放器，请在 components/ExternalPlugins.js 中同时挂载 <MusicPlayer /> 与 <DynamicIslandPlayer />"
Write-Host "2. 在 blog.config.js / conf/widget.config.js 中配置 MUSIC_PLAYER 相关选项"
Write-Host "3. 在环境变量中配置 MUSIC_PLAYER_METING_UPSTREAM"
Write-Host ""
Write-Host "如需文章内音频卡片增强，再额外复制："
Write-Host "  - DynamicIslandPlayer/components/InlineIslandAudio.js"
Write-Host "并参考 DynamicIslandPlayer/guide.md 继续接入。"
