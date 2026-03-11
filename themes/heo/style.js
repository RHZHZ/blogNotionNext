/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
        /* LXGW WenKai Mono 字体定义 */
        /* LXGW WenKai Mono 字体定义 - 更丰富的字重版本
         * 实际字重由 index.js 中的 <link> 标签加载
         * 这里只需要定义字体族名称，字重会自动匹配
         */
         
        :root {
            --heo-surface: rgba(255, 255, 255, 0.9);
            --heo-surface-strong: #ffffff;
            --heo-surface-dark: rgba(27, 28, 32, 0.92);
            --heo-border: rgba(0, 0, 0, 0.08);
            --heo-border-strong: rgba(0, 0, 0, 0.12);
            --heo-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06),
            0 6px 18px rgba(0, 0, 0, 0.06);
            --heo-shadow-md: 0 2px 6px rgba(0, 0, 0, 0.08),
            0 18px 40px rgba(0, 0, 0, 0.08);
            --heo-shadow-lg: 0 6px 20px rgba(0, 0, 0, 0.12),
            0 30px 80px rgba(0, 0, 0, 0.12);
            --heo-shadow-lg-dark: 0 8px 26px rgba(0, 0, 0, 0.55),
            0 40px 100px rgba(0, 0, 0, 0.6);
            --heo-border-subtle: rgba(0, 0, 0, 0.06);
            --heo-border-subtle-dark: rgba(255, 255, 255, 0.09);
            --heo-card-hover-translate: -2px;
            --heo-radius-sm: 10px;
            --heo-radius-md: 14px;
            --heo-radius-lg: 18px;
            --heo-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
            --heo-dur-fast: 160ms;
            --heo-dur: 240ms;

            --heo-nav-pill-radius: 999px;
            --heo-nav-pill-border: rgba(148, 163, 184, 0.24);
            --heo-nav-pill-bg: rgba(255, 255, 255, 0.72);
            --heo-nav-pill-shadow: 0 10px 30px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
            --heo-nav-pill-blur: saturate(180%) blur(18px);
            --heo-nav-pill-dark-border: rgba(255, 255, 255, 0.08);
            --heo-nav-pill-dark-bg: rgba(7, 10, 18, 0.82);
            --heo-nav-pill-dark-shadow: 0 14px 36px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            --heo-nav-pill-dark-blur: saturate(140%) blur(18px);
            --heo-nav-action-hover-bg: rgba(15, 23, 42, 0.08);
            --heo-nav-action-hover-border: rgba(148, 163, 184, 0.18);
            --heo-nav-action-hover-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
            --heo-nav-action-hover-color: #0f172a;
            --heo-nav-action-hover-dark-bg: rgba(255, 255, 255, 0.1);
            --heo-nav-action-hover-dark-border: rgba(255, 255, 255, 0.08);
            --heo-nav-menu-hover-bg: rgba(248, 250, 252, 0.92);
            --heo-nav-menu-hover-border: rgba(191, 219, 254, 0.78);
            --heo-nav-menu-hover-shadow: 0 8px 18px rgba(59, 130, 246, 0.07);
            --heo-nav-menu-hover-color: #334155;
            --heo-nav-menu-hover-dark-bg: rgba(154, 52, 18, 0.16);
            --heo-nav-menu-hover-dark-border: rgba(245, 158, 11, 0.2);
            --heo-nav-menu-hover-dark-shadow: 0 8px 18px rgba(120, 53, 15, 0.16);
            --heo-nav-menu-hover-dark-color: #fde68a;
            --heo-nav-focus-border: rgba(147, 197, 253, 0.92);
            --heo-nav-focus-bg: rgba(239, 246, 255, 0.96);
            --heo-nav-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.22), 0 10px 24px rgba(59, 130, 246, 0.12);
            --heo-nav-focus-color: #1d4ed8;
            --heo-nav-focus-dark-border: rgba(245, 158, 11, 0.34);
            --heo-nav-focus-dark-bg: rgba(154, 52, 18, 0.2);
            --heo-nav-focus-dark-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 10px 24px rgba(120, 53, 15, 0.22);
            --heo-nav-focus-dark-color: #fde68a;
            --heo-nav-current-bg: rgba(37, 99, 235, 0.1);
            --heo-nav-current-border: rgba(191, 219, 254, 0.76);
            --heo-nav-current-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 16px rgba(37, 99, 235, 0.07);
            --heo-nav-current-color: #2563eb;
            --heo-nav-current-dark-bg: rgba(245, 158, 11, 0.1);
            --heo-nav-current-dark-border: rgba(245, 158, 11, 0.18);
            --heo-nav-current-dark-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 6px 16px rgba(120, 53, 15, 0.12);
            --heo-nav-current-dark-color: #facc15;
            --heo-nav-outline-shadow: 0 0 0 2px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.7);
            --heo-nav-submenu-border: rgba(226, 232, 240, 0.92);
            --heo-nav-submenu-bg: rgba(255, 255, 255, 0.92);
            --heo-nav-submenu-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
            --heo-nav-submenu-blur: saturate(210%) blur(20px);
            --heo-nav-submenu-dark-border: rgba(71, 85, 105, 0.42);
            --heo-nav-submenu-dark-bg: rgba(15, 23, 42, 0.94);
            --heo-nav-submenu-dark-shadow: 0 22px 44px rgba(0, 0, 0, 0.34);
            --heo-nav-submenu-dark-blur: saturate(160%) blur(20px);
            --heo-nav-submenu-hover-shadow: 0 10px 24px rgba(59, 130, 246, 0.12);
            --heo-nav-submenu-hover-dark-shadow: 0 10px 24px rgba(120, 53, 15, 0.22);
            --heo-nav-headline-pill-max-width: min(100%, 44rem);
            --heo-nav-headline-pill-min-height: 2.88rem;
            --heo-nav-headline-pill-padding: 0.52rem 1.16rem;
            --heo-nav-headline-pill-border: rgba(255, 255, 255, 0.42);
            --heo-nav-headline-pill-bg: rgba(255, 255, 255, 0.7);
            --heo-nav-headline-pill-shadow: 0 12px 32px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.82);
            --heo-nav-headline-pill-blur: saturate(210%) blur(24px);
            --heo-nav-headline-text: rgba(15, 23, 42, 0.99);
            --heo-nav-headline-text-shadow: 0 1px 0 rgba(255, 255, 255, 0.52);
            --heo-nav-headline-pill-dark-border: rgba(255, 255, 255, 0.16);
            --heo-nav-headline-pill-dark-bg: rgba(15, 23, 42, 0.54);
            --heo-nav-headline-pill-dark-shadow: 0 14px 30px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.12);
            --heo-nav-headline-pill-dark-blur: saturate(170%) blur(24px);
            --heo-nav-headline-dark-text: rgba(255, 247, 237, 0.92);
            --heo-nav-post-headline-pill-min-height: 2.76rem;
            --heo-nav-post-headline-pill-padding: 0.48rem 1.08rem;
            --heo-nav-post-headline-pill-border: rgba(255, 255, 255, 0.28);
            --heo-nav-post-headline-pill-bg: rgba(255, 255, 255, 0.78);
            --heo-nav-post-headline-pill-shadow: 0 12px 32px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.74);
            --heo-nav-post-headline-pill-blur: saturate(205%) blur(22px);
            --heo-nav-post-headline-text: rgba(15, 23, 42, 0.96);
            --heo-nav-post-headline-text-shadow: 0 1px 0 rgba(255, 255, 255, 0.18);
            --heo-nav-post-headline-pill-dark-border: rgba(255, 255, 255, 0.14);
            --heo-nav-post-headline-pill-dark-bg: rgba(7, 10, 18, 0.56);
            --heo-nav-post-headline-pill-dark-shadow: 0 14px 30px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            --heo-nav-post-headline-dark-text: rgba(255, 247, 237, 0.94);

            --heo-card-radius: 1.5rem;
            --heo-card-radius-lg: 1.75rem;
            --heo-card-padding: 1.5rem;
            --heo-card-padding-compact: 1rem;
            --heo-card-border: rgba(203, 213, 225, 0.98);
            --heo-card-border-strong: rgba(148, 163, 184, 0.92);
            --heo-card-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94));
            --heo-card-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
            --heo-card-hover-shadow: 0 22px 52px rgba(15, 23, 42, 0.11);
            --heo-card-blur: saturate(180%) blur(18px);
            --heo-card-dark-border: rgba(100, 116, 139, 0.44);
            --heo-card-dark-border-strong: rgba(245, 158, 11, 0.28);
            --heo-card-dark-bg: linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(15, 23, 42, 0.76));
            --heo-card-dark-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
            --heo-card-dark-hover-shadow: 0 24px 56px rgba(0, 0, 0, 0.3);
            --heo-card-dark-blur: saturate(150%) blur(18px);
            --heo-card-title: #0f172a;
            --heo-card-title-dark: #f8fafc;
            --heo-card-text: #334155;
            --heo-card-text-dark: #cbd5e1;
            --heo-card-muted: #64748b;
            --heo-card-muted-dark: #94a3b8;

            --heo-font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "PingFang SC", "Hiragino Sans GB",
            "Noto Sans CJK SC", system-ui, Segoe UI, Roboto, Helvetica, Arial,
            sans-serif;
           --heo-font-mono: "LXGW WenKai Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;

            --heo-text: rgba(0, 0, 0, 0.88);
            --heo-text-secondary: rgba(0, 0, 0, 0.62);
            --heo-text-tertiary: rgba(0, 0, 0, 0.46);

            --heo-article-font-size: 16px;
            --heo-article-line-height: 1.78;
            --heo-article-paragraph-gap: 0.9em;
            --heo-article-block-gap: 1.25rem;
            --heo-article-surface-max-width: 54rem;
            --heo-article-media-radius: 1.3rem;
            --heo-article-media-border: rgba(148, 163, 184, 0.14);
            --heo-article-media-border-dark: rgba(255, 255, 255, 0.1);
            --heo-article-media-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.84));
            --heo-article-media-bg-dark: linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.58));
            --heo-article-media-shadow: 0 18px 40px rgba(15, 23, 42, 0.07);
            --heo-article-media-shadow-dark: 0 20px 44px rgba(0, 0, 0, 0.26);

            --heo-h2-size: 1.45rem;
            --heo-h3-size: 1.22rem;
            --heo-h4-size: 1.06rem;
        }

        html.dark {
            --heo-text: rgba(255, 255, 255, 0.88);
            --heo-text-secondary: rgba(235, 235, 245, 0.68);
            --heo-text-tertiary: rgba(235, 235, 245, 0.52);
        }

        #theme-heo .heo-card {
            position: relative;
            border: 1px solid var(--heo-card-border) !important;
            border-radius: var(--heo-card-radius) !important;
            background: var(--heo-card-bg) !important;
            -webkit-backdrop-filter: var(--heo-card-blur);
            backdrop-filter: var(--heo-card-blur);
            box-shadow: var(--heo-card-shadow);
            color: var(--heo-card-text);
            overflow: hidden;
            transition: transform var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-card__body {
            position: relative;
            z-index: 1;
        }

        #theme-heo .heo-card--interactive:hover,
        #theme-heo .heo-card--interactive:focus-within {
            transform: translateY(var(--heo-card-hover-translate));
            border-color: var(--heo-card-border-strong) !important;
            box-shadow: var(--heo-card-hover-shadow);
        }

        html.dark #theme-heo .heo-card {
            border-color: var(--heo-card-dark-border) !important;
            background: var(--heo-card-dark-bg) !important;
            -webkit-backdrop-filter: var(--heo-card-dark-blur);
            backdrop-filter: var(--heo-card-dark-blur);
            box-shadow: var(--heo-card-dark-shadow);
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-card--interactive:hover,
        html.dark #theme-heo .heo-card--interactive:focus-within {
            border-color: var(--heo-card-dark-border-strong) !important;
            box-shadow: var(--heo-card-dark-hover-shadow);
        }

        #theme-heo #post-bg {
            isolation: isolate;
            --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 4rem);
            --heo-post-header-bottom: clamp(1rem, 3vw, 1.6rem);
        }

        #theme-heo #post-bg .min-h-inherit {
            min-height: inherit;
        }

        #theme-heo #post-bg-content {
            min-height: inherit;
            align-items: flex-start;
            position: relative;
            z-index: 2;
            padding-top: var(--heo-post-header-offset);
            padding-bottom: var(--heo-post-header-bottom);
        }

        #theme-heo #post-info {
            position: relative;
            z-index: 2;
            min-height: clamp(11.5rem, 16vw, 13.5rem);
            border-color: transparent !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)) !important;
            box-shadow: 0 18px 56px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        #theme-heo #post-info .post-info-inner {
            display: grid;
            grid-template-rows: auto minmax(0, 1fr) auto;
            gap: clamp(0.85rem, 2vw, 1.15rem);
            min-height: inherit;
        }

        #theme-heo #post-info .post-info-head,
        #theme-heo #post-info .post-info-meta-zone {
            width: 100%;
        }

        #theme-heo #post-info .post-info-title-zone {
            display: flex;
            align-items: flex-start;
            width: 100%;
            min-height: clamp(5.8rem, 8.4vw, 7.9rem);
            overflow: hidden;
        }

        #theme-heo #post-info .post-info-title {
            letter-spacing: -0.025em;
            text-wrap: pretty;
            width: 100%;
            max-width: none;
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            align-items: start;
            column-gap: 0.72rem;
            font-weight: 700;
        }

        #theme-heo #post-info .post-info-title-wrap {
            width: 100%;
            max-width: min(100%, 42rem);
        }

        #theme-heo #post-info .post-info-title-row {
            display: inline-flex;
            width: 100%;
            max-width: min(100%, 42rem);
        }

        #theme-heo #post-info .post-info-title-icon {
            align-self: start;
            margin-top: 0.18rem;
        }

        #theme-heo #post-info .post-info-title-text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-word;
            text-overflow: ellipsis;
            width: 100%;
            min-width: 0;
            max-height: calc(1.12em * 2);
        }

        #theme-heo #post-info .post-info-meta {
            row-gap: 0.7rem;
        }

        #theme-heo #post-info a,
        #theme-heo #post-info i,
        #theme-heo #post-info svg {
            transition: color var(--heo-dur-fast) var(--heo-ease),
                border-color var(--heo-dur-fast) var(--heo-ease),
                background var(--heo-dur-fast) var(--heo-ease),
                opacity var(--heo-dur-fast) var(--heo-ease),
                transform var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo #post-info .busuanzi_value_page_pv {
            min-width: 1ch;
        }

        @media (min-width: 768px) {
            #theme-heo #post-bg {
                --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 5.4rem);
                --heo-post-header-bottom: 4.5rem;
            }

            #theme-heo #post-bg-content {
                padding-bottom: clamp(3.8rem, 5vw, 5.6rem);
            }

            #theme-heo #post-info {
                min-height: clamp(11.2rem, 15.4vw, 13.4rem);
            }

            #theme-heo #post-info .post-info-inner {
                gap: clamp(0.56rem, 1.15vw, 0.85rem);
            }

            #theme-heo #post-info .post-info-title-zone {
                min-height: clamp(5.6rem, 7.6vw, 7.2rem);
            }

            #theme-heo #post-info .post-info-title-wrap,
            #theme-heo #post-info .post-info-title-row {
                max-width: min(100%, 58rem);
            }

            #theme-heo #post-info .post-info-meta {
                gap: clamp(0.36rem, 0.75vw, 0.56rem);
                row-gap: clamp(0.34rem, 0.7vw, 0.5rem);
            }

            #theme-heo #post-info .post-info-meta > a,
            #theme-heo #post-info .post-info-meta > div {
                min-height: clamp(1.72rem, 1.8vw, 2rem) !important;
                padding: clamp(0.28rem, 0.42vw, 0.42rem) clamp(0.62rem, 0.82vw, 0.84rem) !important;
                font-size: clamp(0.68rem, 0.6rem + 0.12vw, 0.8rem) !important;
                line-height: 1.02;
                border-radius: 999px;
            }

            #theme-heo #post-info .post-info-meta > a i,
            #theme-heo #post-info .post-info-meta > div i,
            #theme-heo #post-info .post-info-meta > a svg,
            #theme-heo #post-info .post-info-meta > div svg {
                font-size: 0.84em;
            }

            #theme-heo #article-wrapper .heo-article-section {
                padding-top: 1.8rem;
            }
        }

        html.dark #theme-heo #post-info {
            border-color: transparent !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.28), rgba(15, 23, 42, 0.16)) !important;
            box-shadow: 0 20px 68px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        @media (max-width: 767px) {
            #theme-heo #post-bg {
                min-height: clamp(19.75rem, 78svh, 23rem) !important;
                --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 3.15rem);
                --heo-post-header-bottom: 2.6rem;
            }

            #theme-heo #post-bg::before {
                content: '';
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 1;
                background:
                    radial-gradient(circle at 74% 28%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.12) 14%, rgba(255, 255, 255, 0.05) 24%, rgba(255, 255, 255, 0.015) 34%, transparent 54%),
                    radial-gradient(circle at 52% 42%, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 18%, transparent 42%);
                filter: blur(2px);
            }

            #theme-heo #post-bg-content {
                padding-top: var(--heo-post-header-offset);
                padding-bottom: max(var(--heo-post-header-bottom), 2.9rem);
            }

            #theme-heo #post-info {
                min-height: 15.3rem;
                border-radius: 1.45rem !important;
                padding: 0.95rem !important;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.05)) !important;
                box-shadow: 0 16px 44px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }

            #theme-heo #post-info .post-info-inner {
                grid-template-rows: auto minmax(0, 1fr) auto;
                gap: 0.72rem;
                padding-block: 0.1rem 0.02rem;
            }

            #theme-heo #post-info .post-info-eyebrow {
                gap: 0.42rem;
            }

            #theme-heo #post-info .post-info-title-zone {
                min-height: 7.1rem;
                justify-content: center;
                align-items: center;
                padding-block: 0.18rem;
            }

            #theme-heo #post-info .post-info-title-wrap {
                max-width: min(100%, 17.8rem);
                text-align: center;
            }

            #theme-heo #post-info .post-info-title-row {
                display: flex;
                width: 100%;
                max-width: min(100%, 17.8rem);
                justify-content: center;
                align-items: center;
            }

            #theme-heo #post-info .post-info-title {
                width: 100%;
                font-size: clamp(1.74rem, 6.85vw, 2.18rem) !important;
                line-height: 1.04 !important;
                max-width: 100%;
                margin: 0 auto;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 760;
            }

            #theme-heo #post-info .post-info-title-icon {
                display: none;
            }

            #theme-heo #post-info .post-info-title-text {
                -webkit-line-clamp: 3;
                max-height: calc(1.04em * 3);
                text-align: center;
            }

            #theme-heo #post-info .post-info-meta {
                gap: 0.42rem;
                row-gap: 0.42rem;
                justify-content: center;
            }

            #theme-heo #post-info .post-info-meta > a,
            #theme-heo #post-info .post-info-meta > div {
                min-height: 1.88rem !important;
                padding: 0.36rem 0.72rem !important;
                font-size: 0.76rem !important;
                line-height: 1.05;
            }

            #theme-heo #post-info .post-info-meta > a i,
            #theme-heo #post-info .post-info-meta > div i,
            #theme-heo #post-info .post-info-meta > a svg,
            #theme-heo #post-info .post-info-meta > div svg {
                font-size: 0.82em;
            }

            #theme-heo #wrapper-outer .article.heo-post-shell {
                margin-top: 0;
                border-top-left-radius: 1.55rem !important;
                border-top-right-radius: 1.55rem !important;
            }

            #theme-heo #article-wrapper .heo-article-section {
                padding-top: 1.15rem;
                padding-inline: 1rem;
            }

            html.dark #theme-heo #post-bg::before {
                background:
                    radial-gradient(circle at 74% 28%, rgba(255, 244, 214, 0.18) 0%, rgba(255, 244, 214, 0.08) 14%, rgba(255, 244, 214, 0.03) 24%, rgba(255, 244, 214, 0.012) 34%, transparent 54%),
                    radial-gradient(circle at 52% 42%, rgba(255, 244, 214, 0.08) 0%, rgba(255, 244, 214, 0.025) 18%, transparent 42%);
            }

            html.dark #theme-heo #post-info {
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.24), rgba(15, 23, 42, 0.14)) !important;
                box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.03);
            }
        }


        #theme-heo .heo-notice-card {
            border-radius: var(--heo-card-radius-lg) !important;
            padding-top: 0.8rem;
            padding-bottom: 0.8rem;
        }

        #theme-heo .heo-notice-card__label {
            padding: 0.38rem 0.82rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
            color: var(--heo-card-title);
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        #theme-heo .heo-notice-card__content {
            color: var(--heo-card-text);
            min-width: 0;
            font-weight: 600;
        }

        #theme-heo .heo-notice-card__content a,
        #theme-heo .heo-notice-card__content span,
        #theme-heo .heo-notice-card__content div {
            color: inherit;
        }

        #theme-heo .heo-notice-card__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.48);
            color: var(--heo-card-muted);
            transition: transform var(--heo-dur-fast) var(--heo-ease), color var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-notice-card:hover .heo-notice-card__icon {
            transform: translateX(2px);
            color: #4f65f0;
            background: rgba(79, 101, 240, 0.12);
        }

        html.dark #theme-heo .heo-notice-card__label {
            background: rgba(245, 158, 11, 0.12);
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-notice-card__content {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-notice-card__icon {
            background: rgba(255, 255, 255, 0.06);
            color: var(--heo-card-muted-dark);
        }

        #theme-heo .heo-notice-card:hover .heo-notice-card__content {
            color: var(--heo-card-title);
        }

        html.dark #theme-heo .heo-notice-card:hover .heo-notice-card__content {
            color: var(--heo-card-title-dark);
        }

        #theme-heo .heo-menu-group-card {
            border-radius: 1.35rem !important;
            padding: 0.7rem !important;
        }

        #theme-heo .heo-menu-group-card__list {
            position: relative;
            z-index: 1;
        }

        #theme-heo .heo-menu-group-card__link {
            border-radius: 0.95rem;
            color: var(--heo-card-text);
            transition: transform var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease), color var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-menu-group-card__label {
            color: inherit;
            font-size: 0.92rem;
            font-weight: 600;
        }

        #theme-heo .heo-menu-group-card__count {
            min-width: 1.9rem;
            padding: 0.18rem 0.5rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
            color: #4f46e5;
            font-size: 0.78rem;
            text-align: center;
        }

        @media (hover: hover) {
            #theme-heo .heo-menu-group-card__link:hover {
                transform: translateX(2px);
                background: rgba(79, 101, 240, 0.08);
                color: var(--heo-card-title);
                box-shadow: inset 0 0 0 1px rgba(191, 219, 254, 0.58);
            }
        }

        html.dark #theme-heo .heo-menu-group-card__link {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-menu-group-card__count {
            background: rgba(245, 158, 11, 0.12);
            color: #fbbf24;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-menu-group-card__link:hover {
                background: rgba(245, 158, 11, 0.1);
                color: var(--heo-card-title-dark);
                box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.16);
            }
        }

        html.dark #theme-heo .heo-notice-card:hover .heo-notice-card__content {
            color: var(--heo-card-title-dark);
        }


        #theme-heo .heo-sidebar-panel {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #theme-heo .heo-sidebar-panel__brand-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }

        #theme-heo .heo-sidebar-brand-card {
            width: 100%;
            padding: 1rem !important;
            border-radius: 1.5rem !important;
            text-align: center;
        }

        #theme-heo .heo-sidebar-brand-card__body {
            min-height: 10.5rem;
            padding: 0.35rem 0.5rem;
        }

        #theme-heo .heo-sidebar-brand-card__avatar {
            width: 5.25rem;
            height: 5.25rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.95rem;
            padding: 0.3rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        #theme-heo .heo-sidebar-brand-card__avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        #theme-heo .heo-sidebar-brand-card__title {
            display: block;
            color: var(--heo-card-title);
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.3;
        }

        #theme-heo .heo-sidebar-brand-card__subtitle {
            display: block;
            margin-top: 0.38rem;
            color: var(--heo-card-muted);
            font-size: 0.82rem;
            line-height: 1.55;
        }

        html.dark #theme-heo .heo-sidebar-brand-card__avatar {
            background: rgba(245, 158, 11, 0.12);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-sidebar-brand-card__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-sidebar-brand-card__subtitle {
            color: var(--heo-card-muted-dark);
        }

        .heo-toc-drawer__overlay {
            background: rgba(15, 23, 42, 0.18);
            -webkit-backdrop-filter: blur(2px);
            backdrop-filter: blur(2px);
        }

        .heo-toc-drawer__panel {
            border: 1px solid rgba(226, 232, 240, 0.92);
            border-radius: 1.75rem;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 24px 64px rgba(15, 23, 42, 0.16);
            -webkit-backdrop-filter: saturate(180%) blur(18px);
            backdrop-filter: saturate(180%) blur(18px);
        }

        .heo-toc-drawer__header {
            padding: 0.95rem 1rem 0.9rem;
            border-bottom: 1px solid rgba(226, 232, 240, 0.88);
            background: rgba(255, 255, 255, 0.96);
        }

        .heo-toc-drawer__eyebrow {
            color: #94a3b8;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.24em;
            text-transform: uppercase;
        }

        .heo-toc-drawer__title {
            margin-top: 0.28rem;
            color: #334155;
            font-size: 0.95rem;
            font-weight: 700;
        }

        .heo-toc-drawer__close {
            width: 2.25rem;
            height: 2.25rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(226, 232, 240, 0.9);
            border-radius: 1rem;
            background: rgba(255, 255, 255, 0.92);
            color: #64748b;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.72);
            transition: transform var(--heo-dur-fast) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease), color var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur-fast) var(--heo-ease);
            appearance: none;
            -webkit-appearance: none;
        }

        .heo-toc-drawer__content {
            max-height: min(58vh, 28rem);
            overflow-y: auto;
            padding: 0.5rem;
            background: rgba(248, 250, 252, 0.94);
        }

        .heo-toc-drawer__content-card {
            border: 1px solid rgba(226, 232, 240, 0.88);
            border-radius: 1.35rem;
            background: #ffffff;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
            padding: 0.25rem;
        }

        @media (hover: hover) {
            .heo-toc-drawer__close:hover {
                transform: translateY(-1px);
                border-color: rgba(191, 219, 254, 0.78);
                background: rgba(248, 250, 252, 0.95);
                color: #334155;
                box-shadow: 0 10px 20px rgba(59, 130, 246, 0.08);
            }
        }

        .heo-toc-drawer__close:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.72);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16), 0 10px 20px rgba(59, 130, 246, 0.08);
        }

        html.dark .heo-toc-drawer__overlay {
            background: rgba(0, 0, 0, 0.55);
            -webkit-backdrop-filter: blur(6px);
            backdrop-filter: blur(6px);
        }

        html.dark .heo-toc-drawer__panel {
            border-color: rgba(71, 85, 105, 0.4);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.92));
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.34);
        }

        html.dark .heo-toc-drawer__header {
            border-color: rgba(71, 85, 105, 0.3);
            background: rgba(15, 23, 42, 0.92);
        }

        html.dark .heo-toc-drawer__content {
            background: rgba(15, 23, 42, 0.94);
        }

        html.dark .heo-toc-drawer__title {
            color: #f8fafc;
        }

        html.dark .heo-toc-drawer__close {
            border-color: rgba(71, 85, 105, 0.4);
            background: rgba(51, 65, 85, 0.92);
            color: #cbd5e1;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
        }

        html.dark .heo-toc-drawer__content-card {
            border-color: rgba(71, 85, 105, 0.24);
            background: rgba(30, 41, 59, 0.32);
            box-shadow: none;
        }

        @media (hover: hover) {
            html.dark .heo-toc-drawer__close:hover {
                border-color: rgba(245, 158, 11, 0.24);
                background: rgba(71, 85, 105, 0.96);
                color: #fde68a;
                box-shadow: 0 10px 24px rgba(120, 53, 15, 0.18);
            }
        }

        html.dark .heo-toc-drawer__close:focus-visible {
            border-color: rgba(245, 158, 11, 0.28);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 10px 24px rgba(120, 53, 15, 0.18);
        }

        #theme-heo .heo-float-widget-btn {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.38rem;
            border: 1px solid rgba(191, 219, 254, 0.88);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.94);
            color: #334155;
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.82);
            -webkit-backdrop-filter: saturate(180%) blur(16px);
            backdrop-filter: saturate(180%) blur(16px);
            transition: transform var(--heo-dur-fast) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease), color var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-float-widget-btn--icon-only {
            width: 2.65rem;
            height: 2.65rem;
        }

        #theme-heo .heo-float-widget-btn--stack {
            min-height: 3.1rem;
            flex-direction: column;
            padding: 0.32rem 0.28rem 0.36rem;
        }

        #theme-heo .heo-float-widget-btn__icon-wrap {
            width: 1.35rem;
            height: 1.35rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
        }

        #theme-heo .heo-float-widget-btn__icon {
            font-size: 0.82rem;
            line-height: 1;
        }

        #theme-heo .heo-float-widget-btn__meta {
            font-size: 0.68rem;
            line-height: 1;
            font-weight: 700;
            color: #475569;
        }

        @media (hover: hover) {
            #theme-heo .heo-float-widget-btn:hover {
                transform: translateY(-1px);
                border-color: rgba(191, 219, 254, 0.9);
                background: rgba(248, 250, 252, 0.95);
                color: #334155;
                box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);
            }

            #theme-heo .heo-float-widget-btn:hover .heo-float-widget-btn__icon-wrap {
                background: rgba(79, 101, 240, 0.12);
            }
        }

        #theme-heo .heo-float-widget-btn:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.72);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16), 0 16px 30px rgba(15, 23, 42, 0.12);
        }

        html.dark #theme-heo .heo-float-widget-btn {
            border-color: rgba(100, 116, 139, 0.52);
            background: rgba(15, 23, 42, 0.82);
            color: #e2e8f0;
            box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-float-widget-btn__icon-wrap {
            background: rgba(245, 158, 11, 0.12);
        }

        html.dark #theme-heo .heo-float-widget-btn__meta {
            color: #cbd5e1;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-float-widget-btn:hover {
                border-color: rgba(245, 158, 11, 0.24);
                background: rgba(15, 23, 42, 0.92);
                color: #fde68a;
                box-shadow: 0 18px 38px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }

            html.dark #theme-heo .heo-float-widget-btn:hover .heo-float-widget-btn__icon-wrap {
                background: rgba(245, 158, 11, 0.16);
            }
        }

        html.dark #theme-heo .heo-float-widget-btn:focus-visible {
            border-color: rgba(245, 158, 11, 0.28);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 18px 38px rgba(0, 0, 0, 0.28);
        }

        @media (prefers-reduced-motion: reduce) {
            #theme-heo .heo-float-widget-btn {
                transition: none;
            }
        }

        #theme-heo .heo-post-card__cover {
            position: relative;
            min-height: 8.5rem;
            align-self: stretch;
            border-right: 1px solid rgba(203, 213, 225, 0.9);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
        }

        #theme-heo .heo-post-card__cover img {
            display: block;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
        }

        #theme-heo .heo-post-card__cover::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.08));
            opacity: 0.8;
        }

        #theme-heo .heo-post-card__content {
            position: relative;
            z-index: 1;
            color: inherit;
        }

        #theme-heo .heo-post-card__title {
            color: var(--heo-card-title);
            transition: color var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-post-card__summary {
            color: var(--heo-card-text);
        }

        #theme-heo .heo-post-card__meta,
        #theme-heo .heo-post-card__category {
            color: var(--heo-card-muted);
        }

        html.dark #theme-heo .heo-post-card__cover {
            border-right-color: rgba(71, 85, 105, 0.72);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0));
        }

        html.dark #theme-heo .heo-post-card__cover::after {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.22));
        }

        html.dark #theme-heo .heo-post-card__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-post-card__summary {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-post-card__meta,
        html.dark #theme-heo .heo-post-card__category {
            color: var(--heo-card-muted-dark);
        }

        @media (max-width: 767px) {
            #theme-heo .heo-post-card__cover {
                min-height: 7.2rem;
                align-self: auto;
                border-right: none;
                border-bottom: 1px solid rgba(203, 213, 225, 0.9);
            }

            html.dark #theme-heo .heo-post-card__cover {
                border-bottom-color: rgba(71, 85, 105, 0.72);
            }
        }

        #theme-heo .heo-eye-care-mask {
            position: fixed;
            inset: 0;
            z-index: 70;
            pointer-events: none;
            opacity: 0;
            background: rgba(120, 98, 58, calc((1 - var(--heo-eye-care-intensity, 0.92)) * 1.75));
            mix-blend-mode: multiply;
            transition: opacity var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo.heo-eye-care .heo-eye-care-mask {
            opacity: 1;
        }

        html.dark #theme-heo .heo-eye-care-mask {
            background: rgba(18, 20, 16, calc((1 - var(--heo-eye-care-intensity, 0.9)) * 1.6));
            mix-blend-mode: soft-light;
        }

        body {
            background-color: #f7f9fe;
            background-image: radial-gradient(rgba(60, 132, 246, 0.03) 1px, transparent 0);
            background-size: 24px 24px;
            transition: background-color var(--heo-dur-fast) var(--heo-ease), filter var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo.heo-eye-care > header > :not(nav),
        #theme-heo.heo-eye-care > main,
        #theme-heo.heo-eye-care > footer {
            filter: saturate(calc(0.84 + var(--heo-eye-care-intensity, 0.92) * 0.08)) brightness(var(--heo-eye-care-intensity, 0.92));
        }

        html.dark body {
            background-color: #0f1115;
            background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0);
            background-size: 24px 24px;
        }

        html.dark #theme-heo.heo-eye-care > header > :not(nav),
        html.dark #theme-heo.heo-eye-care > main,
        html.dark #theme-heo.heo-eye-care > footer {
            filter: saturate(calc(0.84 + var(--heo-eye-care-intensity, 0.9) * 0.06)) brightness(var(--heo-eye-care-intensity, 0.9));
        }

        #theme-heo nav#nav .heo-eye-care-control {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.55rem;
        }

        #theme-heo nav#nav .heo-eye-care-control__panel {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.8rem;
            width: 0;
            opacity: 0;
            overflow: hidden;
            pointer-events: none;
            padding: 0;
            border-radius: 999px;
            border: 1px solid transparent;
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.98) 0%, rgba(96, 165, 250, 0.95) var(--heo-eye-care-progress, 71.4%), rgba(255, 255, 255, 0.78) var(--heo-eye-care-progress, 71.4%), rgba(255, 255, 255, 0.72) 100%);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.74), inset 0 -1px 3px rgba(148, 163, 184, 0.2);
            cursor: ew-resize;
            user-select: none;
            transition: width var(--heo-dur-fast) var(--heo-ease), opacity var(--heo-dur-fast) var(--heo-ease), padding var(--heo-dur-fast) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur-fast) var(--heo-ease), transform var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo nav#nav .heo-eye-care-control__panel:hover {
            border-color: rgba(96, 165, 250, 0.95);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.82), inset 0 -1px 3px rgba(148, 163, 184, 0.24), 0 10px 22px rgba(59, 130, 246, 0.14);
        }

        #theme-heo nav#nav .heo-eye-care-control__panel:focus-visible,
        #theme-heo nav#nav .heo-eye-care-control__panel.is-dragging {
            outline: none;
            border-color: rgba(59, 130, 246, 0.95);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.84), inset 0 -1px 3px rgba(148, 163, 184, 0.24), 0 10px 24px rgba(59, 130, 246, 0.18);
        }

        #theme-heo nav#nav .heo-eye-care-control__panel:active {
            transform: scale(0.995);
        }

        #theme-heo nav#nav .heo-eye-care-control.is-enabled:hover .heo-eye-care-control__panel,
        #theme-heo nav#nav .heo-eye-care-control.is-enabled:focus-within .heo-eye-care-control__panel,
        #theme-heo nav#nav .heo-eye-care-control.is-dragging .heo-eye-care-control__panel {
            width: 13.5rem;
            opacity: 1;
            pointer-events: auto;
            padding: 0.55rem 0.85rem;
            border-color: rgba(191, 219, 254, 0.82);
        }

        #theme-heo nav#nav .heo-eye-care-control__label,
        #theme-heo nav#nav .heo-eye-care-control__value {
            position: relative;
            z-index: 1;
            font-size: 0.72rem;
            font-weight: 700;
            line-height: 1;
            color: #334155;
            white-space: nowrap;
            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
        }

        #theme-heo nav#nav .heo-eye-care-control__value {
            min-width: 2.55rem;
            text-align: right;
        }

        html.dark #theme-heo nav#nav .heo-eye-care-control__panel {
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.96) 0%, rgba(251, 191, 36, 0.94) var(--heo-eye-care-progress, 71.4%), rgba(30, 41, 59, 0.92) var(--heo-eye-care-progress, 71.4%), rgba(15, 23, 42, 0.84) 100%);
            border-color: rgba(71, 85, 105, 0.5);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.06), inset 0 -1px 4px rgba(2, 6, 23, 0.45);
        }

        html.dark #theme-heo nav#nav .heo-eye-care-control__panel:hover {
            border-color: rgba(251, 191, 36, 0.4);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 4px rgba(2, 6, 23, 0.5), 0 10px 24px rgba(245, 158, 11, 0.18);
        }

        html.dark #theme-heo nav#nav .heo-eye-care-control__panel:focus-visible,
        html.dark #theme-heo nav#nav .heo-eye-care-control__panel.is-dragging {
            border-color: rgba(251, 191, 36, 0.7);
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 4px rgba(2, 6, 23, 0.5), 0 10px 24px rgba(245, 158, 11, 0.18);
        }

        html.dark #theme-heo nav#nav .heo-eye-care-control__label,
        html.dark #theme-heo nav#nav .heo-eye-care-control__value {
            color: #f8fafc;
            text-shadow: 0 1px 0 rgba(15, 23, 42, 0.32);
        }


        /* 动态环境光（Ambient Light） */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0.65;
            background:
                    radial-gradient(600px 380px at 15% 20%, rgba(79, 101, 240, 0.18), transparent 60%),
                    radial-gradient(520px 360px at 85% 25%, rgba(59, 130, 246, 0.14), transparent 62%),
                    radial-gradient(640px 420px at 60% 85%, rgba(162, 82, 255, 0.10), transparent 60%),
                    radial-gradient(520px 420px at 10% 85%, rgba(16, 185, 129, 0.08), transparent 62%);
            filter: blur(14px) saturate(135%);
            transform: translate3d(0, 0, 0);
            animation: heoAmbientMove 18s ease-in-out infinite alternate;
        }

        html.dark body::before {
            opacity: 0.55;
            background:
                    radial-gradient(680px 420px at 20% 15%, rgba(234, 179, 8, 0.16), transparent 60%),
                    radial-gradient(620px 420px at 85% 25%, rgba(249, 115, 22, 0.12), transparent 62%),
                    radial-gradient(760px 520px at 60% 90%, rgba(59, 130, 246, 0.10), transparent 60%),
                    radial-gradient(520px 420px at 15% 85%, rgba(34, 197, 94, 0.06), transparent 62%);
            filter: blur(16px) saturate(125%);
        }

        @keyframes heoAmbientMove {
            0% {
                transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
                transform: translate3d(-1.5%, 1%, 0) scale(1.02);
            }
            100% {
                transform: translate3d(1.5%, -1%, 0) scale(1.03);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            body::before {
                animation: none;
            }
        }

        /* Hero: 梦幻层次与动效（不改组件结构，仅 CSS 增强） */
        #theme-heo #hero.recent-post-top {
            position: relative;
            isolation: isolate;
            border-radius: 18px !important;
        }

        #theme-heo #hero.recent-post-top::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: 20px;
            pointer-events: none;
            background:
                    radial-gradient(800px 420px at 10% 10%, rgba(79, 101, 240, 0.16), transparent 60%),
                    radial-gradient(720px 420px at 90% 30%, rgba(59, 130, 246, 0.14), transparent 62%),
                    radial-gradient(760px 520px at 60% 100%, rgba(162, 82, 255, 0.10), transparent 60%);
            filter: blur(14px) saturate(140%);
            opacity: 0.9;
            z-index: -1;
        }

        html.dark #theme-heo #hero.recent-post-top::before {
            background:
                    radial-gradient(900px 520px at 15% 5%, rgba(234, 179, 8, 0.16), transparent 60%),
                    radial-gradient(820px 520px at 95% 35%, rgba(249, 115, 22, 0.12), transparent 62%),
                    radial-gradient(900px 640px at 55% 105%, rgba(59, 130, 246, 0.10), transparent 60%);
            filter: blur(16px) saturate(130%);
            opacity: 0.85;
        }

        #theme-heo #hero #banners,
        #theme-heo #hero-right-wrapper #top-group > a > div,
        #theme-heo #hero-right-wrapper #today-card #card-body {
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.45) !important;
            background: rgba(255, 255, 255, 0.62) !important;
            -webkit-backdrop-filter: saturate(210%) blur(24px);
            backdrop-filter: saturate(210%) blur(24px);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 22px 58px rgba(0, 0, 0, 0.10) !important;
            overflow: hidden;
        }

        /* iOS 边缘扫光效果 */
        #theme-heo #hero-right-wrapper #top-group > a > div::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.3),
                    transparent
            );
            transform: skewX(-20deg);
            transition: 0.6s;
            z-index: 5;
        }

        #theme-heo #hero-right-wrapper #top-group > a > div:hover::after {
            left: 150%;
        }

        html.dark #theme-heo #hero-right-wrapper #top-group > a > div::after {
            background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(234, 179, 8, 0.2),
                    transparent
            );
        }

        html.dark #theme-heo #hero #banners,
        html.dark #theme-heo #hero-right-wrapper #top-group > a > div,
        html.dark #theme-heo #hero-right-wrapper #today-card #card-body {
            border-color: rgba(255, 255, 255, 0.09) !important;
            background: rgba(27, 28, 32, 0.56) !important;
            -webkit-backdrop-filter: saturate(170%) blur(26px);
            backdrop-filter: saturate(170%) blur(26px);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 26px 70px rgba(0, 0, 0, 0.34) !important;
        }

        @media (hover: hover) {
            #theme-heo #hero #banners:hover,
            #theme-heo #hero-right-wrapper #top-group > a > div:hover,
            #theme-heo #hero-right-wrapper #today-card #card-body:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10), 0 36px 110px rgba(0, 0, 0, 0.14) !important;
            }

            html.dark #theme-heo #hero #banners:hover,
            html.dark #theme-heo #hero-right-wrapper #top-group > a > div:hover,
            html.dark #theme-heo #hero-right-wrapper #today-card #card-body:hover {
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.42), 0 34px 96px rgba(0, 0, 0, 0.38) !important;
            }
        }

        @keyframes heoHeroFloat {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(-3px);
            }
        }

        #theme-heo .heo-hero-banner__title {
            top: 0;
            max-width: 24rem;
            transform: translate3d(0, 0, 0);
        }

        #theme-heo .heo-hero-banner__title-pill {
            padding: 1rem 1.15rem 0.9rem;
            border: 1px solid rgba(255, 255, 255, 0.42);
            border-radius: 1.5rem;
            background: rgba(255, 255, 255, 0.34);
            -webkit-backdrop-filter: saturate(190%) blur(18px);
            backdrop-filter: saturate(190%) blur(18px);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.62);
        }

        #theme-heo .heo-hero-banner__subtitle-wrap {
            margin-left: 1.25rem;
            padding-left: 0.1rem;
        }

        #theme-heo .heo-hero-banner__subtitle {
            max-width: 18rem;
            line-height: 1.7;
        }

        #theme-heo .heo-hero-banner__cover::before {
            content: '';
            position: absolute;
            inset: -12% 22% auto -18%;
            height: 72%;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0) 72%);
            filter: blur(14px);
            opacity: 0.92;
        }

        #theme-heo .heo-hero-banner__cover-content {
            position: relative;
            z-index: 1;
            margin-top: 1.4rem;
        }

        #theme-heo .heo-hero-top-card {
            transform-origin: center bottom;
        }

        #theme-heo .heo-hero-top-card--primary {
            margin-top: -0.25rem;
        }

        #theme-heo .heo-hero-top-card--secondary {
            margin-top: 0.55rem;
        }

        #theme-heo .heo-hero-top-card__cover {
            transition: transform 0.7s var(--heo-ease), filter 0.4s var(--heo-ease);
        }

        #theme-heo .heo-hero-top-card:hover .heo-hero-top-card__cover {
            transform: scale(1.06);
            filter: saturate(108%);
        }

        #theme-heo .heo-hero-top-card__title {
            position: relative;
            z-index: 1;
        }

        #theme-heo .heo-hero-top-card__badge {
            background: linear-gradient(135deg, rgba(79, 101, 240, 0.94), rgba(99, 102, 241, 0.82));
            box-shadow: 0 12px 24px rgba(79, 101, 240, 0.22);
        }

        html.dark #theme-heo .heo-hero-top-card__badge {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.82));
            box-shadow: 0 12px 24px rgba(120, 53, 15, 0.28);
        }

        #theme-heo .heo-hero-menu-card {
            overflow: visible;
        }

        #theme-heo .heo-hero-menu-card::before {
            content: '';
            position: absolute;
            inset: auto auto -12px 12px;
            width: 48px;
            height: 48px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.18);
            filter: blur(2px);
            opacity: 0.75;
            transition: transform var(--heo-dur) var(--heo-ease), opacity var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-hero-menu-card:hover::before {
            transform: translate3d(10px, -6px, 0) scale(1.1);
            opacity: 0.92;
        }

        #theme-heo .heo-hero-menu-card--primary {
            transform: translateY(-4px);
        }

        #theme-heo .heo-hero-menu-card--secondary {
            transform: translateY(6px);
        }

        #theme-heo .heo-hero-menu-card--tertiary {
            transform: translateY(1px);
        }

        #theme-heo .heo-hero-menu-card:hover {
            transform: translateY(-2px) scale(1.015);
        }

        html.dark #theme-heo .heo-hero-banner__title-pill {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(15, 23, 42, 0.28);
            box-shadow: 0 16px 38px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        html.dark #theme-heo .heo-hero-banner__cover::before {
            background: radial-gradient(circle, rgba(255, 244, 214, 0.18) 0%, rgba(255, 244, 214, 0) 72%);
        }


        #theme-heo .heo-hero-banner__headline {
            color: var(--heo-card-title);
            letter-spacing: -0.02em;
        }

        #theme-heo .heo-hero-banner__subtitle {
            color: var(--heo-card-text);
        }

        #theme-heo .heo-hero-banner__cover {
            background: linear-gradient(135deg, rgba(79, 101, 240, 0.78), rgba(99, 102, 241, 0.52)) !important;
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        #theme-heo .heo-hero-banner__cover-title {
            text-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
        }

        #theme-heo .heo-hero-banner__cover-arrow {
            color: rgba(255, 255, 255, 0.82);
        }

        html.dark #theme-heo .heo-hero-banner__title {
            text-shadow: none;
        }

        html.dark #theme-heo .heo-hero-banner__headline {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-hero-banner__subtitle {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-hero-banner__cover {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.62), rgba(120, 53, 15, 0.38)) !important;
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        #theme-heo .heo-hero-menu-grid {
            gap: 0.78rem;
        }

        #theme-heo .heo-hero-menu-card__content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 0.22rem;
        }

        #theme-heo .heo-hero-menu-card__label {
            display: inline-block;
            line-height: 1.2;
            letter-spacing: -0.01em;
            text-shadow: 0 1px 10px rgba(15, 23, 42, 0.12);
        }

        #theme-heo .heo-hero-menu-card__underline {
            opacity: 0.92;
        }

        #theme-heo .heo-hero-menu-card__icon {
            color: rgba(255, 255, 255, 0.88);
            filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.12));
        }

        #theme-heo .heo-today-card-shell {
            isolation: isolate;
        }

        #theme-heo .heo-today-card {
            border-color: rgba(255, 255, 255, 0.12) !important;
        }

        #theme-heo .heo-today-card__info {
            position: relative;
            z-index: 20;
        }

        #theme-heo .heo-hero-shell {
            grid-template-columns: minmax(0, 2.35fr) minmax(18rem, 1fr);
            gap: 1rem;
            align-items: stretch;
        }

        #theme-heo .heo-hero-slider,
        #theme-heo .heo-hero-books,
        #theme-heo .heo-mobile-reading-entry {
            border-radius: 1.7rem !important;
        }

        #theme-heo .heo-hero-slider {
            min-height: 31rem;
            position: relative;
        }

        #theme-heo .heo-hero-slider__stage {
            position: relative;
            display: flex;
            min-height: 23rem;
            height: 100%;
            isolation: isolate;
        }

        #theme-heo .heo-hero-slider__nav {
            position: absolute;
            inset: 50% 0.7rem auto 0.7rem;
            transform: translateY(-50%);
            z-index: 24;
            display: flex;
            align-items: center;
            justify-content: space-between;
            pointer-events: none;
        }

        #theme-heo .heo-hero-slider__nav-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.28);
            background: rgba(15, 23, 42, 0.26);
            color: rgba(255, 255, 255, 0.98);
            -webkit-backdrop-filter: blur(16px) saturate(160%);
            backdrop-filter: blur(16px) saturate(160%);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
            opacity: 0.82;
            pointer-events: auto;
            transition: transform var(--heo-dur) var(--heo-ease), opacity var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-hero-slider:hover .heo-hero-slider__nav-btn {
            opacity: 0.96;
        }

        #theme-heo .heo-hero-slider__nav-btn:hover {
            transform: scale(1.06);
            border-color: rgba(255, 255, 255, 0.46);
            background: rgba(15, 23, 42, 0.4);
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.36);
        }

        #theme-heo .heo-hero-slider__overlay {
            background:
                linear-gradient(180deg, rgba(15, 23, 42, 0.06) 0%, rgba(15, 23, 42, 0.44) 56%, rgba(15, 23, 42, 0.82) 100%),
                linear-gradient(135deg, rgba(79, 101, 240, 0.28), rgba(59, 130, 246, 0.1));
        }

        #theme-heo .heo-hero-slider__content {
            min-height: 23rem;
            padding: 1.35rem 1.45rem 1.25rem;
        }

        #theme-heo .heo-hero-slider__badge,
        #theme-heo .heo-mobile-hero__slide-badge {
            width: fit-content;
            padding: 0.36rem 0.82rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            background: rgba(255, 255, 255, 0.14);
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: rgba(255, 255, 255, 0.96);
        }

        #theme-heo .heo-hero-slider__copy {
            max-width: min(38rem, 78%);
        }

        #theme-heo .heo-hero-slider__eyebrow {
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.82);
        }

        #theme-heo .heo-hero-slider__title {
            margin: 0.7rem 0 0;
            font-size: clamp(2rem, 2.6vw, 2.85rem);
            line-height: 1.04;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #fff;
            text-shadow: 0 14px 32px rgba(15, 23, 42, 0.26);
            text-wrap: balance;
        }

        #theme-heo .heo-hero-slider__summary {
            margin: 0.9rem 0 0;
            max-width: 33rem;
            font-size: 0.98rem;
            line-height: 1.72;
            color: rgba(255, 255, 255, 0.88);
            text-shadow: 0 8px 24px rgba(15, 23, 42, 0.28);
        }

        #theme-heo .heo-hero-slider__thumbs {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.65rem;
            padding: 0.9rem 1rem 1rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.52));
        }

        #theme-heo .heo-hero-slider__thumb {
            display: grid;
            gap: 0.25rem;
            justify-items: start;
            min-width: 0;
            padding: 0.82rem 0.95rem;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 1.12rem;
            background: rgba(255, 255, 255, 0.62);
            transition: transform var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-hero-slider__thumb:hover,
        #theme-heo .heo-hero-slider__thumb.is-active {
            transform: translateY(-1px);
            border-color: rgba(79, 70, 229, 0.22);
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 14px 28px rgba(79, 70, 229, 0.1);
        }

        #theme-heo .heo-hero-slider__thumb-index {
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: rgba(79, 70, 229, 0.78);
        }

        #theme-heo .heo-hero-slider__thumb-title {
            width: 100%;
            font-size: 0.88rem;
            line-height: 1.45;
            font-weight: 700;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-hero-books {
            display: flex;
            flex-direction: column;
            min-height: 31rem;
            padding: 1.15rem;
            background:
                radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 32%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95)) !important;
        }

        #theme-heo .heo-hero-books__head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
        }

        #theme-heo .heo-hero-books__eyebrow,
        #theme-heo .heo-mobile-reading-entry__eyebrow {
            display: inline-flex;
            align-items: center;
            padding: 0.22rem 0.58rem;
            border-radius: 999px;
            border: 1px solid rgba(99, 102, 241, 0.16);
            background: rgba(99, 102, 241, 0.08);
            color: rgba(79, 70, 229, 0.88);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        #theme-heo .heo-hero-books__title {
            margin: 0.52rem 0 0;
            font-size: 1.18rem;
            line-height: 1.3;
            color: var(--heo-card-title);
            font-weight: 800;
        }

        #theme-heo .heo-hero-books__link,
        #theme-heo .heo-mobile-reading-entry__link {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.45rem 0.76rem;
            border-radius: 999px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: rgba(255, 255, 255, 0.72);
            color: var(--heo-card-title);
            font-size: 0.78rem;
            font-weight: 600;
            white-space: nowrap;
            flex-shrink: 0;
        }

        #theme-heo .heo-hero-books__link:hover,
        #theme-heo .heo-mobile-reading-entry__link:hover {
            transform: translateY(-1px);
            border-color: rgba(79, 70, 229, 0.18);
            color: rgb(79, 70, 229);
        }

        #theme-heo .heo-hero-books__desc {
            margin: 0.8rem 0 1rem;
            color: var(--heo-card-text);
            font-size: 0.85rem;
            line-height: 1.68;
        }

        #theme-heo .heo-hero-books__list {
            display: grid;
            gap: 0.72rem;
            margin-top: auto;
        }

        #theme-heo .heo-hero-books__item {
            display: grid;
            grid-template-columns: 4.3rem minmax(0, 1fr);
            gap: 0.8rem;
            align-items: center;
            min-width: 0;
            padding: 0.72rem;
            border-radius: 1.2rem;
            border: 1px solid rgba(148, 163, 184, 0.16);
            background: rgba(255, 255, 255, 0.82);
            transition: transform var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-hero-books__item:hover {
            transform: translateY(-2px);
            border-color: rgba(99, 102, 241, 0.18);
            background: rgba(255, 255, 255, 0.94);
            box-shadow: 0 16px 32px rgba(79, 70, 229, 0.1);
        }

        #theme-heo .heo-hero-books__cover-wrap {
            width: 4.3rem;
            min-width: 4.3rem;
            height: 5.9rem;
            border-radius: 1rem;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.58);
            box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12);
        }

        #theme-heo .heo-hero-books__cover,
        #theme-heo .heo-mobile-reading-entry__cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        #theme-heo .heo-hero-books__cover--placeholder,
        #theme-heo .heo-mobile-reading-entry__cover--placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.86), rgba(59, 130, 246, 0.72));
            color: white;
            font-size: 1rem;
            font-weight: 800;
        }

        #theme-heo .heo-hero-books__meta {
            min-width: 0;
        }

        #theme-heo .heo-hero-books__book-title {
            color: var(--heo-card-title);
            font-size: 0.96rem;
            line-height: 1.45;
            font-weight: 700;
        }

        #theme-heo .heo-hero-books__item--skeleton {
            pointer-events: none;
        }

        #theme-heo .heo-hero-books__cover--skeleton,
        #theme-heo .heo-hero-books__line,
        #theme-heo .heo-mobile-reading-entry__cover--skeleton {
            position: relative;
            overflow: hidden;
            background: linear-gradient(90deg, rgba(226, 232, 240, 0.76) 0%, rgba(241, 245, 249, 0.96) 50%, rgba(226, 232, 240, 0.76) 100%);
            background-size: 200% 100%;
            animation: heo-skeleton-shimmer 1.4s ease-in-out infinite;
        }

        #theme-heo .heo-hero-books__line {
            border-radius: 999px;
        }

        #theme-heo .heo-hero-books__line--title {
            width: 82%;
            height: 0.92rem;
        }

        #theme-heo .heo-hero-books__line--author {
            width: 56%;
            height: 0.72rem;
            margin-top: 0.45rem;
        }

        #theme-heo .heo-hero-books__empty {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            gap: 0.95rem;
            align-items: center;
            padding: 1rem;
            border-radius: 1.3rem;
            border: 1px dashed rgba(99, 102, 241, 0.24);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(238, 242, 255, 0.78));
            transition: transform var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-hero-books__empty:hover {
            transform: translateY(-2px);
            border-color: rgba(79, 70, 229, 0.28);
            box-shadow: 0 18px 34px rgba(79, 70, 229, 0.12);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(224, 231, 255, 0.9));
        }

        #theme-heo .heo-hero-books__empty-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;
            border-radius: 1rem;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.92), rgba(59, 130, 246, 0.84));
            color: #fff;
            font-size: 1rem;
            font-weight: 800;
            box-shadow: 0 14px 26px rgba(79, 70, 229, 0.22);
        }

        #theme-heo .heo-hero-books__empty-copy {
            min-width: 0;
        }

        #theme-heo .heo-hero-books__empty-title {
            color: var(--heo-card-title);
            font-size: 0.98rem;
            line-height: 1.35;
            font-weight: 700;
        }

        #theme-heo .heo-hero-books__empty-text {
            margin-top: 0.28rem;
            color: var(--heo-card-text);
            font-size: 0.82rem;
            line-height: 1.6;
        }

        #theme-heo .heo-hero-books__empty-action {
            grid-column: 2;
            display: inline-flex;
            align-items: center;
            width: fit-content;
            margin-top: 0.12rem;
            padding: 0.3rem 0.68rem;
            border-radius: 999px;
            background: rgba(79, 70, 229, 0.08);
            color: rgba(79, 70, 229, 0.9);
            font-size: 0.76rem;
            font-weight: 700;
        }

        #theme-heo .heo-mobile-reading-entry__empty-text {
            color: var(--heo-card-text);
            font-size: 0.8rem;
            line-height: 1.55;
        }

        #theme-heo .heo-mobile-reading-entry__cover--empty {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.88), rgba(59, 130, 246, 0.76));
            color: #fff;
            font-size: 0.98rem;
            font-weight: 800;
        }

        #theme-heo .heo-mobile-reading-entry__cover-link--empty {
            border: 1px dashed rgba(99, 102, 241, 0.24);
        }

        html.dark #theme-heo .heo-hero-books__empty {
            border-color: rgba(245, 158, 11, 0.2);
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.82));
        }

        html.dark #theme-heo .heo-hero-books__empty:hover {
            border-color: rgba(245, 158, 11, 0.28);
            box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28);
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.84), rgba(30, 41, 59, 0.92));
        }

        html.dark #theme-heo .heo-hero-books__empty-title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-hero-books__empty-text,
        html.dark #theme-heo .heo-mobile-reading-entry__empty-text {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-hero-books__empty-action {
            background: rgba(245, 158, 11, 0.12);
            color: rgba(255, 230, 179, 0.94);
        }

        html.dark #theme-heo .heo-mobile-reading-entry__cover-link--empty {
            border-color: rgba(245, 158, 11, 0.2);
        }

        html.dark #theme-heo .heo-hero-slider__overlay {
            background:
                linear-gradient(180deg, rgba(2, 6, 23, 0.18) 0%, rgba(2, 6, 23, 0.62) 58%, rgba(2, 6, 23, 0.9) 100%),
                linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(30, 41, 59, 0.12));
        }

        html.dark #theme-heo .heo-hero-slider__nav-btn {
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(2, 6, 23, 0.42);
            box-shadow: 0 16px 34px rgba(0, 0, 0, 0.38);
        }

        html.dark #theme-heo .heo-hero-slider__nav-btn:hover {
            border-color: rgba(245, 158, 11, 0.28);
            background: rgba(30, 41, 59, 0.64);
            color: rgba(255, 230, 179, 0.98);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.42);
        }

        html.dark #theme-heo .heo-hero-slider__thumbs {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.56));
        }

        html.dark #theme-heo .heo-hero-slider__thumb {
            border-color: rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.42);
        }

        html.dark #theme-heo .heo-hero-slider__thumb:hover,
        html.dark #theme-heo .heo-hero-slider__thumb.is-active {
            border-color: rgba(245, 158, 11, 0.2);
            background: rgba(30, 41, 59, 0.8);
            box-shadow: 0 16px 30px rgba(0, 0, 0, 0.3);
        }

        html.dark #theme-heo .heo-hero-slider__thumb-index {
            color: rgba(255, 230, 179, 0.88);
        }

        html.dark #theme-heo .heo-hero-slider__thumb-title,
        html.dark #theme-heo .heo-hero-books__title,
        html.dark #theme-heo .heo-hero-books__book-title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-hero-books {
            background:
                radial-gradient(circle at top right, rgba(245, 158, 11, 0.12), transparent 32%),
                linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.8)) !important;
        }

        html.dark #theme-heo .heo-hero-books__eyebrow,
        html.dark #theme-heo .heo-mobile-reading-entry__eyebrow {
            border-color: rgba(245, 158, 11, 0.18);
            background: rgba(245, 158, 11, 0.12);
            color: rgba(255, 230, 179, 0.92);
        }

        html.dark #theme-heo .heo-hero-books__desc,
        html.dark #theme-heo .heo-hero-books__book-author {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-hero-books__link,
        html.dark #theme-heo .heo-mobile-reading-entry__link {
            border-color: rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.36);
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-hero-books__link:hover,
        html.dark #theme-heo .heo-mobile-reading-entry__link:hover {
            border-color: rgba(245, 158, 11, 0.22);
            color: rgba(255, 230, 179, 0.96);
        }

        #theme-heo .heo-mobile-reading-entry__link,
        html.dark #theme-heo .heo-mobile-reading-entry__link {
            padding: 0.4rem 0.68rem;
            font-size: 0.74rem;
            font-weight: 600;
            opacity: 0.88;
        }

        #theme-heo .heo-mobile-reading-entry__link:hover,
        html.dark #theme-heo .heo-mobile-reading-entry__link:hover {
            opacity: 1;
        }


        html.dark #theme-heo .heo-hero-books__item {
            border-color: rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.42);
        }

        html.dark #theme-heo .heo-hero-books__item:hover {
            border-color: rgba(245, 158, 11, 0.16);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
        }

        @keyframes heo-skeleton-shimmer {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }

        @media (max-width: 1439px) {
            #theme-heo .heo-hero-shell {
                grid-template-columns: minmax(0, 2.15fr) minmax(17rem, 1fr);
            }
        }

        @media (max-width: 1365px) {
            #theme-heo .heo-hero-books__desc {
                display: none;
            }
        }


        @media (max-width: 1279px) {
            #theme-heo .heo-hero-menu-grid {
                gap: 0.55rem;
            }

            #theme-heo .heo-mobile-hero {
                display: flex;
                flex-direction: column;
                gap: 0.72rem;
            }

            #theme-heo .heo-mobile-reading-entry {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.9rem;
                padding: 0.95rem 1rem;
                min-height: 6.5rem;
            }

            #theme-heo .heo-mobile-reading-entry__head {
                display: flex;
                flex: 1;
                min-width: 0;
                align-items: flex-start;
                justify-content: space-between;
                gap: 0.95rem;
            }

            #theme-heo .heo-mobile-reading-entry__head-main {
                display: flex;
                min-width: 0;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.45rem;
            }

            #theme-heo .heo-mobile-reading-entry__title {
                margin: 0;
                color: var(--heo-card-title);
                font-size: 0.98rem;
                line-height: 1.35;
                font-weight: 700;
            }

            #theme-heo .heo-mobile-reading-entry__covers {
                position: relative;
                width: 5.75rem;
                height: 5rem;
                flex-shrink: 0;
            }

            #theme-heo .heo-mobile-reading-entry__cover-link {
                display: block;
                overflow: hidden;
                border-radius: 1rem;
                box-shadow: 0 14px 26px rgba(15, 23, 42, 0.16);
            }

            #theme-heo .heo-mobile-reading-entry__cover-link--primary {
                position: relative;
                z-index: 2;
                width: 3.55rem;
                height: 4.92rem;
            }

            #theme-heo .heo-mobile-reading-entry__cover-link--peek {
                position: absolute;
                top: 0.34rem;
                right: -0.9rem;
                z-index: 1;
                width: 2.7rem;
                height: 4.06rem;
                opacity: 0.58;
                transform: scale(0.94);
                filter: saturate(0.86);
            }

            #theme-heo .heo-mobile-hero__slider {
                margin: 0 -0.1rem;
                padding: 0.1rem 0.1rem 0.4rem;
                scroll-snap-type: x proximity;
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            #theme-heo .heo-mobile-hero__slider::-webkit-scrollbar {
                display: none;
            }

            #theme-heo .heo-mobile-hero__slide {
                width: min(86vw, 21rem);
                min-height: 15.5rem;
                border-radius: 1.45rem;
                border: 1px solid rgba(255, 255, 255, 0.46);
                background: rgba(255, 255, 255, 0.18);
                box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
                scroll-snap-align: start;
                isolation: isolate;
            }

            #theme-heo .heo-mobile-hero__slide-overlay {
                background:
                    linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.58) 68%, rgba(15, 23, 42, 0.82) 100%),
                    linear-gradient(135deg, rgba(79, 101, 240, 0.28), rgba(59, 130, 246, 0.08));
            }

            #theme-heo .heo-mobile-hero__slide-content {
                min-height: 16.75rem;
            }

            #theme-heo .heo-mobile-hero__slide-title {
                font-size: 1.65rem;
                line-height: 1.08;
                letter-spacing: -0.03em;
                text-wrap: balance;
                text-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
            }

            #theme-heo .heo-mobile-hero__slide-meta {
                color: rgba(255, 255, 255, 0.92);
            }

            html.dark #theme-heo .heo-mobile-reading-entry__title {
                color: var(--heo-card-title-dark);
            }

            html.dark #theme-heo .heo-mobile-reading-entry__cover-link {
                box-shadow: 0 14px 26px rgba(0, 0, 0, 0.32);
            }

            html.dark #theme-heo .heo-mobile-reading-entry__cover-link--peek {
                opacity: 0.5;
            }

            html.dark #theme-heo .heo-mobile-hero__slide {
                border-color: rgba(255, 255, 255, 0.12);
                box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
            }

            html.dark #theme-heo .heo-mobile-hero__slide-overlay {
                background:
                    linear-gradient(180deg, rgba(2, 6, 23, 0.16) 0%, rgba(2, 6, 23, 0.62) 68%, rgba(2, 6, 23, 0.88) 100%),
                    linear-gradient(135deg, rgba(245, 158, 11, 0.24), rgba(30, 41, 59, 0.12));
            }

            html.dark #theme-heo .heo-mobile-hero__slide-badge {
                border-color: rgba(255, 255, 255, 0.12);
                background: rgba(15, 23, 42, 0.28);
            }
        }

        html.dark #theme-heo .heo-hero-menu-card__label {
            text-shadow: 0 1px 12px rgba(0, 0, 0, 0.2);
        }

        html.dark #theme-heo .heo-hero-menu-card__icon {
            color: rgba(255, 247, 237, 0.9);
            filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.2));
        }


        #theme-heo .heo-hero-menu-card--blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.88), rgba(96, 165, 250, 0.72));
        }

        #theme-heo .heo-hero-menu-card--amber {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.88), rgba(251, 191, 36, 0.72));
        }

        #theme-heo .heo-hero-menu-card--teal {
            background: linear-gradient(135deg, rgba(45, 212, 191, 0.86), rgba(34, 211, 238, 0.68));
        }

        html.dark #theme-heo .heo-hero-menu-card {
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        #theme-heo .heo-today-card__more {
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.18);
            -webkit-backdrop-filter: saturate(180%) blur(16px);
            backdrop-filter: saturate(180%) blur(16px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }

        #theme-heo .heo-today-card__more:hover {
            background: rgba(255, 255, 255, 0.28);
            border-color: rgba(255, 255, 255, 0.28);
        }

        html.dark #theme-heo .heo-today-card__more {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(15, 23, 42, 0.26);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        html.dark #theme-heo .heo-today-card__more:hover {
            background: rgba(30, 41, 59, 0.38);
            border-color: rgba(255, 255, 255, 0.16);
        }


        @media (prefers-reduced-motion: reduce) {
            #theme-heo #hero #banners {
                animation: none;
            }
        }

        /* TodayCard 彻底修复：拨云见日，让文字变锐利 */
        #theme-heo #today-card #today-card-info {
            position: relative;
            z-index: 20 !important; /* 强制文字在图片之上 */
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        #theme-heo .heo-today-card__badge {
            padding: 0.36rem 0.7rem;
            border: 1px solid rgba(255, 255, 255, 0.24);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.74rem;
            font-weight: 600;
            line-height: 1;
            letter-spacing: 0.01em;
            -webkit-backdrop-filter: saturate(180%) blur(16px);
            backdrop-filter: saturate(180%) blur(16px);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform: translateY(-6px);
        }

        #theme-heo .heo-today-card__copy {
            max-width: min(28rem, 78%);
            padding-right: 1.5rem;
            transform: translateY(-12px);
        }

        #theme-heo .heo-today-card__eyebrow {
            width: fit-content;
            margin-bottom: 0.72rem;
            padding: 0.24rem 0.64rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.86) !important;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        #theme-heo .heo-today-card__title {
            max-width: 22rem;
            line-height: 1.04;
            letter-spacing: -0.03em;
            text-wrap: balance;
        }

        #theme-heo .heo-today-card__more {
            flex-shrink: 0;
            align-self: flex-end;
            margin-left: 1rem;
            padding-left: 0.85rem;
            padding-right: 0.95rem;
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        #theme-heo .heo-today-card__more {
            min-height: 2.5rem;
            font-size: 0.92rem;
        }

        #theme-heo .heo-today-card__more-icon {
            width: 1.35rem;
            height: 1.35rem;
            margin-right: 0.45rem;
            box-shadow: 0 8px 18px rgba(255, 255, 255, 0.18);
        }

        /* 把图片层级降低，并移除可能导致模糊的滤镜 */
        #theme-heo #today-card #today-card-cover {
            z-index: 1;
            filter: none !important; /* 移除图片本身的模糊干扰 */
        }

        /* 重新设计文字底部的黑科技感遮罩（在文字之下，图片之上） */
        #theme-heo #today-card #today-card-info::before {
            content: '';
            position: absolute;
            inset: -82px -40px -40px -40px; /* 向上延伸遮罩范围 */
            pointer-events: none;
            background: linear-gradient(
                    to top,
                    rgba(0, 0, 0, 0.74) 0%,
                    rgba(0, 0, 0, 0.32) 42%,
                    rgba(0, 0, 0, 0) 100%
            );
            z-index: -1; /* 保证在文字下面 */
        }

        /* 增强文字本身的对比度 */
        #theme-heo #today-card-info .text-3xl {
            color: #ffffff !important;
            text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
            font-weight: 800 !important;
        }

        #theme-heo #today-card-info .text-xs {
            color: rgba(255, 255, 255, 0.9) !important;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        /* 移除文字层自带的噪点，因为它会模糊字体边缘 */
        #theme-heo #today-card #today-card-info::after {
            display: none;
        }

        html.dark #theme-heo #today-card #today-card-info::before {
            background:
                    linear-gradient(
                            to top,
                            rgba(0, 0, 0, 0.82) 0%,
                            rgba(0, 0, 0, 0.50) 35%,
                            rgba(0, 0, 0, 0.12) 70%,
                            rgba(0, 0, 0, 0) 100%
                    );
        }

        html.dark #theme-heo .heo-today-card__badge {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(15, 23, 42, 0.24);
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        html.dark #theme-heo .heo-today-card__eyebrow {
            background: rgba(15, 23, 42, 0.18);
            border-color: rgba(255, 255, 255, 0.06);
            color: rgba(255, 244, 214, 0.84) !important;
        }

        html.dark #theme-heo .heo-today-card__more {
            border-color: rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.2);
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        html.dark #theme-heo .heo-today-card__more:hover {
            background: rgba(30, 41, 59, 0.3);
            border-color: rgba(255, 255, 255, 0.14);
        }

        html.dark #theme-heo .heo-today-card__more-icon {
            box-shadow: 0 6px 14px rgba(15, 23, 42, 0.24);
        }

        html.dark #theme-heo #today-card #today-card-info::after {
            opacity: 0.12;
        }

        @media (prefers-reduced-motion: reduce) {
            #theme-heo #today-card #today-card-info::after {
                opacity: 0.06;
            }
        }

        #theme-heo {
            background: transparent !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: var(--heo-font-sans);
            color: var(--heo-text);
            text-rendering: optimizeLegibility;
        }

        #theme-heo #announcement-content .notion {
            color: white;
        }

        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(60, 60, 67, 0.28);
            border-radius: 999px;
            cursor: pointer;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(60, 60, 67, 0.42);
        }

        html.dark ::-webkit-scrollbar-thumb {
            background: rgba(235, 235, 245, 0.2);
        }

        html.dark ::-webkit-scrollbar-thumb:hover {
            background: rgba(235, 235, 245, 0.3);
        }

        * {
            box-sizing: border-box;
        }

        #theme-heo a,
        #theme-heo button,
        #theme-heo input,
        #theme-heo textarea,
        #theme-heo select,
        #theme-heo [role='button'] {
            transition: background-color var(--heo-dur-fast) var(--heo-ease),
            border-color var(--heo-dur-fast) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease),
            transform var(--heo-dur) var(--heo-ease),
            filter var(--heo-dur) var(--heo-ease);
        }

        #theme-heo nav#nav.bg-white,
        #theme-heo nav#nav.dark\:bg-\[\#18171d\] {
            box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 22px 60px rgba(0, 0, 0, 0.08);
        }

        html.dark #theme-heo nav#nav.dark\:bg-\[\#18171d\] {
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04), 0 26px 70px rgba(0, 0, 0, 0.38);
        }

        #theme-heo nav#nav.bg-white {
            background: rgba(255, 255, 255, 0.72) !important;
            -webkit-backdrop-filter: saturate(210%) blur(24px);
            backdrop-filter: saturate(210%) blur(24px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        html.dark #theme-heo nav#nav.dark\:bg-\[\#18171d\] {
            background: rgba(27, 28, 32, 0.65) !important;
            -webkit-backdrop-filter: saturate(170%) blur(26px);
            backdrop-filter: saturate(170%) blur(26px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04), 0 14px 36px rgba(0, 0, 0, 0.35);
        }

        #theme-heo nav#nav.heo-top-nav {
            background: transparent !important;
            border-bottom: none !important;
            box-shadow: none !important;
        }

        #theme-heo nav#nav.heo-top-nav.bg-white,
        #theme-heo nav#nav.heo-top-nav.dark\:bg-\[\#18171d\] {
            background: transparent !important;
            border-bottom: none !important;
            box-shadow: none !important;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__inner {
            position: relative;
            padding-top: 0.65rem;
            padding-bottom: 0.65rem;
            gap: 1rem;
            background: transparent !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__inner {
            padding-top: 0.4rem;
            padding-bottom: 0.4rem;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__inner,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__inner {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-header-action-group,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile.heo-nav-menu {
            border-color: transparent !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__headline {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-header-action-group,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating #nav-bar-swipe nav#nav-mobile.heo-nav-menu {
            border: 1px solid var(--heo-nav-pill-border);
            background: var(--heo-nav-pill-bg) !important;
            box-shadow: var(--heo-nav-pill-shadow) !important;
            -webkit-backdrop-filter: var(--heo-nav-pill-blur) !important;
            backdrop-filter: var(--heo-nav-pill-blur) !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-top-nav__headline {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-top-nav__brand,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-header-action-group,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating #nav-bar-swipe nav#nav-mobile.heo-nav-menu {
            border-color: var(--heo-nav-pill-dark-border) !important;
            background: var(--heo-nav-pill-dark-bg) !important;
            box-shadow: var(--heo-nav-pill-dark-shadow) !important;
            -webkit-backdrop-filter: var(--heo-nav-pill-dark-blur) !important;
            backdrop-filter: var(--heo-nav-pill-dark-blur) !important;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--floating .heo-top-nav__headline {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-header-action-group {
            padding: 0.08rem;
            min-width: max-content;
            flex: 0 0 auto;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile {
            width: auto;
            flex: 0 0 auto;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__rail {
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            min-width: max-content;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__rail--brand {
            justify-content: flex-start;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__rail--actions {
            margin-left: auto;
            justify-content: flex-end;
        }


        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile {
            padding: 0.46rem 0.9rem;
            min-height: 2.72rem;
        }


        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-header-action-group {
            min-height: 3rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav .heo-header-action-group,
        #theme-heo nav#nav.heo-top-nav #nav-bar-swipe nav#nav-mobile.heo-nav-menu,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline {
            border: 1px solid var(--heo-nav-pill-border);
            background: var(--heo-nav-pill-bg) !important;
            color: #0f172a;
            -webkit-backdrop-filter: var(--heo-nav-pill-blur) !important;
            backdrop-filter: var(--heo-nav-pill-blur) !important;
            box-shadow: var(--heo-nav-pill-shadow);
        }

        html.dark #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand,
        html.dark #theme-heo nav#nav.heo-top-nav .heo-header-action-group,
        html.dark #theme-heo nav#nav.heo-top-nav #nav-bar-swipe nav#nav-mobile.heo-nav-menu {
            border-color: var(--heo-nav-pill-dark-border);
            background: var(--heo-nav-pill-dark-bg) !important;
            color: #f8fafc;
            box-shadow: var(--heo-nav-pill-dark-shadow);
            -webkit-backdrop-filter: var(--heo-nav-pill-dark-blur) !important;
            backdrop-filter: var(--heo-nav-pill-dark-blur) !important;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile,
        #theme-heo nav#nav.heo-top-nav #nav-bar-swipe nav#nav-mobile.heo-nav-menu,
        #theme-heo nav#nav.heo-top-nav .heo-header-action-group,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline-pill {
            border-radius: var(--heo-nav-pill-radius);
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__rail--brand .heo-top-nav__brand {
            overflow: hidden;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .heo-brand-mark,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .heo-brand-mark {
            display: inline-flex;
            align-items: center;
            flex-wrap: nowrap;
            width: auto;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .heo-brand-mark__text,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .heo-brand-mark__text {
            display: flex;
            align-items: center;
            align-self: center;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .heo-brand-mark__icon {
            justify-content: center;
            line-height: 1;
            width: 1.6rem;
            height: 1.6rem;
            flex: 0 0 1.6rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .heo-brand-mark__text,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .heo-brand-mark__text {
            min-width: 0;
            flex: 0 1 auto;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__icon {
            flex: 0 0 1.6rem;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__text {
            flex: 0 1 auto;
        }


        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand {
            min-width: 0;
            flex-shrink: 0;
            padding: 0.55rem 1rem;
            border-radius: 999px;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile {
            align-items: center;
            min-height: 2.9rem;
            padding: 0.45rem 0.9rem;
            border-radius: 999px;
        }


        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand img,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile img {
            margin-right: 0.7rem !important;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 999px;
            display: block;
        }


        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand #logo-text,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile #logo-text,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand .logo,
        #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .logo {
            color: inherit !important;
            border: none !important;
            background: transparent !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand #logo-text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand .logo,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile #logo-text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile .logo {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
        }


        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark {
            align-items: center;
            gap: 0.42rem;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__text {
            min-height: 1.6rem;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__icon {
            padding-right: 0;
            transform: translateY(0);
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand .heo-brand-mark__text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile .heo-brand-mark__text {
            padding-left: 0;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand img,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile img {
            margin-right: 0 !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand #logo-text,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand--mobile #logo-text {
            display: inline-flex;
            align-items: center;
            min-height: 1.6rem;
            padding: 0.02rem 0.16rem !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand #logo-text > .logo,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile #logo-text > .logo {
            opacity: 1 !important;
            visibility: visible !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand > a > div,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile > a > div {
            gap: 0.5rem;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand img,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--flat .heo-top-nav__brand--mobile img {
            margin-right: 0.5rem !important;
        }


        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline {
            width: var(--heo-nav-headline-max-width);
            min-width: 0;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: var(--heo-nav-headline-pill-max-width);
            min-width: 0;
            min-height: var(--heo-nav-post-headline-pill-min-height);
            padding: var(--heo-nav-post-headline-pill-padding);
            border-radius: var(--heo-nav-pill-radius);
            border: 1px solid var(--heo-nav-post-headline-pill-border) !important;
            background: var(--heo-nav-post-headline-pill-bg) !important;
            box-shadow: var(--heo-nav-post-headline-pill-shadow) !important;
            -webkit-backdrop-filter: var(--heo-nav-post-headline-pill-blur) !important;
            backdrop-filter: var(--heo-nav-post-headline-pill-blur) !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline-pill h1 {
            display: block;
            width: 100%;
            min-width: 0;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.08;
            white-space: nowrap;
            color: var(--heo-nav-post-headline-text) !important;
            text-shadow: var(--heo-nav-post-headline-text-shadow);
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline-pill {
            border-color: var(--heo-nav-post-headline-pill-dark-border) !important;
            background: var(--heo-nav-post-headline-pill-dark-bg) !important;
            box-shadow: var(--heo-nav-post-headline-pill-dark-shadow) !important;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__headline-pill h1 {
            color: var(--heo-nav-post-headline-dark-text) !important;
            text-shadow: none;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-top-nav__brand,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat .heo-header-action-btn {
            color: rgba(255, 247, 237, 0.92) !important;
        }


        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:hover,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:hover,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible {
            color: var(--heo-nav-focus-color) !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:hover .heo-nav-menu__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:hover .heo-nav-menu__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:hover .heo-nav-menu__chevron,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible .heo-nav-menu__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible .heo-nav-menu__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible .heo-nav-menu__chevron {
            color: currentColor !important;
            opacity: 1;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:hover,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:hover,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible {
            color: var(--heo-nav-focus-dark-color) !important;
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:hover,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible {
            background: var(--heo-nav-focus-bg) !important;
            border-color: var(--heo-nav-focus-border) !important;
            box-shadow: var(--heo-nav-submenu-hover-shadow) !important;
            color: var(--heo-nav-focus-color) !important;
            transform: translateY(-1px);
        }

        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:hover .heo-nav-submenu__icon,
        #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible .heo-nav-submenu__icon {
            color: currentColor !important;
            opacity: 1;
        }

        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:hover,
        html.dark #theme-heo nav#nav.heo-top-nav.heo-top-nav--post.heo-top-nav--flat #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible {
            background: var(--heo-nav-focus-dark-bg) !important;
            border-color: var(--heo-nav-focus-dark-border) !important;
            box-shadow: var(--heo-nav-submenu-hover-dark-shadow) !important;
            color: var(--heo-nav-focus-dark-color) !important;
            transform: translateY(-1px);
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            max-width: var(--heo-nav-headline-max-width);
            min-width: 0;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: var(--heo-nav-headline-pill-max-width);
            min-width: 0;
            min-height: var(--heo-nav-headline-pill-min-height);
            padding: var(--heo-nav-headline-pill-padding);
            border-radius: var(--heo-nav-pill-radius);
            border: 1px solid var(--heo-nav-headline-pill-border) !important;
            background: var(--heo-nav-headline-pill-bg) !important;
            box-shadow: var(--heo-nav-headline-pill-shadow) !important;
            -webkit-backdrop-filter: var(--heo-nav-headline-pill-blur) !important;
            backdrop-filter: var(--heo-nav-headline-pill-blur) !important;
        }

        #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline-pill h1 {
            display: block;
            width: 100%;
            min-width: 0;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.1;
            white-space: nowrap;
            color: var(--heo-nav-headline-text) !important;
            text-shadow: var(--heo-nav-headline-text-shadow);
        }

        html.dark #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline-pill {
            border-color: var(--heo-nav-headline-pill-dark-border) !important;
            background: var(--heo-nav-headline-pill-dark-bg) !important;
            box-shadow: var(--heo-nav-headline-pill-dark-shadow) !important;
            -webkit-backdrop-filter: var(--heo-nav-headline-pill-dark-blur) !important;
            backdrop-filter: var(--heo-nav-headline-pill-dark-blur) !important;
        }

        html.dark #theme-heo nav#nav.heo-top-nav .heo-top-nav__headline-pill h1 {
            color: var(--heo-nav-headline-dark-text) !important;
        }




        @media (max-width: 1023px) {
            #theme-heo nav#nav.heo-top-nav .heo-top-nav__inner {
                padding-top: 0;
                padding-bottom: 0;
                gap: 0.75rem;
            }

            #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile {
                max-width: calc(100vw - 13.25rem);
            }

            #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile a,
            #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile > a > div,
            #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile #logo-text {
                min-width: 0;
                max-width: 100%;
            }

            #theme-heo nav#nav.heo-top-nav .heo-top-nav__brand--mobile .logo {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 1rem;
                line-height: 1.2;
            }

            #theme-heo nav#nav.heo-top-nav .heo-header-action-group--mobile {
                gap: 0.18rem;
                padding: 0.22rem 0.24rem;
                min-height: 2.9rem;
            }

            #theme-heo nav#nav.heo-top-nav .heo-header-action-group--mobile .heo-header-action-btn {
                width: 2.3rem;
                height: 2.3rem;
            }
        }


        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger {
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.42rem;
            padding: 0 0.86rem;
            border-radius: 999px;
            border: 1px solid transparent;
            background: rgba(255, 255, 255, 0.08);
            color: rgba(15, 23, 42, 0.8);
            font-size: 0.9375rem;
            font-weight: 500;
            letter-spacing: 0.02em;
            line-height: 1;
            text-decoration: none !important;
            white-space: nowrap;
            appearance: none;
            -webkit-appearance: none;
            transition: background-color var(--heo-dur-fast) var(--heo-ease),
            border-color var(--heo-dur-fast) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease),
            transform var(--heo-dur) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease);
        }

        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link,
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger {
            background: rgba(255, 255, 255, 0.03);
            color: rgba(226, 232, 240, 0.9);
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__chevron {
            font-size: 0.78rem;
            line-height: 1;
            flex-shrink: 0;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__chevron {
            font-size: 0.7rem;
            opacity: 0.65;
            transition: transform var(--heo-dur-fast) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__chevron.is-open {
            transform: rotate(180deg);
            opacity: 1;
        }

        #theme-heo nav#nav a[aria-current='page'],
        #theme-heo nav#nav a.active,
        #theme-heo nav#nav button[aria-current='page'],
        #theme-heo #nav-bar-swipe nav#nav-mobile a[aria-current='page'],
        #theme-heo #nav-bar-swipe nav#nav-mobile a.active,
        #theme-heo #nav-bar-swipe nav#nav-mobile button[aria-current='page'],
        #theme-heo #nav-bar-swipe nav#nav-mobile button.active {
            position: relative;
            border-radius: var(--heo-nav-pill-radius);
            background: var(--heo-nav-current-bg) !important;
            border: 1px solid var(--heo-nav-current-border) !important;
            box-shadow: var(--heo-nav-current-shadow);
            color: var(--heo-nav-current-color) !important;
            font-weight: 600 !important;
            letter-spacing: 0.02em;
        }

        html.dark #theme-heo nav#nav a[aria-current='page'],
        html.dark #theme-heo nav#nav a.active,
        html.dark #theme-heo nav#nav button[aria-current='page'],
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile a[aria-current='page'],
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile a.active,
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile button[aria-current='page'],
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile button.active {
            background: var(--heo-nav-current-dark-bg) !important;
            border: 1px solid var(--heo-nav-current-dark-border) !important;
            box-shadow: var(--heo-nav-current-dark-shadow);
            color: var(--heo-nav-current-dark-color) !important;
            font-weight: 600 !important;
        }


        @media (max-width: 430px) {
            #theme-heo nav#nav.heo-top-nav.heo-top-nav--mobile-compact .heo-top-nav__inner {
                padding-top: 0.32rem;
                padding-bottom: 0.32rem;
                padding-left: 0.85rem;
                padding-right: 0.85rem;
            }

            #theme-heo nav#nav.heo-top-nav.heo-top-nav--mobile-compact .heo-top-nav__rail--brand {
                display: none;
            }

            #theme-heo nav#nav.heo-top-nav.heo-top-nav--mobile-compact .heo-top-nav__rail--actions {
                width: 100%;
                margin-left: 0;
            }

            #theme-heo nav#nav.heo-top-nav.heo-top-nav--mobile-compact .heo-header-action-group--mobile {
                margin-left: auto;
                gap: 0.12rem;
                min-height: 2.5rem;
                padding: 0.18rem 0.2rem;
            }

            #theme-heo nav#nav.heo-top-nav.heo-top-nav--mobile-compact .heo-header-action-group--mobile .heo-header-action-btn {
                width: 2.12rem;
                height: 2.12rem;
                font-size: 0.96rem;
            }
        }

            html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:hover,
            html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:hover,
            html.dark #theme-heo nav#nav .flex-shrink-0 .cursor-pointer:hover {
                background-color: rgba(154, 52, 18, 0.16) !important;
                border: 1px solid rgba(245, 158, 11, 0.2) !important;
                box-shadow: 0 8px 18px rgba(120, 53, 15, 0.16) !important;
                color: #fde68a !important;
                transform: translateY(-1px);
            }
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item {
            position: relative;
            padding-bottom: 0.6rem;
            margin-bottom: -0.6rem;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 100%;
            height: 0.7rem;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__link.active .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__trigger.active .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__trigger.active .heo-nav-menu__chevron,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__link[aria-current='page'] .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__trigger[aria-current='page'] .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__trigger[aria-current='page'] .heo-nav-menu__chevron {
            color: currentColor !important;
            opacity: 1;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__link .heo-nav-menu__label,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__item > .heo-nav-menu__trigger .heo-nav-menu__label {
            transform: translateY(-0.01em);
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu {
            position: absolute;
            top: calc(100% - 0.22rem);
            left: 0;
            min-width: 12rem;
            padding: 0.42rem;
            border-radius: 1.2rem !important;
            border: 1px solid rgba(226, 232, 240, 0.92) !important;
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12) !important;
            background: rgba(255, 255, 255, 0.92) !important;
            -webkit-backdrop-filter: saturate(210%) blur(20px) !important;
            backdrop-filter: saturate(210%) blur(20px) !important;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translateY(4px);
            transition: opacity var(--heo-dur-fast) var(--heo-ease),
            transform var(--heo-dur-fast) var(--heo-ease),
            visibility var(--heo-dur-fast) var(--heo-ease);
            z-index: 30;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu.is-open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(0);
        }

        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu {
            background: rgba(15, 23, 42, 0.94) !important;
            border-color: rgba(71, 85, 105, 0.42) !important;
            box-shadow: 0 22px 44px rgba(0, 0, 0, 0.34) !important;
            -webkit-backdrop-filter: saturate(160%) blur(20px) !important;
            backdrop-filter: saturate(160%) blur(20px) !important;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__item + .heo-nav-submenu__item {
            margin-top: 0.14rem;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link {
            display: flex;
            align-items: center;
            gap: 0.56rem;
            width: 100%;
            min-height: 2.3rem;
            padding: 0 0.8rem;
            border-radius: 0.92rem;
            border: 1px solid transparent;
            color: #334155;
            font-size: 0.875rem;
            font-weight: 500;
            text-decoration: none !important;
            transition: background-color var(--heo-dur-fast) var(--heo-ease),
            border-color var(--heo-dur-fast) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease),
            transform var(--heo-dur) var(--heo-ease);
        }

        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link {
            color: #e2e8f0;
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__icon {
            width: 0.9rem;
            text-align: center;
            opacity: 0.72;
            flex-shrink: 0;
        }

        @media (hover: hover) {
            #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:hover {
                background: var(--heo-nav-focus-bg) !important;
                border-color: var(--heo-nav-focus-border) !important;
                box-shadow: var(--heo-nav-submenu-hover-shadow) !important;
                color: var(--heo-nav-focus-color) !important;
            }

            html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:hover {
                background: var(--heo-nav-focus-dark-bg) !important;
                border-color: var(--heo-nav-focus-dark-border) !important;
                box-shadow: var(--heo-nav-submenu-hover-dark-shadow) !important;
                color: var(--heo-nav-focus-dark-color) !important;
            }
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible {
            outline: none;
            border-color: var(--heo-nav-focus-border) !important;
            background: var(--heo-nav-focus-bg) !important;
            box-shadow: var(--heo-nav-focus-shadow) !important;
            color: var(--heo-nav-focus-color) !important;
            transform: translateY(-1px);
        }

        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible .heo-nav-menu__icon,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible .heo-nav-menu__chevron,
        #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible .heo-nav-submenu__icon {
            color: currentColor !important;
            opacity: 1;
        }

        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__link:focus-visible,
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-menu__trigger:focus-visible,
        html.dark #theme-heo #nav-bar-swipe nav#nav-mobile .heo-nav-submenu__link:focus-visible {
            border-color: var(--heo-nav-focus-dark-border) !important;
            background: var(--heo-nav-focus-dark-bg) !important;
            box-shadow: var(--heo-nav-focus-dark-shadow) !important;
            color: var(--heo-nav-focus-dark-color) !important;
            transform: translateY(-1px);
        }

        #theme-heo nav#nav a:focus-visible,
        #theme-heo nav#nav button:focus-visible,
        #theme-heo #nav-bar-swipe nav#nav-mobile a:focus-visible,
        #theme-heo #nav-bar-swipe nav#nav-mobile .cursor-pointer:focus-visible,
        #theme-heo nav#nav .flex-shrink-0 .cursor-pointer:focus-visible {
            outline: none;
            border-radius: var(--heo-nav-pill-radius);
            box-shadow: var(--heo-nav-outline-shadow);
        }

        #theme-heo nav#nav .heo-header-action-group {
            align-items: center;
            gap: 0.375rem;
            padding: 0.375rem;
            border-radius: 999px;
            border: 1px solid rgba(226, 232, 240, 0.88);
            background: rgba(255, 255, 255, 0.72);
            -webkit-backdrop-filter: saturate(210%) blur(20px);
            backdrop-filter: saturate(210%) blur(20px);
            box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
        }

        html.dark #theme-heo nav#nav .heo-header-action-group {
            border-color: rgba(71, 85, 105, 0.34);
            background: rgba(15, 23, 42, 0.68);
            -webkit-backdrop-filter: saturate(150%) blur(20px);
            backdrop-filter: saturate(150%) blur(20px);
            box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
        }

        #theme-heo nav#nav .heo-header-action-group--mobile {
            gap: 0.25rem;
            padding: 0.25rem 0.3rem 0.25rem 0.25rem;
            border-radius: 1.3rem;
        }

        #theme-heo nav#nav .heo-header-action-group--mobile .heo-header-action-btn--menu {
            margin-left: 0.1rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-header-action-group {
            align-items: center;
            gap: 0.18rem;
            padding: 0.22rem 0.26rem;
            min-height: 2.9rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-header-action-group--desktop {
            gap: 0.16rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-header-action-group--mobile {
            gap: 0.16rem;
            padding-right: 0.22rem;
        }

        #theme-heo nav#nav.heo-top-nav .heo-header-action-btn {
            width: 2.5rem;
            height: 2.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.95rem;
            border: 1px solid transparent;
            background: transparent;
            color: #0f172a;
            flex-shrink: 0;
            padding: 0;
            appearance: none;
            -webkit-appearance: none;
            transition: background-color var(--heo-dur-fast) var(--heo-ease),
            border-color var(--heo-dur-fast) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease),
            transform var(--heo-dur) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease);
        }


        html.dark #theme-heo nav#nav .heo-header-action-btn {
            color: #e2e8f0;
            background: rgba(255, 255, 255, 0.015);
        }

        #theme-heo nav#nav .heo-header-action-btn svg,
        #theme-heo nav#nav .heo-header-action-btn i {
            width: 1.05rem;
            height: 1.05rem;
            line-height: 1;
        }

        @media (hover: hover) {
            #theme-heo nav#nav .heo-header-action-btn:hover {
                background: rgba(248, 250, 252, 0.9) !important;
                border-color: rgba(191, 219, 254, 0.78) !important;
                box-shadow: 0 8px 18px rgba(59, 130, 246, 0.07) !important;
                color: #334155 !important;
                transform: translateY(-1px);
            }

            html.dark #theme-heo nav#nav .heo-header-action-btn:hover {
                background: rgba(154, 52, 18, 0.16) !important;
                border-color: rgba(245, 158, 11, 0.2) !important;
                box-shadow: 0 8px 18px rgba(120, 53, 15, 0.16) !important;
                color: #fde68a !important;
            }
        }

        #theme-heo nav#nav .heo-header-action-btn:focus-visible {
            outline: none;
            border-color: rgba(191, 219, 254, 0.88) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.24),
            0 8px 18px rgba(59, 130, 246, 0.07) !important;
        }

        html.dark #theme-heo nav#nav .heo-header-action-btn:focus-visible {
            border-color: rgba(245, 158, 11, 0.24) !important;
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2),
            0 8px 18px rgba(120, 53, 15, 0.16) !important;
        }

        #theme-heo nav#nav .heo-header-action-btn--menu {
            background: rgba(241, 245, 249, 0.58);
            border-color: rgba(226, 232, 240, 0.7);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.46), 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        html.dark #theme-heo nav#nav .heo-header-action-btn--menu {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        #theme-heo nav#nav .heo-reading-progress {
            position: relative;
            overflow: hidden;
            background: rgba(37, 99, 235, 0.08);
            border-color: rgba(191, 219, 254, 0.72);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62), 0 6px 16px rgba(37, 99, 235, 0.06);
            color: #2563eb;
        }

        html.dark #theme-heo nav#nav .heo-reading-progress {
            background: rgba(251, 146, 60, 0.14);
            border-color: rgba(251, 146, 60, 0.18);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
            color: #fdba74;
        }

        #theme-heo nav#nav .heo-reading-progress.is-visible {
            width: 2.5rem;
            opacity: 1;
        }

        #theme-heo nav#nav .heo-reading-progress__value,
        #theme-heo nav#nav .heo-reading-progress__icon {
            position: absolute;
            inset: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: opacity var(--heo-dur-fast) var(--heo-ease),
            transform var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo nav#nav .heo-reading-progress__value {
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1;
        }

        #theme-heo nav#nav .heo-reading-progress__arrow {
            width: 1rem;
            height: 1rem;
            display: block;
            margin: auto;
        }

        #theme-heo nav#nav .heo-reading-progress__icon {
            opacity: 0;
            transform: translateY(4px);
        }

        @media (hover: hover) {
            #theme-heo nav#nav .heo-reading-progress:hover,
            #theme-heo nav#nav .heo-reading-progress:focus-visible {
                background: rgba(248, 250, 252, 0.92) !important;
                border-color: rgba(191, 219, 254, 0.78) !important;
                box-shadow: 0 8px 18px rgba(59, 130, 246, 0.09) !important;
            }

            html.dark #theme-heo nav#nav .heo-reading-progress:hover,
            html.dark #theme-heo nav#nav .heo-reading-progress:focus-visible {
                background: rgba(251, 146, 60, 0.26) !important;
                border-color: rgba(251, 146, 60, 0.3) !important;
                box-shadow: 0 8px 18px rgba(194, 65, 12, 0.18) !important;
                color: #fed7aa !important;
            }

            #theme-heo nav#nav .heo-reading-progress:hover .heo-reading-progress__value {
                opacity: 0;
                transform: translateY(-4px);
            }

            #theme-heo nav#nav .heo-reading-progress:hover .heo-reading-progress__icon {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #theme-heo #wrapper-outer .article {
            background: var(--heo-surface) !important;
            border: 1px solid var(--heo-border-subtle) !important;
            border-radius: var(--heo-radius-lg) !important;
            box-shadow: var(--heo-shadow-sm);
            color: var(--heo-text);
        }

        #theme-heo #wrapper-outer .article.heo-post-shell {
            position: relative;
            overflow: visible;
            margin-top: clamp(-2.15rem, -3vw, -1rem);
            z-index: 12;
        }

        #theme-heo #wrapper-outer .article.heo-post-shell::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.035) 18%, rgba(255, 255, 255, 0) 100%);
            opacity: 0.9;
            pointer-events: none;
        }

        #theme-heo .heo-post-shell__inner {
            position: relative;
            z-index: 1;
        }

        @media (max-width: 1023px) {
            #theme-heo #wrapper-outer .article.heo-post-shell {
                margin-top: 0;
            }
        }

        @media (max-width: 767px) {
            #theme-heo #wrapper-outer .article.heo-post-shell {
                margin-top: 0;
                border-top-left-radius: 1.55rem !important;
                border-top-right-radius: 1.55rem !important;
            }
        }

        #theme-heo #article-wrapper,
        #theme-heo #article-wrapper #notion-article {
            font-size: var(--heo-article-font-size);
            line-height: var(--heo-article-line-height);
            color: var(--heo-text);
            letter-spacing: 0.01em;
        }

        #theme-heo #article-wrapper.heo-article-layout {
            position: relative;
        }

        #theme-heo #article-wrapper .heo-article-section {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: clamp(0.7rem, 1.8vw, 1.1rem);
            padding-inline: clamp(0.85rem, 2.4vw, 1.4rem);
        }

        @media (min-width: 768px) {
            #theme-heo #article-wrapper .heo-article-section {
                padding-inline: clamp(0.7rem, 1.8vw, 1.05rem);
            }
        }

        #theme-heo #article-wrapper .heo-article-reading-shell {
            padding-top: clamp(0.18rem, 1vw, 0.45rem);
        }

        #theme-heo #article-wrapper .heo-article-content-width .post-ai {
            margin-bottom: 0.36rem;
        }

        #theme-heo #article-wrapper .heo-article-end-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.78rem;
            margin: clamp(1.2rem, 2.8vw, 1.8rem) auto 0;
            width: min(100%, 22rem);
            color: var(--heo-text-tertiary);
            opacity: 0.88;
            letter-spacing: 0.08em;
        }

        #theme-heo #article-wrapper .heo-article-end-marker__line {
            flex: 1;
            height: 1px;
            border-radius: 999px;
            background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.32), transparent);
        }

        #theme-heo #article-wrapper .heo-article-end-marker__label {
            flex-shrink: 0;
            padding: 0;
            border: 0;
            background: transparent;
            box-shadow: none;
            color: var(--heo-text-tertiary);
            font-size: 0.76rem;
            font-weight: 500;
            letter-spacing: 0.14em;
        }

        html.dark #theme-heo #article-wrapper .heo-article-end-marker__line {
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.24), transparent);
        }

        html.dark #theme-heo #article-wrapper .heo-article-end-marker__label {
            color: rgba(255, 244, 214, 0.68);
        }

        #theme-heo #article-wrapper .heo-article-layout::before {
            content: '';
            position: absolute;
            top: -1.2rem;
            left: 50%;
            width: min(100% - 2rem, 18rem);
            height: 2.1rem;
            transform: translateX(-50%);
            border-radius: 999px;
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.18) 48%, rgba(255, 255, 255, 0) 78%);
            filter: blur(10px);
            opacity: 0.75;
            pointer-events: none;
            z-index: 0;
        }

        html.dark #theme-heo #article-wrapper .heo-article-layout::before {
            background: radial-gradient(circle at center, rgba(255, 244, 214, 0.2) 0%, rgba(255, 244, 214, 0.08) 42%, rgba(255, 244, 214, 0) 76%);
            opacity: 0.92;
        }

        #theme-heo #article-wrapper .heo-article-reading-shell::before {
            content: '';
            position: absolute;
            top: -0.28rem;
            left: 50%;
            width: min(100%, 13rem);
            height: 1px;
            transform: translateX(-50%);
            background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.36), transparent);
            pointer-events: none;
        }

        html.dark #theme-heo #article-wrapper .heo-article-reading-shell::before {
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.28), transparent);
        }

        #theme-heo #article-wrapper .heo-article-inline-ad {
            margin: 0.2rem 0;
        }

        #theme-heo #article-wrapper #notion-article.heo-article-body {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
            max-width: var(--heo-article-surface-max-width);
            margin: 0 auto;
        }

        #theme-heo #article-wrapper #notion-article[data-heo-reading-surface='true'],
        #theme-heo #article-wrapper #notion-article.heo-article-surface {
            position: relative;
        }

        #theme-heo #article-wrapper #notion-article > :first-child {
            margin-top: 0 !important;
        }

        #theme-heo #article-wrapper #notion-article > p:first-child,
        #theme-heo #article-wrapper #notion-article > .notion-text:first-child,
        #theme-heo #article-wrapper #notion-article > .notion-callout:first-child,
        #theme-heo #article-wrapper #notion-article > .notion-quote:first-child,
        #theme-heo #article-wrapper #notion-article > blockquote:first-child {
            position: relative;
            padding-top: clamp(0.15rem, 0.8vw, 0.3rem);
        }

        #theme-heo #article-wrapper #notion-article > p:first-child::before,
        #theme-heo #article-wrapper #notion-article > .notion-text:first-child::before,
        #theme-heo #article-wrapper #notion-article > .notion-callout:first-child::before,
        #theme-heo #article-wrapper #notion-article > .notion-quote:first-child::before,
        #theme-heo #article-wrapper #notion-article > blockquote:first-child::before {
            content: '';
            display: block;
            width: clamp(2.75rem, 8vw, 4.5rem);
            height: 0.28rem;
            margin-bottom: 1rem;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.55));
            box-shadow: 0 10px 22px rgba(59, 130, 246, 0.18);
        }

        html.dark #theme-heo #article-wrapper #notion-article > p:first-child::before,
        html.dark #theme-heo #article-wrapper #notion-article > .notion-text:first-child::before,
        html.dark #theme-heo #article-wrapper #notion-article > .notion-callout:first-child::before,
        html.dark #theme-heo #article-wrapper #notion-article > .notion-quote:first-child::before,
        html.dark #theme-heo #article-wrapper #notion-article > blockquote:first-child::before {
            background: linear-gradient(90deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.5));
            box-shadow: 0 10px 24px rgba(194, 65, 12, 0.22);
        }

        #theme-heo #article-wrapper #notion-article p {
            margin: 0 0 var(--heo-article-paragraph-gap);
        }

        #theme-heo #article-wrapper #notion-article > :last-child,
        #theme-heo #article-wrapper #notion-article p:last-child {
            margin-bottom: 0;
        }

        #theme-heo #article-wrapper #notion-article h2 {
            font-size: var(--heo-h2-size);
            line-height: 1.35;
            margin: 2.8rem 0 0.6rem !important;
            letter-spacing: -0.01em;
            font-weight: 600;
        }

        #theme-heo #article-wrapper #notion-article h3 {
            font-size: var(--heo-h3-size);
            line-height: 1.4;
            margin: 2rem 0 0.5rem !important;
            letter-spacing: -0.005em;
            font-weight: 600;
        }

        #theme-heo #article-wrapper #notion-article h4 {
            font-size: var(--heo-h4-size);
            line-height: 1.45;
            margin: 1.5rem 0 0.4rem !important;
        }


        #theme-heo #article-wrapper #notion-article .notion-list {
            margin-block-start: 0.2em !important;
            margin-block-end: 0.8rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-list-disc,
        #theme-heo #article-wrapper #notion-article .notion-list-numbered {
            padding-inline-start: 1.5rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-list li {
            margin-bottom: 0.25rem !important;
            padding: 1px 0 !important;
            line-height: var(--heo-article-line-height);
        }

        #theme-heo #article-wrapper #notion-article .notion-list li::marker {
            color: var(--heo-text-tertiary);
            font-size: 0.85em;
        }

        #theme-heo #article-wrapper #notion-article .notion-link,
        #theme-heo #article-wrapper #notion-article .notion-inline-underscore {
            text-decoration: none !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            transition: border-color var(--heo-dur-fast) var(--heo-ease);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-link,
        html.dark #theme-heo #article-wrapper #notion-article .notion-inline-underscore {
            border-bottom-color: rgba(255, 255, 255, 0.15);
        }

        #theme-heo #article-wrapper #notion-article .notion-link:hover {
            border-bottom-color: currentColor;
        }

        #theme-heo #article-wrapper #notion-article ul,
        #theme-heo #article-wrapper #notion-article ol {
            padding-left: 1.5rem;
            margin: 0.2rem 0 1rem;
            list-style-position: outside;
        }

        #theme-heo #article-wrapper #notion-article li {
            margin-bottom: 0.35rem;
        }

        #theme-heo #article-wrapper #notion-article li > ul,
        #theme-heo #article-wrapper #notion-article li > ol {
            margin: 0.35rem 0 0.5rem;
        }

        #theme-heo #article-wrapper #notion-article li > p {
            margin: 0 !important;
        }

        #theme-heo #article-wrapper #notion-article li::marker {
            color: var(--heo-text-tertiary);
            font-variant-numeric: tabular-nums;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block {
            margin: 0 0 var(--heo-article-block-gap);
            scroll-margin-top: 7rem;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block + .heo-article-block {
            margin-top: clamp(0.15rem, 0.6vw, 0.45rem);
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--image,
        #theme-heo #article-wrapper #notion-article .heo-article-block--audio,
        #theme-heo #article-wrapper #notion-article .heo-article-block--code,
        #theme-heo #article-wrapper #notion-article .heo-article-block--quote,
        #theme-heo #article-wrapper #notion-article .heo-article-block--embed,
        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark,
        #theme-heo #article-wrapper #notion-article .heo-article-block--pdf,
        #theme-heo #article-wrapper #notion-article .heo-article-block--callout {
            position: relative;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--audio,
        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark,
        #theme-heo #article-wrapper #notion-article .heo-article-block--pdf,
        #theme-heo #article-wrapper #notion-article .heo-article-block--callout,
        #theme-heo #article-wrapper #notion-article .heo-article-block--embed,
        #theme-heo #article-wrapper #notion-article .heo-article-block--code,
        #theme-heo #article-wrapper #notion-article .heo-article-block--quote {
            border: 1px solid var(--heo-article-media-border);
            border-radius: calc(var(--heo-article-media-radius) + 0.08rem);
            background: var(--heo-article-media-bg);
            box-shadow: var(--heo-article-media-shadow);
        }

        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--audio,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--pdf,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--callout,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--embed,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--code,
        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--quote {
            border-color: var(--heo-article-media-border-dark);
            background: var(--heo-article-media-bg-dark);
            box-shadow: var(--heo-article-media-shadow-dark);
        }

        #theme-heo #article-wrapper #notion-article blockquote,
        #theme-heo #article-wrapper #notion-article .notion-quote {
            margin: 0 0 var(--heo-article-block-gap);
            padding: 1.12rem 1.25rem 1.12rem 1.62rem;
            border-radius: 1.25rem;
            border: 1px solid rgba(99, 102, 241, 0.12);
            border-left: 3px solid rgba(79, 70, 229, 0.58);
            background: linear-gradient(145deg, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0.92) 52%, rgba(248, 250, 252, 0.88) 100%);
            color: var(--heo-text-secondary);
            position: relative;
            box-shadow: 0 18px 38px rgba(79, 70, 229, 0.08);
            transition: transform var(--heo-dur) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease), border-color var(--heo-dur) var(--heo-ease), background var(--heo-dur) var(--heo-ease);
        }

        #theme-heo #article-wrapper #notion-article blockquote::before,
        #theme-heo #article-wrapper #notion-article .notion-quote::before {
            content: '“';
            position: absolute;
            left: 0.74rem;
            top: 0.52rem;
            font-size: 2rem;
            line-height: 1;
            color: rgba(99, 102, 241, 0.14);
            font-family: Georgia, serif;
            font-weight: 700;
        }

        #theme-heo #article-wrapper #notion-article blockquote > :first-child,
        #theme-heo #article-wrapper #notion-article .notion-quote > :first-child {
            margin-top: 0;
        }

        #theme-heo #article-wrapper #notion-article blockquote > :last-child,
        #theme-heo #article-wrapper #notion-article .notion-quote > :last-child {
            margin-bottom: 0;
        }

        #theme-heo #article-wrapper #notion-article blockquote:hover,
        #theme-heo #article-wrapper #notion-article .notion-quote:hover {
            transform: translateX(2px);
            box-shadow: 0 22px 44px rgba(79, 70, 229, 0.1);
            border-color: rgba(99, 102, 241, 0.18);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote,
        html.dark #theme-heo #article-wrapper #notion-article .notion-quote {
            border-color: rgba(245, 158, 11, 0.14);
            border-left-color: rgba(245, 158, 11, 0.62);
            background: linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.84) 55%, rgba(15, 23, 42, 0.74) 100%);
            box-shadow: 0 22px 46px rgba(0, 0, 0, 0.22);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote::before,
        html.dark #theme-heo #article-wrapper #notion-article .notion-quote::before {
            color: rgba(245, 158, 11, 0.2);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote:hover,
        html.dark #theme-heo #article-wrapper #notion-article .notion-quote:hover {
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.3);
            border-color: rgba(245, 158, 11, 0.22);
        }

        #theme-heo #article-wrapper #notion-article code {
            font-family: var(--heo-font-mono);
            font-size: 0.92em;
        }

        #theme-heo #article-wrapper #notion-article .notion-code {
            margin: 0 0 calc(var(--heo-article-block-gap) + 0.05rem);
            padding: 1rem 1.05rem;
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: calc(var(--heo-article-media-radius) + 0.12rem);
            background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92));
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
            overflow: hidden;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-code {
            border-color: rgba(255, 255, 255, 0.1);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.88));
            box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
        }

        #theme-heo #article-wrapper #notion-article .notion-code pre,
        #theme-heo #article-wrapper #notion-article .notion-code code {
            background: transparent !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-audio,
        #theme-heo #article-wrapper #notion-article .notion-audio.heo-article-block,
        #theme-heo #article-wrapper #notion-article .notion-audio.island-converted,
        #theme-heo #article-wrapper #notion-article .notion-audio.heo-article-block--audio,
        #theme-heo #article-wrapper #notion-article .notion-audio.island-converted.heo-article-block--audio {
            margin: 0 0 calc(var(--heo-article-block-gap) + 0.15rem);
            padding: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-audio,
        html.dark #theme-heo #article-wrapper #notion-article .notion-audio.heo-article-block,
        html.dark #theme-heo #article-wrapper #notion-article .notion-audio.island-converted,
        html.dark #theme-heo #article-wrapper #notion-article .notion-audio.heo-article-block--audio,
        html.dark #theme-heo #article-wrapper #notion-article .notion-audio.island-converted.heo-article-block--audio {
            background: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
        }

        #theme-heo #article-wrapper #notion-article .heo-inline-audio-mount {
            width: 100%;
        }

        #theme-heo #article-wrapper #notion-article .notion-row {
            gap: 0.75rem;
        }

        #theme-heo #article-wrapper #notion-article .notion-row.heo-image-gallery-row {
            margin: 0.1rem 0 calc(var(--heo-article-block-gap) + 0.15rem);
            padding: 0.55rem;
            border-radius: 1.45rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.86));
            border: 1px solid rgba(203, 213, 225, 0.8);
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-row.heo-image-gallery-row {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(17, 24, 39, 0.76));
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
        }

        /* Article Images */
        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image {
            margin: 1rem auto calc(var(--heo-article-block-gap) + 0.1rem) !important;
            border-radius: 1.2rem;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.03);
            transition: transform var(--heo-dur) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease),
            border-color var(--heo-dur) var(--heo-ease);
            max-width: 100% !important;
            min-width: 0 !important;
            width: auto !important;
            display: block;
            background: rgba(255, 255, 255, 0.7);
        }

        @media (min-width: 768px) {
            #theme-heo #article-wrapper #notion-article .notion-row.heo-image-gallery-row {
                flex-wrap: wrap;
                gap: var(--heo-gallery-gap, 0.75rem);
            }

            #theme-heo #article-wrapper #notion-article .notion-row.heo-image-gallery-row > .notion-column {
                flex: 0 0 calc((100% - (var(--heo-gallery-cols, 3) - 1) * var(--heo-gallery-gap, 0.75rem)) / var(--heo-gallery-cols, 3)) !important;
                width: calc((100% - (var(--heo-gallery-cols, 3) - 1) * var(--heo-gallery-gap, 0.75rem)) / var(--heo-gallery-cols, 3)) !important;
                min-width: 0;
            }

            #theme-heo #article-wrapper #notion-article .notion-row.heo-image-gallery-row > .notion-spacer {
                display: none;
            }
        }

        #theme-heo #article-wrapper #notion-article .notion-column {
            padding-top: 6px;
            padding-bottom: 6px;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image {
            margin: 0.55rem auto !important;
            border-radius: 1rem;
            aspect-ratio: 4 / 5;
            width: 100% !important;
            overflow: hidden;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image > div {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image img {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            object-fit: cover;
            object-position: center;
            border-radius: 1rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image + .notion-asset-wrapper-image {
            margin-top: 0.15rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image:hover {
            transform: none;
        }

        #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-caption {
            margin-top: 0.35rem !important;
            padding: 0 0.35rem;
            font-size: 0.8rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image > div {
            width: auto !important;
            max-width: 100% !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image img {
            width: auto !important;
            max-width: 100% !important;
            height: auto !important;
            border-radius: 1.2rem !important;
            display: block;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image {
            border-color: rgba(255, 255, 255, 0.08);
            background: rgba(15, 23, 42, 0.7);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.12);
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-caption,
        #theme-heo #article-wrapper #notion-article .heo-article-caption {
            margin-top: 0.75rem !important;
            padding: 0 1rem;
            font-size: 0.85rem !important;
            line-height: 1.6;
            color: var(--heo-text-tertiary) !important;
            text-align: center !important;
            font-style: normal !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image:hover {
            transform: translateY(-3px);
            box-shadow: 0 22px 44px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.05);
            border-color: rgba(148, 163, 184, 0.32);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image:hover {
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.35), 0 4px 10px rgba(0, 0, 0, 0.18);
            border-color: rgba(245, 158, 11, 0.2);
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--callout {
            padding: 1.02rem 1.08rem;
            background: linear-gradient(160deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.92));
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--callout .notion-callout-text {
            min-width: 0;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--callout .notion-page-icon {
            margin-inline-end: 0.75rem;
            font-size: 1.05rem;
            opacity: 0.88;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark {
            overflow: hidden;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94));
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark > div:first-child {
            padding: 1rem 1.08rem !important;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark .notion-bookmark-title {
            font-size: 0.98rem !important;
            font-weight: 700 !important;
            line-height: 1.45 !important;
            color: var(--heo-text) !important;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark .notion-bookmark-description {
            margin-top: 0.38rem !important;
            font-size: 0.87rem !important;
            line-height: 1.62 !important;
            color: var(--heo-text-secondary) !important;
            max-height: calc(1.62em * 2) !important;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--bookmark .notion-bookmark-link {
            margin-top: 0.72rem !important;
            font-size: 0.8rem !important;
            letter-spacing: 0.01em;
            color: var(--heo-text-tertiary) !important;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--embed,
        #theme-heo #article-wrapper #notion-article .heo-article-block--pdf {
            padding: 0.55rem;
            overflow: hidden;
        }

        #theme-heo #article-wrapper #notion-article .heo-article-block--embed iframe,
        #theme-heo #article-wrapper #notion-article .notion-pdf {
            display: block;
            width: 100%;
            min-height: clamp(18rem, 42vw, 28rem);
            border: 0;
            border-radius: calc(var(--heo-article-media-radius) - 0.05rem);
            overflow: hidden;
            box-shadow: none;
            background: rgba(255, 255, 255, 0.82);
        }

        #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video,
        #theme-heo #article-wrapper #notion-article .notion-video {
            margin: 0 0 calc(var(--heo-article-block-gap) + 0.1rem);
            padding: 0.55rem;
            border-radius: calc(var(--heo-article-media-radius) + 0.08rem);
            border: 1px solid var(--heo-article-media-border);
            background: var(--heo-article-media-bg);
            box-shadow: var(--heo-article-media-shadow);
            overflow: hidden;
        }

        #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video > div,
        #theme-heo #article-wrapper #notion-article .notion-video > div,
        #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video video,
        #theme-heo #article-wrapper #notion-article .notion-video video {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: calc(var(--heo-article-media-radius) - 0.05rem);
            overflow: hidden;
            display: block;
            background: rgba(15, 23, 42, 0.04);
        }

        #theme-heo #article-wrapper #notion-article .notion-collection {
            margin: 1.15rem 0 calc(var(--heo-article-block-gap) + 0.08rem);
            width: 100%;
            min-width: 100%;
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.8rem;
            min-height: 3.2rem;
            height: auto;
            padding: 0.2rem 0 0.85rem;
            margin-bottom: 0.75rem;
            border-bottom: 1px solid rgba(203, 213, 225, 0.72);
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-header-title {
            font-size: clamp(1.02rem, 1.2vw, 1.15rem);
            font-weight: 700;
            color: var(--heo-text);
            margin-right: 0;
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-view-dropdown {
            padding: 0.42rem 0.72rem;
            border-radius: 999px;
            border: 1px solid rgba(203, 213, 225, 0.78);
            background: rgba(255, 255, 255, 0.82);
            font-size: 0.8rem;
            color: var(--heo-text-secondary);
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-view-dropdown:hover {
            background: rgba(239, 246, 255, 0.88);
            border-color: rgba(96, 165, 250, 0.34);
            color: #2563eb;
        }

        #theme-heo #article-wrapper #notion-article .notion-list-view,
        #theme-heo #article-wrapper #notion-article .notion-board-view,
        #theme-heo #article-wrapper #notion-article .notion-gallery,
        #theme-heo #article-wrapper #notion-article .notion-table,
        #theme-heo #article-wrapper #notion-article .notion-table-view {
            border: 1px solid rgba(203, 213, 225, 0.76) !important;
            border-radius: 1.2rem !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)) !important;
            box-shadow: 0 16px 38px rgba(15, 23, 42, 0.05) !important;
            overflow: hidden !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-gallery {
            padding: 0.9rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-card {
            border-radius: 1rem !important;
            border: 1px solid rgba(226, 232, 240, 0.96) !important;
            background: rgba(255, 255, 255, 0.92) !important;
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05) !important;
            overflow: hidden !important;
            transition: transform 0.24s var(--heo-ease), box-shadow 0.24s var(--heo-ease), border-color 0.24s var(--heo-ease) !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-card:hover {
            transform: translateY(-2px);
            border-color: rgba(96, 165, 250, 0.3) !important;
            box-shadow: 0 18px 34px rgba(59, 130, 246, 0.08) !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-card-cover {
            overflow: hidden;
            border-bottom: 1px solid rgba(226, 232, 240, 0.86);
        }

        #theme-heo #article-wrapper #notion-article .notion-collection-card-body {
            padding: 0.95rem 1rem 1rem !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-table-header-inner,
        #theme-heo #article-wrapper #notion-article .notion-board-header-inner {
            border-top: 0 !important;
            border-bottom: 1px solid rgba(226, 232, 240, 0.9) !important;
            background: rgba(248, 250, 252, 0.92) !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-table-row,
        #theme-heo #article-wrapper #notion-article .notion-board-group {
            border-bottom-color: rgba(226, 232, 240, 0.78) !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-table-row:hover,
        #theme-heo #article-wrapper #notion-article .notion-board-group:hover,
        #theme-heo #article-wrapper #notion-article .notion-list-item:hover {
            background: rgba(59, 130, 246, 0.04) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--embed iframe,
        html.dark #theme-heo #article-wrapper #notion-article .notion-pdf {
            box-shadow: none;
            background: rgba(15, 23, 42, 0.72);
        }

        html.dark #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video,
        html.dark #theme-heo #article-wrapper #notion-article .notion-video {
            border-color: var(--heo-article-media-border-dark);
            background: var(--heo-article-media-bg-dark);
            box-shadow: var(--heo-article-media-shadow-dark);
        }

        html.dark #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video > div,
        html.dark #theme-heo #article-wrapper #notion-article .notion-video > div,
        html.dark #theme-heo #article-wrapper #notion-article figure.notion-asset-wrapper-video video,
        html.dark #theme-heo #article-wrapper #notion-article .notion-video video {
            background: rgba(15, 23, 42, 0.58);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-header {
            border-bottom-color: rgba(255, 255, 255, 0.08);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-view-dropdown {
            border-color: rgba(255, 255, 255, 0.1);
            background: rgba(30, 41, 59, 0.78);
            color: rgba(226, 232, 240, 0.88);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-view-dropdown:hover {
            border-color: rgba(245, 158, 11, 0.22);
            background: rgba(71, 85, 105, 0.82);
            color: rgba(255, 244, 214, 0.92);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-list-view,
        html.dark #theme-heo #article-wrapper #notion-article .notion-board-view,
        html.dark #theme-heo #article-wrapper #notion-article .notion-gallery,
        html.dark #theme-heo #article-wrapper #notion-article .notion-table,
        html.dark #theme-heo #article-wrapper #notion-article .notion-table-view {
            border-color: rgba(255, 255, 255, 0.08) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(17, 24, 39, 0.78)) !important;
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-card {
            border-color: rgba(255, 255, 255, 0.06) !important;
            background: rgba(15, 23, 42, 0.7) !important;
            box-shadow: 0 18px 38px rgba(0, 0, 0, 0.24) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-card:hover {
            border-color: rgba(245, 158, 11, 0.2) !important;
            box-shadow: 0 22px 42px rgba(0, 0, 0, 0.3) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-collection-card-cover {
            border-bottom-color: rgba(255, 255, 255, 0.08);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-table-header-inner,
        html.dark #theme-heo #article-wrapper #notion-article .notion-board-header-inner {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
            background: rgba(30, 41, 59, 0.82) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-table-row,
        html.dark #theme-heo #article-wrapper #notion-article .notion-board-group {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-table-row:hover,
        html.dark #theme-heo #article-wrapper #notion-article .notion-board-group:hover,
        html.dark #theme-heo #article-wrapper #notion-article .notion-list-item:hover {
            background: rgba(245, 158, 11, 0.06) !important;
        }

        html.dark #theme-heo #article-wrapper #notion-article .heo-article-block--callout {
            background: linear-gradient(160deg, rgba(30, 41, 59, 0.72), rgba(15, 23, 42, 0.9));
        }

        html.dark #theme-heo #wrapper-outer .article {
            background: var(--heo-surface-dark) !important;
            border-color: var(--heo-border-subtle-dark) !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.45);
        }

        @media (hover: hover) {
            #theme-heo #wrapper-outer .article:hover {
                box-shadow: var(--heo-shadow-lg);
                transform: translateY(var(--heo-card-hover-translate));
            }

            html.dark #theme-heo #wrapper-outer .article:hover {
                box-shadow: var(--heo-shadow-lg-dark);
            }
        }

        #more {
            white-space: nowrap;
        }

        .today-card-cover {
            -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
            mask-image: linear-gradient(to top, transparent 5%, black 70%);
        }

        .recent-top-post-group::-webkit-scrollbar {
            display: none;
        }

        .scroll-hidden::-webkit-scrollbar {
            display: none;
        }

        #theme-heo #category-bar {
            position: relative;
            z-index: 1;
            overflow: visible;
            padding: 0.6rem 0.75rem !important;
            border-color: rgba(226, 232, 240, 0.92) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.9)) !important;
            box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.82);
        }

        #theme-heo #category-bar-items {
            gap: 0.55rem;
            padding-right: 0.45rem;
        }

        #theme-heo #category-bar-next {
            padding-left: 0.35rem;
            border-left: 1px solid rgba(226, 232, 240, 0.88);
        }

        #theme-heo #category-bar .category-bar-item {
            display: inline-flex;
            align-items: center;
            min-height: 2.45rem;
            border: 1px solid rgba(226, 232, 240, 0.92) !important;
            background: rgba(255, 255, 255, 0.72) !important;
            color: #475569 !important;
            font-weight: 600;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
            padding: 0.48rem 0.95rem !important;
            margin: 0 !important;
        }

        #theme-heo #category-bar .category-bar-item.selected {
            border-color: rgba(59, 130, 246, 0.72) !important;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.96), rgba(99, 102, 241, 0.9)) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 28px rgba(59, 130, 246, 0.22), 0 0 0 1px rgba(59, 130, 246, 0.08) !important;
        }

        #theme-heo #category-bar .category-bar-item:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.68) !important;
            background: rgba(239, 246, 255, 0.96) !important;
            color: #1d4ed8 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14), 0 12px 24px rgba(59, 130, 246, 0.08) !important;
        }

        #theme-heo #category-bar .category-bar-item.selected:focus-visible {
            color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(191, 219, 254, 0.3), 0 16px 30px rgba(59, 130, 246, 0.24) !important;
        }

        html.dark #theme-heo #category-bar {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.84)) !important;
            border-color: rgba(71, 85, 105, 0.42) !important;
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        html.dark #theme-heo #category-bar-next {
            border-left-color: rgba(71, 85, 105, 0.4);
        }

        html.dark #theme-heo #category-bar .category-bar-item.selected {
            border-color: rgba(245, 158, 11, 0.52) !important;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.88)) !important;
            color: #fff7ed !important;
            box-shadow: 0 14px 30px rgba(120, 53, 15, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.12) !important;
        }

        html.dark #theme-heo #category-bar .category-bar-item.selected:focus-visible {
            color: #fff7ed !important;
            box-shadow: 0 0 0 3px rgba(253, 230, 138, 0.2), 0 16px 34px rgba(120, 53, 15, 0.34) !important;
        }


        #theme-heo .heo-category-index {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
        }

        #theme-heo .heo-category-index__header {
            padding: 0 0.25rem;
        }

        #theme-heo .heo-category-index__eyebrow {
            color: #94a3b8;
        }

        #theme-heo .heo-category-index__title {
            color: var(--heo-card-title);
            letter-spacing: -0.03em;
        }

        #theme-heo .heo-category-index__subtitle {
            color: var(--heo-card-muted);
            max-width: 34rem;
        }

        #theme-heo .heo-category-index__grid {
            margin: 0;
        }

        #theme-heo .heo-category-index__item {
            display: flex;
            align-items: center;
            gap: 0.95rem;
            min-height: 5.35rem;
            padding: 1rem 1.1rem;
            border: 1px solid var(--heo-card-border);
            border-radius: 1.45rem;
            background: var(--heo-card-bg);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
            text-decoration: none !important;
        }

        #theme-heo .heo-category-index__item-icon {
            width: 2.6rem;
            height: 2.6rem;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: rgba(59, 130, 246, 0.1);
            color: #2563eb;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        #theme-heo .heo-category-index__item-main {
            display: flex;
            min-width: 0;
            flex: 1;
            flex-direction: column;
            gap: 0.16rem;
        }

        #theme-heo .heo-category-index__item-name {
            color: var(--heo-card-title);
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.35;
            word-break: break-word;
        }

        #theme-heo .heo-category-index__item-desc {
            color: var(--heo-card-muted);
            font-size: 0.84rem;
            line-height: 1.55;
        }

        #theme-heo .heo-category-index__item-count {
            min-width: 2.2rem;
            padding: 0.32rem 0.62rem;
            border-radius: 999px;
            background: rgba(59, 130, 246, 0.08);
            color: #2563eb;
            font-size: 0.82rem;
            font-weight: 700;
            line-height: 1;
            text-align: center;
        }

        @media (hover: hover) {
            #theme-heo .heo-category-index__item:hover {
                transform: translateY(-2px);
                border-color: rgba(191, 219, 254, 0.92);
                box-shadow: 0 20px 42px rgba(59, 130, 246, 0.1);
            }

            #theme-heo .heo-category-index__item:hover .heo-category-index__item-icon {
                background: rgba(37, 99, 235, 0.14);
            }
        }

        #theme-heo .heo-category-index__item:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.76);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14), 0 18px 36px rgba(59, 130, 246, 0.12);
            transform: translateY(-2px);
        }

        html.dark #theme-heo .heo-category-index__eyebrow {
            color: #64748b;
        }

        html.dark #theme-heo .heo-category-index__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-category-index__subtitle {
            color: var(--heo-card-muted-dark);
        }

        html.dark #theme-heo .heo-category-index__item {
            border-color: var(--heo-card-dark-border);
            background: var(--heo-card-dark-bg);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
        }

        html.dark #theme-heo .heo-category-index__item-icon {
            background: rgba(245, 158, 11, 0.12);
            color: #fbbf24;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-category-index__item-name {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-category-index__item-desc {
            color: var(--heo-card-muted-dark);
        }

        html.dark #theme-heo .heo-category-index__item-count {
            background: rgba(245, 158, 11, 0.12);
            color: #facc15;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-category-index__item:hover {
                border-color: rgba(245, 158, 11, 0.26);
                box-shadow: 0 22px 46px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.08);
            }
        }

        html.dark #theme-heo .heo-category-index__item:focus-visible {
            border-color: rgba(245, 158, 11, 0.32);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16), 0 20px 42px rgba(0, 0, 0, 0.28);
        }

        #theme-heo .heo-post-card-shell {
            position: relative;
        }

        #theme-heo .heo-post-card {
            min-height: 0;
            height: auto !important;
        }

        #theme-heo .heo-post-card__content {
            gap: 0.58rem;
            height: auto !important;
            container-type: inline-size;
        }

        #theme-heo .heo-post-card__header {
            display: flex;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            justify-content: flex-start;
            gap: 0.38rem;
        }

        #theme-heo .heo-post-card__category {
            display: inline-flex;
            align-items: center;
            min-height: 1.85rem;
            width: fit-content;
            padding: 0.28rem 0.7rem;
            border: 1px solid rgba(191, 219, 254, 0.82);
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.88);
            color: #2563eb !important;
            font-weight: 600;
            letter-spacing: 0.01em;
        }

        #theme-heo .heo-post-card__title {
            display: block;
            color: var(--heo-card-title);
            letter-spacing: -0.025em;
            line-height: 1.28;
            text-wrap: pretty;
        }

        #theme-heo .heo-post-card__title .menu-link {
            color: inherit;
        }

        #theme-heo .heo-post-card:hover .heo-post-card__title,
        #theme-heo .heo-post-card:focus-within .heo-post-card__title {
            color: #4338ca;
        }

        #theme-heo .heo-post-card__summary {
            color: var(--heo-card-text);
            min-height: 0;
            margin-bottom: 0;
            line-height: 1.46;
        }

        #theme-heo .heo-post-card__tags {
            margin-top: 0;
            min-height: 1.6rem;
        }

        #theme-heo .heo-post-card__tags-inner {
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: 0.3rem;
            max-height: calc(1.6rem * 2 + 0.3rem);
            overflow: hidden;
        }

        html.dark #theme-heo .heo-post-card__category {
            border-color: rgba(245, 158, 11, 0.22);
            background: rgba(154, 52, 18, 0.18);
            color: #facc15 !important;
        }

        html.dark #theme-heo .heo-post-card:hover .heo-post-card__title,
        html.dark #theme-heo .heo-post-card:focus-within .heo-post-card__title {
            color: #fde68a;
        }

        #theme-heo .heo-archive-shell {
            border-color: rgba(191, 219, 254, 0.82) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.92)) !important;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.82);
            -webkit-backdrop-filter: saturate(180%) blur(18px);
            backdrop-filter: saturate(180%) blur(18px);
        }

        #theme-heo .heo-archive-list {
            display: flex;
            flex-direction: column;
            gap: 1.6rem;
            margin-top: 1.25rem;
        }

        #theme-heo .heo-archive-group {
            display: flex;
            flex-direction: column;
            gap: 0.95rem;
        }

        #theme-heo .heo-archive-group__header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1rem;
            padding: 0 0.35rem;
        }

        #theme-heo .heo-archive-group__eyebrow {
            color: #94a3b8;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
        }

        #theme-heo .heo-archive-group__title {
            color: var(--heo-card-title);
            font-size: clamp(1.4rem, 1.15rem + 0.7vw, 1.9rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            line-height: 1.05;
        }

        #theme-heo .heo-archive-group__list {
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 1rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        #theme-heo .heo-archive-item {
            min-width: 0;
        }

        #theme-heo .heo-archive-card {
            display: flex;
            min-height: 12.75rem;
            border: 1px solid rgba(203, 213, 225, 0.96);
            border-radius: 1.55rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.94));
            box-shadow: 0 16px 38px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.82);
            overflow: hidden;
            transition: transform var(--heo-dur) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-archive-card__cover-wrap {
            position: relative;
            flex: 0 0 clamp(12rem, 23vw, 16rem);
            overflow: hidden;
            background: linear-gradient(180deg, rgba(241, 245, 249, 0.9), rgba(226, 232, 240, 0.8));
            border-right: 1px solid rgba(203, 213, 225, 0.88);
        }

        #theme-heo .heo-archive-card__cover-wrap::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.12));
        }

        #theme-heo .heo-archive-card__cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.65s var(--heo-ease), filter var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-archive-card__content {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            gap: 0.9rem;
            min-width: 0;
            padding: 1.2rem 1.25rem 1.15rem;
        }

        #theme-heo .heo-archive-card__main {
            display: flex;
            min-width: 0;
            flex-direction: column;
            gap: 0.68rem;
        }

        #theme-heo .heo-archive-card__meta {
            margin-bottom: 0;
        }

        #theme-heo .heo-archive-card__category {
            display: inline-flex;
            align-items: center;
            min-height: 1.8rem;
            width: fit-content;
            padding: 0.26rem 0.7rem;
            border: 1px solid rgba(191, 219, 254, 0.82);
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.9);
            color: #2563eb !important;
            font-weight: 600;
            letter-spacing: 0.01em;
        }

        #theme-heo .heo-archive-card__title {
            display: block;
            min-height: calc(1.28em * 2);
            color: var(--heo-card-title);
            letter-spacing: -0.025em;
            line-height: 1.28;
            text-wrap: pretty;
        }

        #theme-heo .heo-archive-card__title .menu-link {
            color: inherit;
        }

        #theme-heo .heo-archive-card__tags {
            margin-top: auto;
            min-height: calc(2rem * 2 + 0.45rem);
        }

        #theme-heo .heo-archive-card__tags-inner {
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: 0.45rem;
            max-height: calc(2rem * 2 + 0.45rem);
            overflow: hidden;
        }

        @media (hover: hover) {
            #theme-heo .heo-archive-card:hover {
                transform: translateY(-2px);
                border-color: rgba(148, 163, 184, 0.96);
                box-shadow: 0 22px 48px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.86);
            }

            #theme-heo .heo-archive-card:hover .heo-archive-card__cover {
                transform: scale(1.04);
                filter: saturate(108%);
            }

            #theme-heo .heo-archive-card:hover .heo-archive-card__title {
                color: #4338ca;
            }
        }

        #theme-heo .heo-archive-card:focus-within {
            transform: translateY(-2px);
            border-color: rgba(59, 130, 246, 0.34);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12), 0 22px 48px rgba(15, 23, 42, 0.09);
        }

        html.dark #theme-heo .heo-archive-shell {
            border-color: rgba(71, 85, 105, 0.5) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.82)) !important;
            box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-archive-group__eyebrow {
            color: #64748b;
        }

        html.dark #theme-heo .heo-archive-group__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-archive-card {
            border-color: rgba(71, 85, 105, 0.46);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.84), rgba(15, 23, 42, 0.76));
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-archive-card__cover-wrap {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.88), rgba(15, 23, 42, 0.72));
            border-right-color: rgba(71, 85, 105, 0.68);
        }

        html.dark #theme-heo .heo-archive-card__cover-wrap::after {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.28));
        }

        html.dark #theme-heo .heo-archive-card__category {
            border-color: rgba(245, 158, 11, 0.22);
            background: rgba(154, 52, 18, 0.18);
            color: #facc15 !important;
        }

        html.dark #theme-heo .heo-archive-card__title {
            color: var(--heo-card-title-dark);
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-archive-card:hover {
                border-color: rgba(245, 158, 11, 0.28);
                box-shadow: 0 24px 54px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }

            html.dark #theme-heo .heo-archive-card:hover .heo-archive-card__title {
                color: #fde68a;
            }
        }

        html.dark #theme-heo .heo-archive-card:focus-within {
            border-color: rgba(245, 158, 11, 0.3);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16), 0 24px 54px rgba(0, 0, 0, 0.32);
        }

        @media (max-width: 767px) {
            #theme-heo .heo-archive-shell {
                padding: 1rem !important;
                border-radius: 1.45rem !important;
            }

            #theme-heo .heo-archive-list {
                gap: 1.2rem;
                margin-top: 1rem;
            }

            #theme-heo .heo-archive-group__header {
                padding: 0 0.1rem;
                gap: 0.75rem;
            }

            #theme-heo .heo-archive-card {
                min-height: 0;
                flex-direction: column;
            }

            #theme-heo .heo-archive-card__cover-wrap {
                flex-basis: auto;
                width: 100%;
                aspect-ratio: 16 / 9;
                border-right: none;
                border-bottom: 1px solid rgba(203, 213, 225, 0.88);
            }

            #theme-heo .heo-archive-card__content {
                padding: 1rem;
            }

            html.dark #theme-heo .heo-archive-card__cover-wrap {
                border-bottom-color: rgba(71, 85, 105, 0.68);
            }
        }

        #theme-heo .heo-tag-mini {
            position: relative;
            border: 1px solid rgba(226, 232, 240, 0.92);
            background: rgba(255, 255, 255, 0.78);
            color: #475569;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
            text-decoration: none !important;
        }

        #theme-heo .heo-tag-mini__content {
            gap: 0.18rem;
        }

        #theme-heo .heo-tag-mini__label,
        #theme-heo .heo-tag-mini__icon {
            color: inherit;
        }

        @media (hover: hover) {
            #theme-heo .heo-tag-mini:hover {
                transform: translateY(-1px);
                border-color: rgba(191, 219, 254, 0.86);
                background: rgba(239, 246, 255, 0.94);
                color: #2563eb;
                box-shadow: 0 12px 22px rgba(59, 130, 246, 0.08);
            }
        }

        #theme-heo .heo-tag-mini:focus-visible,
        #theme-heo .heo-tag-mini.is-active {
            outline: none;
            border-color: rgba(59, 130, 246, 0.72);
            background: rgba(239, 246, 255, 0.96);
            color: #1d4ed8;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12), 0 12px 24px rgba(59, 130, 246, 0.08);
            transform: translateY(-1px);
        }

        html.dark #theme-heo .heo-tag-mini {
            border-color: rgba(71, 85, 105, 0.38);
            background: rgba(30, 41, 59, 0.78);
            color: #cbd5e1;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-tag-mini:hover {
                border-color: rgba(245, 158, 11, 0.26);
                background: rgba(154, 52, 18, 0.18);
                color: #fde68a;
                box-shadow: 0 14px 28px rgba(120, 53, 15, 0.18);
            }
        }

        html.dark #theme-heo .heo-tag-mini:focus-visible,
        html.dark #theme-heo .heo-tag-mini.is-active {
            border-color: rgba(245, 158, 11, 0.32);
            background: rgba(154, 52, 18, 0.24);
            color: #fde68a;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16), 0 14px 30px rgba(120, 53, 15, 0.2);
        }

        .heo-search-modal__panel {
            border-color: rgba(226, 232, 240, 0.92) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(248, 250, 252, 0.95)) !important;
            box-shadow: 0 28px 80px rgba(15, 23, 42, 0.18) !important;
        }

        .heo-search-modal__title {
            letter-spacing: -0.02em;
        }

        .heo-search-modal__input {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
        }

        .heo-search-modal__input:focus {
            border-color: rgba(59, 130, 246, 0.62) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }

        .heo-search-modal__close:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14);
        }

        .heo-search-modal__result-item {
            border: 1px solid transparent;
            background: rgba(248, 250, 252, 0.72);
        }

        .heo-search-modal__result-item:hover {
            border-color: rgba(191, 219, 254, 0.82);
            background: rgba(239, 246, 255, 0.92);
        }

        .heo-search-modal__result-link {
            display: block;
            color: #0f172a;
            font-weight: 600;
            line-height: 1.55;
        }

        .heo-search-modal__shortcut {
            background: rgba(255, 255, 255, 0.78);
            border-color: rgba(203, 213, 225, 0.92) !important;
            box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
        }

        .heo-search-modal__brand {
            color: #64748b;
        }

        html.dark .heo-search-modal__panel {
            border-color: rgba(71, 85, 105, 0.42) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.92)) !important;
            box-shadow: 0 30px 84px rgba(0, 0, 0, 0.42) !important;
        }

        html.dark .heo-search-modal__input:focus {
            border-color: rgba(245, 158, 11, 0.32) !important;
            background: rgba(30, 41, 59, 0.92) !important;
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
        }

        html.dark .heo-search-modal__close:focus-visible {
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.14);
        }

        html.dark .heo-search-modal__result-item {
            background: rgba(15, 23, 42, 0.56);
        }

        html.dark .heo-search-modal__result-item:hover {
            border-color: rgba(245, 158, 11, 0.24);
            background: rgba(154, 52, 18, 0.18);
        }

        html.dark .heo-search-modal__result-link {
            color: #e2e8f0;
        }

        html.dark .heo-search-modal__shortcut {
            background: rgba(30, 41, 59, 0.72);
            border-color: rgba(71, 85, 105, 0.42) !important;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
        }

        html.dark .heo-search-modal__brand {
            color: #94a3b8;
        }

        @media (max-width: 767px) {
            #theme-heo .heo-post-card {
                min-height: 17.8rem;
            }

            #theme-heo .heo-post-card__content {
                padding: 0.88rem !important;
                gap: 0.52rem;
            }

            #theme-heo .heo-post-card__header {
                min-height: 0;
                gap: 0.34rem;
            }

            #theme-heo .heo-post-card__summary {
                min-height: 0;
                line-height: 1.46;
            }

            #theme-heo .heo-post-card__tags {
                min-height: 1.72rem;
            }

            #theme-heo .heo-category-index__item {
                min-height: 4.85rem;
                padding: 0.95rem 1rem;
            }
        }

        #theme-heo #sideRight .heo-mini-post-card {
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 0;
            padding: 0.55rem 0.6rem !important;
            margin: 0 !important;
            border: 1px solid transparent !important;
            border-radius: 1rem !important;
            background: transparent !important;
            text-decoration: none !important;
            box-shadow: none !important;
            transition: transform var(--heo-dur-fast) var(--heo-ease),
            background var(--heo-dur-fast) var(--heo-ease),
            border-color var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur-fast) var(--heo-ease) !important;
        }

        #theme-heo #sideRight .heo-mini-post-card__title {
            color: var(--heo-card-title);
            transition: color var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo #sideRight .heo-mini-post-card__date {
            color: var(--heo-card-muted);
            transition: color var(--heo-dur-fast) var(--heo-ease);
        }

        @media (hover: hover) {
            #theme-heo #sideRight .heo-mini-post-card:hover {
                transform: translateY(-1px);
                border-color: rgba(191, 219, 254, 0.86) !important;
                background: rgba(239, 246, 255, 0.92) !important;
                box-shadow: 0 10px 24px rgba(59, 130, 246, 0.08) !important;
            }

            #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__title {
                color: #1d4ed8;
            }

            #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__date {
                color: #3b82f6;
            }
        }

        #theme-heo #sideRight .heo-mini-post-card:focus-visible,
        #theme-heo #sideRight .heo-mini-post-card.is-active {
            outline: none;
            transform: translateY(-1px);
            border-color: rgba(59, 130, 246, 0.72) !important;
            background: rgba(239, 246, 255, 0.96) !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14), 0 12px 28px rgba(59, 130, 246, 0.12) !important;
        }

        #theme-heo #sideRight .heo-mini-post-card:focus-visible .heo-mini-post-card__title,
        #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__title {
            color: #1d4ed8;
        }

        #theme-heo #sideRight .heo-mini-post-card:focus-visible .heo-mini-post-card__date,
        #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__date {
            color: #2563eb;
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card__date {
            color: var(--heo-card-muted-dark);
        }

        @media (hover: hover) {
            html.dark #theme-heo #sideRight .heo-mini-post-card:hover {
                border-color: rgba(245, 158, 11, 0.24) !important;
                background: rgba(154, 52, 18, 0.18) !important;
                box-shadow: 0 12px 28px rgba(120, 53, 15, 0.18) !important;
            }

            html.dark #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__title {
                color: #fde68a;
            }

            html.dark #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__date {
                color: #fbbf24;
            }
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card:focus-visible,
        html.dark #theme-heo #sideRight .heo-mini-post-card.is-active {
            border-color: rgba(245, 158, 11, 0.32) !important;
            background: rgba(154, 52, 18, 0.24) !important;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16), 0 14px 30px rgba(120, 53, 15, 0.2) !important;
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card:focus-visible .heo-mini-post-card__title,
        html.dark #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__title {
            color: #fde68a;
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card:focus-visible .heo-mini-post-card__date,
        html.dark #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__date {
            color: #fbbf24;
        }

        #theme-heo #sideRight .heo-side-right-sticky {
            top: 5.5rem;
        }

        #theme-heo #sideRight .heo-toc-card {
            position: relative;
            overflow: hidden;
            border-color: rgba(191, 219, 254, 0.42) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.82)) !important;
            box-shadow: 0 20px 50px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04) !important;
        }

        #theme-heo #sideRight .heo-toc-card::before {
            content: '';
            position: absolute;
            inset: 0 0 auto;
            height: 4.5rem;
            background: linear-gradient(180deg, rgba(59, 130, 246, 0.12), rgba(255, 255, 255, 0));
            pointer-events: none;
        }

        #theme-heo #sideRight .heo-toc-card__header {
            position: relative;
            padding-bottom: 0.85rem;
            margin-bottom: 0.9rem;
        }

        #theme-heo #sideRight .heo-toc-card__header::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(148, 163, 184, 0.12), transparent);
        }

        #theme-heo #sideRight .heo-toc-card__eyebrow {
            letter-spacing: 0.22em;
        }

        #theme-heo #sideRight .heo-toc-card__title {
            letter-spacing: -0.015em;
        }

        html.dark #theme-heo #sideRight .heo-side-right-sticky {
            top: 5.5rem;
        }

        html.dark #theme-heo #sideRight .heo-toc-card {
            border-color: rgba(245, 158, 11, 0.18) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(17, 24, 39, 0.82)) !important;
            box-shadow: 0 24px 56px rgba(0, 0, 0, 0.28), 0 2px 10px rgba(0, 0, 0, 0.16) !important;
        }

        html.dark #theme-heo #sideRight .heo-toc-card::before {
            background: linear-gradient(180deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0));
        }

        html.dark #theme-heo #sideRight .heo-toc-card__header::after {
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.24), rgba(71, 85, 105, 0.22), transparent);
        }

        #theme-heo .heo-catalog {
            position: relative;
        }

        #theme-heo .heo-catalog--drawer {
            border-radius: 1.1rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94));
        }

        #theme-heo .heo-catalog__scroll--drawer {
            border-radius: 0.95rem;
            background: rgba(255, 255, 255, 0.92);
            padding: 0.15rem 0.45rem 0.2rem 0.12rem;
            overflow-x: visible;
        }

        html.dark #theme-heo .heo-catalog--drawer {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.82));
        }

        html.dark #theme-heo .heo-catalog__scroll--drawer {
            background: rgba(15, 23, 42, 0.76);
        }

        #theme-heo .heo-catalog nav {
            display: flex;
            flex-direction: column;
            gap: 0.18rem;
            padding-right: 0.4rem;
        }

        #theme-heo .notion-table-of-contents-item.catalog-item {
            border-radius: 0.95rem !important;
            margin: 0 !important;
            padding: 0.65rem 0.85rem !important;
            transition: background var(--heo-dur-fast) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            box-shadow var(--heo-dur-fast) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease) !important;
            width: calc(100% - 0.3rem) !important;
            opacity: 0.72 !important;
        }

        #theme-heo .notion-table-of-contents-item.catalog-item:hover,
        #theme-heo .notion-table-of-contents-item.catalog-item:has(span.font-bold.text-indigo-600) {
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.96), rgba(99, 102, 241, 0.9)) !important;
            box-shadow: 0 12px 24px rgba(59, 130, 246, 0.22) !important;
            opacity: 1 !important;
        }

        #theme-heo .notion-table-of-contents-item.catalog-item:hover span,
        #theme-heo .notion-table-of-contents-item.catalog-item span.font-bold.text-indigo-600 {
            color: #ffffff !important;
            font-weight: 600 !important;
        }

        html.dark #theme-heo .notion-table-of-contents-item.catalog-item {
            opacity: 0.78 !important;
        }

        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:hover,
        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:has(span.font-bold.text-indigo-600) {
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.98), rgba(251, 191, 36, 0.92)) !important;
            box-shadow: 0 12px 26px rgba(245, 158, 11, 0.24) !important;
            transform: translateX(4px);
            opacity: 1 !important;
        }

        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:hover span,
        html.dark #theme-heo .notion-table-of-contents-item.catalog-item span.font-bold.text-indigo-600 {
            color: #111827 !important;
            font-weight: 600 !important;
        }

        #theme-heo #toc-wrapper .toc-item:hover a,
        #theme-heo #toc-wrapper .toc-item.active a {
            color: #ffffff !important;
        }

        /* 暗色模式：当前章节高亮与 Hover */
        html.dark #theme-heo #toc-wrapper .toc-item:hover,
        html.dark #theme-heo #toc-wrapper .toc-item.active {
            background: rgba(234, 179, 8, 0.95) !important;
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);
            color: #000000 !important;
            transform: translateX(4px);
        }

        html.dark #theme-heo #toc-wrapper .toc-item:hover a,
        html.dark #theme-heo #toc-wrapper .toc-item.active a {
            color: #000000 !important;
        }

        /* TOC 容器本身同步侧边栏玻璃质感 */
        #theme-heo #sideRight .toc-card {
            background: rgba(255, 255, 255, 0.72) !important;
            backdrop-filter: blur(16px) saturate(180%) !important;
            border-radius: 24px !important;
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
        }

        html.dark #theme-heo #sideRight .toc-card {
            background: rgba(27, 28, 32, 0.75) !important;
            backdrop-filter: blur(18px) saturate(140%) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
        }

        @media (hover: hover) {
            #theme-heo #category-bar:hover {
                border-color: rgba(37, 99, 235, 0.3) !important;
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08), 0 12px 30px rgba(0, 0, 0, 0.08);
            }
            html.dark #theme-heo #category-bar:hover {
                border-color: rgba(234, 179, 8, 0.3) !important;
                box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.08), 0 20px 48px rgba(0, 0, 0, 0.4);
            }
        }

        /* Hero section styles */
        #theme-heo #hero .recent-post-top {
            background: transparent !important;
            border: 1px solid var(--heo-border-subtle) !important;
            box-shadow: none !important;
            transition: all var(--heo-dur) var(--heo-ease);
        }

        html.dark #theme-heo #hero .recent-post-top {
            border-color: var(--heo-border-subtle-dark) !important;
        }

        #theme-heo #hero #banners,
        #theme-heo #hero-right-wrapper #top-group > a > div {
            background: var(--heo-surface) !important;
            border: 1px solid var(--heo-border-subtle) !important;
            box-shadow: var(--heo-shadow-sm);
            transition: all var(--heo-dur) var(--heo-ease);
        }

        #theme-heo #hero-right-wrapper #today-card #card-body {
            border: 1px solid var(--heo-border-subtle) !important;
            box-shadow: var(--heo-shadow-sm);
            transition: all var(--heo-dur) var(--heo-ease);
        }

        html.dark #theme-heo #hero #banners,
        html.dark #theme-heo #hero-right-wrapper #top-group > a > div {
            background: var(--heo-surface-dark) !important;
            border-color: var(--heo-border-subtle-dark) !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.45);
        }

        html.dark #theme-heo #hero-right-wrapper #today-card #card-body {
            border-color: var(--heo-border-subtle-dark) !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.45);
        }

        @media (hover: hover) {
            #theme-heo #hero #banners:hover,
            #theme-heo #hero-right-wrapper #top-group > a > div:hover,
            #theme-heo #hero-right-wrapper #today-card #card-body:hover {
                box-shadow: var(--heo-shadow-lg);
                transform: translateY(var(--heo-card-hover-translate));
            }
            html.dark #theme-heo #hero #banners:hover,
            html.dark #theme-heo #hero-right-wrapper #top-group > a > div:hover,
            html.dark #theme-heo #hero-right-wrapper #today-card #card-body:hover {
                box-shadow: var(--heo-shadow-lg-dark);
            }
        }

        /* InfoCard v2 三段式结构优化 */
        #theme-heo #sideRight .heo-infocard-v2 {
            background: linear-gradient(165deg,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 14%, white 72%) 0%,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 10%, #eff6ff 82%) 52%,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 8%, #dbeafe 66%) 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.68) !important;
            box-shadow: 0 18px 44px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
            color: #1e3a8a !important;
            padding: 1.5rem !important;
            min-height: 20rem !important;
            height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            position: relative !important;
            transition: min-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease !important;
            overflow: hidden !important;
        }

        #theme-heo #sideRight .heo-infocard-v2 .heo-info-greetings-pill {
            background: rgba(255, 255, 255, 0.52) !important;
            border: 1px solid rgba(191, 219, 254, 0.72);
            color: #2563eb !important;
        }

        #theme-heo #sideRight .heo-infocard-v2 .author-info__name {
            color: #334155;
        }

        #theme-heo #sideRight .heo-infocard-v2 .author-info__desc,
        #theme-heo #sideRight .heo-infocard-v2 .heo-info-announcement-wrap,
        #theme-heo #sideRight .heo-infocard-v2 #announcement-content,
        #theme-heo #sideRight .heo-infocard-v2 #announcement-content * {
            color: rgba(51, 65, 85, 0.92) !important;
        }

        #theme-heo #sideRight .heo-infocard-v2 .heo-info-social-btn,
        #theme-heo #sideRight .heo-infocard-v2 .heo-info-more-btn {
            background: rgba(255, 255, 255, 0.42) !important;
            border-color: rgba(191, 219, 254, 0.64) !important;
            color: #2563eb !important;
        }

        #theme-heo #sideRight .heo-infocard-v2 .heo-info-social-btn:hover,
        #theme-heo #sideRight .heo-infocard-v2 .heo-info-more-btn:hover {
            background: rgba(37, 99, 235, 0.92) !important;
            color: #ffffff !important;
            box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 {
            background: linear-gradient(165deg,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 26%, #020617 74%) 0%,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 18%, #0f172a 82%) 52%,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 24%, #020617 76%) 100%) !important;
            border: 1px solid rgba(245, 158, 11, 0.18) !important;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
            color: #f8fafc !important;
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-greetings-pill {
            background: rgba(255, 255, 255, 0.12) !important;
            border: 1px solid rgba(255, 255, 255, 0.18);
            color: #93c5fd !important;
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 .author-info__name {
            color: #f8fafc;
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 .author-info__desc,
        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-announcement-wrap,
        html.dark #theme-heo #sideRight .heo-infocard-v2 #announcement-content,
        html.dark #theme-heo #sideRight .heo-infocard-v2 #announcement-content * {
            color: rgba(226, 232, 240, 0.92) !important;
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-social-btn,
        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-more-btn {
            background: rgba(255, 255, 255, 0.12) !important;
            border-color: rgba(255, 255, 255, 0.16) !important;
            color: #93c5fd !important;
        }

        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-social-btn:hover,
        html.dark #theme-heo #sideRight .heo-infocard-v2 .heo-info-more-btn:hover {
            background: rgba(255, 255, 255, 0.94) !important;
            color: #1d4ed8 !important;
            box-shadow: 0 12px 26px rgba(15, 23, 42, 0.3);
        }

        /* 1. Header 样式 */
        .heo-info-header {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            z-index: 10;
        }

        .heo-info-greetings-pill {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white !important;
            border-radius: 999px !important;
            padding: 4px 16px !important;
            white-space: nowrap !important;
            font-size: 0.875rem;
            width: auto !important;
            height: auto !important;
            transition: all 0.3s var(--heo-ease);
        }

        /* 2. Body 样式 */
        .heo-info-body {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 160px;
        }

        .heo-info-avatar-wrap {
            opacity: 1;
            transform: scale(1);
            transition: all 0.4s var(--heo-ease);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .heo-info-avatar-wrap .rounded-full {
            width: 120px !important;
            height: 120px !important;
            border: 4px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
            background: white;
        }

        /* 状态图标定位 (仿参考样式) */
        .author-status {
            position: absolute;
            right: 5px;
            bottom: 5px;
            width: 36px;
            height: 36px;
            background: white;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: transform 0.3s var(--heo-ease);
        }

        .author-status .g-status {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .heo-info-body:hover .author-status,
        .heo-info-body:focus-within .author-status {
            transform: scale(1.1) rotate(5deg);
        }

        /* 状态图标定位 */
        .author-status {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: transform 0.3s var(--heo-ease);
        }

        .heo-info-body:hover .author-status,
        .heo-info-body:focus-within .author-status {
            transform: scale(1.1) rotate(5deg);
        }

        .heo-info-announcement-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: all 0.4s var(--heo-ease);
            display: flex;
            flex-direction: column;
        }

        .heo-info-body:hover .heo-info-avatar-wrap,
        .heo-info-body:focus-within .heo-info-avatar-wrap {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
            position: absolute;
        }

        .heo-info-body:hover .heo-info-announcement-wrap,
        .heo-info-body:focus-within .heo-info-announcement-wrap {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            position: relative;
        }

        .heo-info-welcome-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .heo-info-emoji {
            animation: wave 2.5s infinite;
            transform-origin: 70% 70%;
            display: inline-block;
        }

        /* 3. Footer 样式 - 对齐参考图 */
        .heo-info-footer {
            width: 100%;
            margin-top: 1.5rem;
            padding-top: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .heo-info-footer-text {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .author-info__name {
            line-height: 1.2;
        }

        .author-info__desc {
            opacity: 0.8;
        }

        .heo-info-social-btn, .heo-info-more-btn {
            background: rgba(255, 255, 255, 0.16) !important;
            border: 1px solid rgba(255, 255, 255, 0.14) !important;
            backdrop-filter: blur(10px) !important;
            width: 42px !important;
            height: 42px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            transition: all 0.3s var(--heo-ease) !important;
            cursor: pointer;
            color: white !important;
        }

        .heo-info-social-btn:hover, .heo-info-more-btn:hover {
            background: rgba(255, 255, 255, 0.94) !important;
            color: #2563eb !important;
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 10px 24px rgba(255, 255, 255, 0.18);
        }

        #theme-heo #sideRight .heo-touch-card {
            background: linear-gradient(135deg, rgba(79, 101, 240, 0.22), rgba(99, 102, 241, 0.14)) !important;
            border-color: rgba(165, 180, 252, 0.42) !important;
            color: var(--heo-card-title) !important;
            box-shadow: 0 16px 38px rgba(79, 101, 240, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.42) !important;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__face {
            position: relative;
            z-index: 1;
            display: flex;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            color: inherit;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__eyebrow {
            width: fit-content;
            margin-bottom: 0.55rem;
            padding: 0.24rem 0.62rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
            color: #4f46e5;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__title {
            color: var(--heo-card-title);
            line-height: 1;
            letter-spacing: -0.04em;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__desc {
            color: var(--heo-card-text);
            font-size: 0.92rem;
            line-height: 1.45;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__pattern {
            opacity: 0.12 !important;
            mix-blend-mode: multiply;
            pointer-events: none;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__cta {
            color: var(--heo-card-title);
            line-height: 1.1;
            letter-spacing: -0.03em;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.1);
            color: #4f46e5;
            font-size: 1.1rem;
            font-weight: 700;
        }

        html.dark #theme-heo #sideRight .heo-touch-card {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(120, 53, 15, 0.12)) !important;
            border-color: rgba(245, 158, 11, 0.2) !important;
            color: var(--heo-card-title-dark) !important;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        html.dark #theme-heo #sideRight .heo-touch-card .heo-touch-card__eyebrow {
            background: rgba(245, 158, 11, 0.12);
            color: #fbbf24;
        }

        html.dark #theme-heo #sideRight .heo-touch-card .heo-touch-card__title,
        html.dark #theme-heo #sideRight .heo-touch-card .heo-touch-card__cta {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo #sideRight .heo-touch-card .heo-touch-card__desc {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo #sideRight .heo-touch-card .heo-touch-card__pattern {
            opacity: 0.1 !important;
            mix-blend-mode: screen;
        }

        #theme-heo .heo-tag-index {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
        }

        #theme-heo .heo-tag-index__header {
            padding: 0 0.25rem;
        }

        #theme-heo .heo-tag-index__eyebrow {
            color: #94a3b8;
        }

        #theme-heo .heo-tag-index__title {
            color: var(--heo-card-title);
            letter-spacing: -0.03em;
        }

        #theme-heo .heo-tag-index__subtitle {
            color: var(--heo-card-muted);
            max-width: 34rem;
        }

        #theme-heo .heo-tag-index__grid {
            margin: 0;
        }

        #theme-heo .heo-tag-index__item {
            display: flex;
            align-items: center;
            gap: 0.95rem;
            min-height: 5.35rem;
            padding: 1rem 1.1rem;
            border: 1px solid var(--heo-card-border);
            border-radius: 1.45rem;
            background: var(--heo-card-bg);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
            text-decoration: none !important;
        }

        #theme-heo .heo-tag-index__item-icon {
            width: 2.6rem;
            height: 2.6rem;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: rgba(59, 130, 246, 0.1);
            color: #2563eb;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        #theme-heo .heo-tag-index__item-main {
            display: flex;
            min-width: 0;
            flex: 1;
            flex-direction: column;
            gap: 0.16rem;
        }

        #theme-heo .heo-tag-index__item-name {
            color: var(--heo-card-title);
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.35;
            word-break: break-word;
        }

        #theme-heo .heo-tag-index__item-desc {
            color: var(--heo-card-muted);
            font-size: 0.84rem;
            line-height: 1.55;
        }

        #theme-heo .heo-tag-index__item-count {
            min-width: 2.2rem;
            padding: 0.32rem 0.62rem;
            border-radius: 999px;
            background: rgba(59, 130, 246, 0.08);
            color: #2563eb;
            font-size: 0.82rem;
            font-weight: 700;
            line-height: 1;
            text-align: center;
        }

        @media (hover: hover) {
            #theme-heo .heo-tag-index__item:hover {
                transform: translateY(-2px);
                border-color: rgba(191, 219, 254, 0.92);
                box-shadow: 0 20px 42px rgba(59, 130, 246, 0.1);
            }

            #theme-heo .heo-tag-index__item:hover .heo-tag-index__item-icon {
                background: rgba(37, 99, 235, 0.14);
            }
        }

        #theme-heo .heo-tag-index__item:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.76);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14), 0 18px 36px rgba(59, 130, 246, 0.12);
            transform: translateY(-2px);
        }

        html.dark #theme-heo .heo-tag-index__eyebrow {
            color: #64748b;
        }

        html.dark #theme-heo .heo-tag-index__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-tag-index__subtitle {
            color: var(--heo-card-muted-dark);
        }

        html.dark #theme-heo .heo-tag-index__item {
            border-color: var(--heo-card-dark-border);
            background: var(--heo-card-dark-bg);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
        }

        html.dark #theme-heo .heo-tag-index__item-icon {
            background: rgba(245, 158, 11, 0.12);
            color: #fbbf24;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        html.dark #theme-heo .heo-tag-index__item-name {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-tag-index__item-desc {
            color: var(--heo-card-muted-dark);
        }

        html.dark #theme-heo .heo-tag-index__item-count {
            background: rgba(245, 158, 11, 0.12);
            color: #facc15;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-tag-index__item:hover {
                border-color: rgba(245, 158, 11, 0.26);
                box-shadow: 0 22px 46px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.08);
            }
        }

        html.dark #theme-heo .heo-tag-index__item:focus-visible {
            border-color: rgba(245, 158, 11, 0.32);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16), 0 20px 42px rgba(0, 0, 0, 0.28);
        }

        .heo-search-modal__results {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .heo-search-modal__empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 8rem;
            padding: 0.75rem;
            border: 1px dashed rgba(203, 213, 225, 0.92);
            border-radius: 1.15rem;
            background: rgba(248, 250, 252, 0.72);
        }

        .heo-search-modal__empty-text {
            color: #64748b;
            line-height: 1.7;
        }

        .heo-search-modal__result-item {
            overflow: hidden;
        }

        .heo-search-modal__result-head {
            align-items: flex-start;
        }

        .heo-search-modal__result-summary {
            line-height: 1.6;
        }

        .heo-search-modal__result-meta {
            min-width: 7rem;
        }

        .heo-search-modal__result-category {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 1.75rem;
            padding: 0.24rem 0.58rem;
            border: 1px solid rgba(191, 219, 254, 0.78);
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.9);
            color: #2563eb;
            font-size: 0.72rem;
            font-weight: 700;
            line-height: 1;
        }

        .heo-search-modal__result-tags {
            color: #94a3b8;
            font-size: 0.72rem;
            line-height: 1.35;
            text-align: right;
        }

        .heo-search-modal__result-item.is-active {
            border-color: transparent !important;
            box-shadow: 0 18px 34px rgba(59, 130, 246, 0.2);
        }

        .heo-search-modal__result-item.is-active .heo-search-modal__result-category {
            border-color: rgba(255, 255, 255, 0.22);
            background: rgba(255, 255, 255, 0.16);
            color: #ffffff;
        }

        html.dark .heo-search-modal__empty {
            border-color: rgba(71, 85, 105, 0.42);
            background: rgba(15, 23, 42, 0.42);
        }

        html.dark .heo-search-modal__empty-text {
            color: #94a3b8;
        }

        html.dark .heo-search-modal__result-category {
            border-color: rgba(245, 158, 11, 0.22);
            background: rgba(154, 52, 18, 0.16);
            color: #facc15;
        }

        html.dark .heo-search-modal__result-tags {
            color: #94a3b8;
        }

        html.dark .heo-search-modal__result-item.is-active {
            box-shadow: 0 18px 34px rgba(120, 53, 15, 0.2);
        }

        html.dark .heo-search-modal__result-item.is-active .heo-search-modal__result-category {
            border-color: rgba(0, 0, 0, 0.08);
            background: rgba(17, 24, 39, 0.12);
            color: #111827;
        }

        #theme-heo .heo-home-nav-entry {
            min-height: 3.5rem;
            border: 1px solid rgba(203, 213, 225, 0.92);
            border-radius: 1.2rem;
            background: rgba(255, 255, 255, 0.72);
            color: var(--heo-card-title);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.72);
            -webkit-backdrop-filter: saturate(180%) blur(18px);
            backdrop-filter: saturate(180%) blur(18px);
            font-weight: 700;
            transition: transform var(--heo-dur) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease), background var(--heo-dur-fast) var(--heo-ease), color var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur) var(--heo-ease);
        }

        #theme-heo .heo-home-nav-entry__label {
            display: inline-block;
            line-height: 1.2;
            letter-spacing: -0.01em;
        }

        @media (hover: hover) {
            #theme-heo .heo-home-nav-entry:hover {
                transform: translateY(-2px) scale(1.01);
                border-color: rgba(191, 219, 254, 0.88);
                background: rgba(248, 250, 252, 0.94);
                color: #334155;
                box-shadow: 0 16px 30px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.82);
            }
        }

        #theme-heo .heo-home-nav-entry:focus-visible {
            outline: none;
            transform: translateY(-2px);
            border-color: rgba(59, 130, 246, 0.72);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16), 0 16px 30px rgba(15, 23, 42, 0.1);
        }

        html.dark #theme-heo .heo-home-nav-entry {
            border-color: rgba(100, 116, 139, 0.42);
            background: rgba(15, 23, 42, 0.72);
            color: var(--heo-card-title-dark);
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-home-nav-entry:hover {
                border-color: rgba(245, 158, 11, 0.24);
                background: rgba(15, 23, 42, 0.88);
                color: #fde68a;
                box-shadow: 0 18px 34px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }
        }

        html.dark #theme-heo .heo-home-nav-entry:focus-visible {
            border-color: rgba(245, 158, 11, 0.28);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 18px 34px rgba(0, 0, 0, 0.24);
        }

        #theme-heo #sideRight .heo-card {
            border-radius: var(--heo-card-radius-lg) !important;
            border-color: rgba(191, 219, 254, 0.82) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.9)) !important;
            box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75) !important;
        }

        #theme-heo #sideRight .heo-card--interactive:hover,
        #theme-heo #sideRight .heo-card--interactive:focus-within {
            border-color: rgba(148, 163, 184, 0.96) !important;
            box-shadow: 0 22px 46px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.88) !important;
        }

        html.dark #theme-heo #sideRight .heo-card {
            border-color: rgba(100, 116, 139, 0.56) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.8)) !important;
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        html.dark #theme-heo #sideRight .heo-card--interactive:hover,
        html.dark #theme-heo #sideRight .heo-card--interactive:focus-within {
            border-color: rgba(245, 158, 11, 0.28) !important;
            box-shadow: 0 24px 52px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        }

        #theme-heo #sideRight .heo-card.heo-infocard-v2 {
            background: linear-gradient(165deg,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 14%, white 72%) 0%,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 10%, #eff6ff 82%) 52%,
                    color-mix(in srgb, var(--heo-infocard-bg, #4f65f0) 8%, #dbeafe 66%) 100%) !important;
            border-color: rgba(255, 255, 255, 0.68) !important;
            box-shadow: 0 18px 44px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
        }

        #theme-heo #sideRight .heo-card.heo-infocard-v2:hover,
        #theme-heo #sideRight .heo-card.heo-infocard-v2:focus-within {
            border-color: rgba(191, 219, 254, 0.96) !important;
            box-shadow: 0 22px 48px rgba(59, 130, 246, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.82) !important;
        }

        html.dark #theme-heo #sideRight .heo-card.heo-infocard-v2 {
            background: linear-gradient(165deg,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 26%, #020617 74%) 0%,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 18%, #0f172a 82%) 52%,
                    color-mix(in srgb, var(--heo-infocard-bg, #f59e0b) 24%, #020617 76%) 100%) !important;
            border-color: rgba(245, 158, 11, 0.18) !important;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
        }

        html.dark #theme-heo #sideRight .heo-card.heo-infocard-v2:hover,
        html.dark #theme-heo #sideRight .heo-card.heo-infocard-v2:focus-within {
            border-color: rgba(245, 158, 11, 0.34) !important;
            box-shadow: 0 24px 54px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
        }

        @media (hover: hover) {
            #theme-heo .heo-post-adjacent-card:hover {
                transform: translateY(-1px);
                border-color: rgba(148, 163, 184, 0.82) !important;
                background: rgba(248, 250, 252, 0.9) !important;
                box-shadow: 0 10px 22px rgba(15, 23, 42, 0.065) !important;
            }

            #theme-heo .heo-post-adjacent-card:hover .heo-post-adjacent-card__title {
                color: #475569 !important;
            }
        }

        #theme-heo .heo-post-adjacent-card:focus-visible {
            outline: none;
            transform: translateY(-1px);
            border-color: rgba(191, 219, 254, 0.8) !important;
            background: rgba(248, 250, 252, 0.94) !important;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.16), 0 10px 22px rgba(15, 23, 42, 0.065) !important;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-post-adjacent-card:hover {
                transform: translateY(-1px);
                border-color: rgba(245, 158, 11, 0.16) !important;
                background: rgba(154, 52, 18, 0.1) !important;
                box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12) !important;
            }

            html.dark #theme-heo .heo-post-adjacent-card:hover .heo-post-adjacent-card__eyebrow {
                color: #fcd34d !important;
            }

            html.dark #theme-heo .heo-post-adjacent-card:hover .heo-post-adjacent-card__title {
                color: #fef3c7 !important;
            }

            html.dark #theme-heo .heo-post-adjacent-card:hover .heo-post-adjacent-card__cta {
                color: #fdba74 !important;
            }
        }

        html.dark #theme-heo .heo-post-adjacent-card:focus-visible {
            border-color: rgba(245, 158, 11, 0.22) !important;
            background: rgba(154, 52, 18, 0.12) !important;
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15), 0 10px 22px rgba(0, 0, 0, 0.12) !important;
        }

        /* Search page (Apple-style) */
        #theme-heo .heo-search {
            max-width: 56rem;
            margin-left: auto;
            margin-right: auto;
        }

        #theme-heo .heo-search-input input {
            height: 44px;
            line-height: 44px;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.62);
            -webkit-backdrop-filter: saturate(210%) blur(24px);
            backdrop-filter: saturate(210%) blur(24px);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 18px 44px rgba(0, 0, 0, 0.08);
            font-size: 15px;
            color: var(--heo-text);
        }

        #theme-heo .heo-search-input input:focus {
            border-color: rgba(0, 122, 255, 0.55);
            box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.18),
            0 12px 30px rgba(0, 0, 0, 0.08);
        }

        html.dark #theme-heo .heo-search-input input {
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(27, 28, 32, 0.56);
            -webkit-backdrop-filter: saturate(170%) blur(26px);
            backdrop-filter: saturate(170%) blur(26px);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 22px 56px rgba(0, 0, 0, 0.35);
            color: var(--heo-text);
        }

        #theme-heo .heo-search-card {
            border-radius: var(--heo-radius-lg);
            border: 1px solid var(--heo-border) !important;
            background: rgba(255, 255, 255, 0.75) !important;
            -webkit-backdrop-filter: saturate(180%) blur(14px);
            backdrop-filter: saturate(180%) blur(14px);
            box-shadow: var(--heo-shadow-sm);
        }

        html.dark #theme-heo .heo-search-card {
            border-color: rgba(255, 255, 255, 0.12) !important;
            background: rgba(27, 28, 32, 0.68) !important;
        }

        #theme-heo .heo-search-title {
            font-size: 1.25rem !important;
            line-height: 1.4;
            font-weight: 600;
            letter-spacing: -0.01em;
            margin-bottom: 1rem !important;
            color: var(--heo-text);
        }

        #theme-heo .heo-search-category-list,
        #theme-heo .heo-search-tags-list {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        #theme-heo .heo-search-category-item {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 6px 14px;
            margin: 6px 8px 0 0;
            border-radius: 999px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(8px);
            color: var(--heo-text-secondary);
            transition: all 0.25s var(--heo-ease);
        }

        #theme-heo .heo-search-category-item:hover,
        #theme-heo .heo-search-category-item.active {
            background: rgba(37, 99, 235, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35), 0 0 0 1px rgba(37, 99, 235, 0.1);
            color: #ffffff !important;
            transform: translateY(-2px);
        }

        html.dark #theme-heo .heo-search-category-item {
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(255, 255, 255, 0.05);
            color: var(--heo-text-secondary);
        }

        html.dark #theme-heo .heo-search-category-item:hover,
        html.dark #theme-heo .heo-search-category-item.active {
            background: rgba(234, 179, 8, 0.85) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 8px 20px rgba(234, 179, 8, 0.45), 0 0 0 1px rgba(234, 179, 8, 0.2);
            color: #000000 !important;
            transform: translateY(-2px);
        }

        /* Tags mini pills */
        #theme-heo #tags-list a,
        #theme-heo #tags-list .tag-mini,
        #theme-heo .heo-search-tags-list a {
            border-radius: 999px;
            padding: 4px 12px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(8px);
            color: var(--heo-text-secondary);
            transition: all 0.25s var(--heo-ease);
        }

        html.dark #theme-heo #tags-list a,
        html.dark #theme-heo #tags-list .tag-mini,
        html.dark #theme-heo .heo-search-tags-list a {
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(255, 255, 255, 0.05);
            color: var(--heo-text-secondary);
        }

        #theme-heo #tags-list a:hover,
        #theme-heo .heo-search-tags-list a:hover {
            background: rgba(37, 99, 235, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
            color: #ffffff !important;
            transform: translateY(-2px);
        }

        html.dark #theme-heo #tags-list a:hover,
        html.dark #theme-heo .heo-search-tags-list a:hover {
            background: rgba(234, 179, 8, 0.85) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 8px 20px rgba(234, 179, 8, 0.45);
            color: #000000 !important;
            transform: translateY(-2px);
        }

        /* Footer (Apple-style minimal) */
        #theme-heo footer {
            background: transparent !important;
        }

        #theme-heo footer #color-transition {
            height: 48px;
            background: linear-gradient(to bottom, transparent, #f9fafc) !important;
        }

        html.dark #theme-heo footer #color-transition {
            background: linear-gradient(to bottom, #0f1115, #18171d) !important;
        }

        #theme-heo footer #footer-bottom {
            height: auto !important;
            padding-top: 1.125rem !important;
            padding-bottom: 1.25rem !important;
            background: rgba(249, 250, 252, 0.8) !important;
            -webkit-backdrop-filter: saturate(190%) blur(20px);
            backdrop-filter: saturate(190%) blur(20px);
            border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
            color: var(--heo-text-tertiary);
            display: flex;
            flex-direction: column;
            gap: 0.625rem;
        }

        @media (min-width: 1024px) {
            #theme-heo footer #footer-bottom {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
        }

        #theme-heo footer #footer-bottom-center {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        @media (min-width: 1024px) {
            #theme-heo footer #footer-bottom-center {
                width: auto;
            }
        }

        #theme-heo footer #footer-bottom-center > div {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        #theme-heo footer #footer-bottom-center > div > div {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 18px;
            line-height: 1;
            color: var(--heo-text-secondary);
        }

        #theme-heo footer #footer-bottom-center a {
            color: inherit;
            text-decoration: none !important;
        }

        #theme-heo footer #footer-bottom-center i {
            transform: none !important;
            transition: transform var(--heo-dur) var(--heo-ease),
            color var(--heo-dur-fast) var(--heo-ease),
            opacity var(--heo-dur-fast) var(--heo-ease);
            opacity: 0.9;
        }

        #theme-heo footer #footer-bottom-center a:hover i {
            transform: translateY(-1px) scale(1.08) !important;
            color: var(--heo-text);
            opacity: 1;
        }

        html.dark #theme-heo footer #footer-bottom {
            background: rgba(27, 28, 32, 0.68) !important;
            -webkit-backdrop-filter: saturate(155%) blur(22px);
            backdrop-filter: saturate(155%) blur(22px);
            border-top-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.06), 0 -14px 36px rgba(0, 0, 0, 0.45);
        }

        #theme-heo footer #footer-bottom a {
            color: var(--heo-text-secondary);
            text-decoration: none !important;
            transition: color var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo footer #footer-bottom a:hover {
            color: var(--heo-text);
            text-decoration: underline !important;
        }

        #theme-heo footer #footer-bottom-left,
        #theme-heo footer #footer-bottom-right {
            font-size: 12px;
            line-height: 1.75;
        }

        #theme-heo footer br {
            display: none;
        }

        #theme-heo footer .social-button-group {
            padding: 0.5rem 0;
        }

        .tags-group-wrapper {
            animation: rowup 60s linear infinite;
        }

        @keyframes rowup {
            0% {
                transform: translateX(0%);
            }
            100% {
                transform: translateX(-50%);
            }
        }

        /* Loading 动画样式 */
        #loading-box {
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 1001;
        }

        #loading-box.loaded {
            pointer-events: none;
        }

        #loading-box.loaded .loading-bg,
        #loading-box.loaded .loading-animation {
            border-radius: 3rem;
            transform: translateX(100%);
            transition: 1.3s ease;
        }

        #loading-box.loaded .loading-bg {
            transition-delay: 0.3s;
        }

        #loading-box .loading-bg,
        #loading-box .loading-animation {
            position: absolute;
            width: 100%;
            height: 100%;
            will-change: transform;
        }

        #loading-box .loading-bg {
            background: #4f65f0 url("/loadings.svg") repeat;
            background-size: 30%;
        }

        html.dark #loading-box .loading-bg {
            background: #eab308 url("/loadings.svg") repeat;
            background-size: 30%;
        }

        #loading-box .loading-animation {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: var(--heo-surface-strong);
        }

        html.dark #loading-box .loading-animation {
            background: var(--heo-surface-dark);
        }

        #loading-box .loading-animation .loading {
            width: 16rem;
            height: 16rem;
        }

        #loading-box .loading-animation .loading path {
            stroke: var(--heo-text);
            stroke-width: 0.5px;
            animation: dashArray 5s ease-in-out infinite, dashOffset 5s linear infinite;
        }

        #loading-box .loading-animation .loading path.color {
            stroke: #4f65f0;
        }

        html.dark #loading-box .loading-animation .loading path {
            stroke: var(--heo-text);
        }

        html.dark #loading-box .loading-animation .loading path.color {
            stroke: #eab308;
        }

        #loading-box .loading-text {
            position: relative;
            margin-top: 1rem;
            font-size: 26px;
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: 0.3rem;
            z-index: 1;
            animation: shift 1s ease-in-out infinite alternate;
            color: var(--heo-text);
            text-transform: uppercase;
        }

        #loading-box .loading-text2 {
            position: relative;
            display: inline-block;
            margin-top: 0.85rem;
            padding-right: 0.22rem;
            overflow: hidden;
            white-space: nowrap;
            font-family: var(--heo-font-mono);
            font-size: 0.92rem;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: 0.26rem;
            text-transform: uppercase;
            color: rgba(79, 101, 240, 0.92);
            width: 0;
            max-width: calc(10ch + 0.22rem);
            border-right: 2px solid currentColor;
            text-shadow: 0 0 18px rgba(79, 101, 240, 0.18);
            z-index: 1;
            animation: typing 2.2s steps(10, end) infinite alternate, blinkCaret 0.9s steps(1, end) infinite;
        }

        #loading-box .loading-text:before,
        #loading-box .loading-text:after {
            display: block;
            content: attr(data-glitch);
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0.8;
        }

        #loading-box .loading-text2:before,
        #loading-box .loading-text2:after {
            content: none;
        }
        
        #loading-box .loading-text:before {
            animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            color: #ff5252;
            z-index: -1;
        }

        #loading-box .loading-text:after {
            animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
            color: #2ecc71;
            z-index: -2;
        }

        html.dark #loading-box .loading-animation .loading {
            filter: drop-shadow(0 18px 40px rgba(234, 179, 8, 0.18));
        }

        html.dark #loading-box .loading-text {
            color: var(--heo-text);
            text-shadow: 0 10px 28px rgba(234, 179, 8, 0.18);
        }

        html.dark #loading-box .loading-text2 {
            color: rgba(250, 204, 21, 0.92);
            text-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
        }

        html.dark #loading-box .loading-text:before {
            color: #f97316;
        }

        html.dark #loading-box .loading-text:after {
            color: #22c55e;
        }

        @keyframes dashArray {
            0% { stroke-dasharray: 0 1 359 0; }
            50% { stroke-dasharray: 0 359 1 0; }
            100% { stroke-dasharray: 359 1 0 0; }
        }

        @keyframes dashOffset {
            0% { stroke-dashoffset: 365; }
            100% { stroke-dashoffset: 5; }
        }

        @keyframes typing {
            0% {
                width: 0;
            }
            55% {
                width: calc(10ch + 0.22rem);
            }
            100% {
                width: calc(10ch + 0.22rem);
            }
        }

        @keyframes blinkCaret {
            0%,
            49% {
                border-right-color: currentColor;
            }
            50%,
            100% {
                border-right-color: transparent;
            }
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-3px, 3px); }
            40% { transform: translate(-3px, -3px); }
            60% { transform: translate(3px, 3px); }
            80% { transform: translate(3px, -3px); }
            100% { transform: translate(0); }
        }

        @keyframes shift {
            0%, 40%, 44%, 58%, 61%, 65%, 69%, 73%, 100% { transform: skewX(0deg); }
            41% { transform: skewX(10deg); }
            42% { transform: skewX(-10deg); }
            59% { transform: skewX(40deg) skewY(10deg); }
            60% { transform: skewX(-40deg) skewY(-10deg); }
            63% { transform: skewX(10deg) skewY(-5deg); }
            70% { transform: skewX(-50deg) skewY(-20deg); }
            71% { transform: skewX(10deg) skewY(-10deg); }
        }

        /* Mac风格表格美化 */
        #theme-heo .notion-table {
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px) !important;
        }

        #theme-heo .notion-table-header-inner {
            border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
            background: rgba(248, 249, 250, 0.8) !important;
            backdrop-filter: blur(10px) !important;
        }

        #theme-heo .notion-table-row {
            border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
            transition: background-color 0.2s ease !important;
        }

        #theme-heo .notion-table-row:hover {
            background-color: rgba(0, 0, 0, 0.02) !important;
        }

        #theme-heo .notion-table-cell {
            border-right: 1px solid rgba(0, 0, 0, 0.06) !important;
            padding: 12px 16px !important;
        }

        #theme-heo .notion-table-cell:last-child {
            border-right: none !important;
        }

        #theme-heo .notion-table-view-header-cell-inner {
            border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
            padding: 10px 16px !important;
            font-weight: 600 !important;
            color: rgba(0, 0, 0, 0.8) !important;
        }

        #theme-heo .notion-table-view-header-cell-inner:last-child {
            border-right: none !important;
        }

        #theme-heo .notion-simple-table {
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px) !important;
        }

        #theme-heo .notion-simple-table td {
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
            padding: 12px 16px !important;
        }

        #theme-heo .notion-simple-table tr:first-child td {
            background: rgba(248, 249, 250, 0.8) !important;
            backdrop-filter: blur(10px) !important;
            font-weight: 600 !important;
            color: rgba(0, 0, 0, 0.8) !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
        }

        #theme-heo .notion-simple-table tr:hover {
            background-color: rgba(0, 0, 0, 0.02) !important;
        }

        /* 暗色模式 - 进一步增强表格边框对比度 */
        html.dark #theme-heo .notion-table {
            border-color: rgba(255, 255, 255, 0.35) !important;
            background: rgba(30, 30, 32, 0.8) !important;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
        }

        html.dark #theme-heo .notion-table-header-inner {
            border-top-color: rgba(255, 255, 255, 0.28) !important;
            border-bottom-color: rgba(255, 255, 255, 0.35) !important;
            background: rgba(40, 40, 42, 0.8) !important;
        }

        html.dark #theme-heo .notion-table-row {
            border-bottom-color: rgba(255, 255, 255, 0.25) !important;
        }

        html.dark #theme-heo .notion-table-row:hover {
            background-color: rgba(255, 255, 255, 0.04) !important;
        }

        html.dark #theme-heo .notion-table-cell {
            border-right-color: rgba(255, 255, 255, 0.25) !important;
        }

        html.dark #theme-heo .notion-table-view-header-cell-inner {
            border-right-color: rgba(255, 255, 255, 0.28) !important;
            color: rgba(255, 255, 255, 0.9) !important;
        }

        html.dark #theme-heo .notion-simple-table {
            border-color: rgba(255, 255, 255, 0.35) !important;
            background: rgba(30, 30, 32, 0.8) !important;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
        }

        html.dark #theme-heo .notion-simple-table td {
            border-color: rgba(255, 255, 255, 0.25) !important;
        }

        html.dark #theme-heo .notion-simple-table tr:first-child td {
            background: rgba(40, 40, 42, 0.8) !important;
            color: rgba(255, 255, 255, 0.9) !important;
            border-bottom-color: rgba(255, 255, 255, 0.35) !important;
        }

        html.dark #theme-heo .notion-simple-table tr:hover {
            background-color: rgba(255, 255, 255, 0.04) !important;
        }

        /* ===== macOS 风格代码块 ===== */
        // #theme-heo .notion-code {
        //     border-radius: 12px !important;
        //     border: 1px solid rgba(0, 0, 0, 0.08) !important;
        //     background: rgba(248, 249, 250, 0.9) !important;
        //     backdrop-filter: blur(10px) !important;
        //     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        //     padding: 24px !important;
        //     margin: 1.5rem 0 !important;
        //     font-family: var(--heo-font-mono) !important;
        //     font-size: 0.92em !important;
        //     line-height: 1.6 !important;
        //     overflow-x: auto !important;
        //     position: relative !important;
        // }

        // #theme-heo .notion-code::before {
        //     content: '' !important;
        //     position: absolute !important;
        //     top: 12px !important;
        //     left: 12px !important;
        //     width: 12px !important;
        //     height: 12px !important;
        //     border-radius: 50% !important;
        //     background: #ff5f57 !important;
        //     box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #28ca42 !important;
        // }

        // html.dark #theme-heo .notion-code {
        //     border-color: rgba(255, 255, 255, 0.12) !important;
        //     background: rgba(30, 30, 32, 0.9) !important;
        //     box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
        // }

        /* ===== 优雅分割线 ===== */
       /* ===== 优化方案三：带中心装饰的细线 ===== */
        #theme-heo .notion-hr {
            border: none !important;
            height: 1px !important;
            margin: 2.5rem auto !important;
            width: 100% !important; /* 或设置为一个较宽的比例，如 60% */
            background: rgba(0, 0, 0, 0.1) !important; /* 基础细线 */
            position: relative !important;
        }

        /* 在细线中心添加一个装饰性小图标（例如：一个菱形或圆点） */
        #theme-heo .notion-hr::after {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 6px !important;
            height: 6px !important;
            background-color: #d0d0d0 !important; /* 图标颜色 */
            border-radius: 50% !important; /* 圆形，可改为0 菱形 */
            box-shadow: 0 0 0 3px white !important; /* 用白边“挖空”细线，形成穿透效果 */
        }

        html.dark #theme-heo .notion-hr {
            background: rgba(255, 255, 255, 0.15) !important;
        }
        html.dark #theme-heo .notion-hr::after {
            background-color: #888 !important;
            box-shadow: 0 0 0 3px var(--dark-bg-color) !important; /* 需替换为实际的深色背景变量 */
        }

        
        /* ===== 任务列表自定义复选框 ===== */
        #theme-heo .notion-to-do-item {
            align-items: flex-start !important;
            padding: 8px 2px !important;
            margin: 4px 0 !important;
        }

        #theme-heo .notion-property-checkbox {
            width: 20px !important;
            height: 20px !important;
            border: 2px solid rgba(0, 0, 0, 0.2) !important;
            border-radius: 6px !important;
            margin-right: 12px !important;
            margin-top: 2px !important;
            position: relative !important;
            flex-shrink: 0 !important;
            transition: all 0.2s var(--heo-ease) !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px) !important;
        }

        #theme-heo .notion-property-checkbox:hover {
            border-color: rgba(37, 99, 235, 0.6) !important;
            transform: scale(1.05) !important;
        }

        #theme-heo .notion-property-checkbox-checked {
            background: rgba(37, 99, 235, 0.9) !important;
            border-color: rgba(37, 99, 235, 0.9) !important;
        }

        #theme-heo .notion-property-checkbox-checked::after {
            content: '' !important;
            position: absolute !important;
            top: 4px !important;
            left: 7px !important;
            width: 6px !important;
            height: 10px !important;
            border: solid white !important;
            border-width: 0 2px 2px 0 !important;
            transform: rotate(45deg) !important;
        }

        #theme-heo .notion-to-do-checked {
            opacity: 0.7 !important;
            color: var(--heo-text-tertiary) !important;
        }

        html.dark #theme-heo .notion-property-checkbox {
            border-color: rgba(255, 255, 255, 0.3) !important;
            background: rgba(40, 40, 42, 0.8) !important;
        }

        html.dark #theme-heo .notion-property-checkbox:hover {
            border-color: rgba(234, 179, 8, 0.6) !important;
        }

        html.dark #theme-heo .notion-property-checkbox-checked {
            background: rgba(234, 179, 8, 0.9) !important;
            border-color: rgba(234, 179, 8, 0.9) !important;
        }

        /* ===== 阅读态折叠框 ===== */
        #theme-heo .notion-toggle {
            margin: 1.05rem 0 !important;
            border-radius: 1.1rem !important;
            border: 1px solid rgba(203, 213, 225, 0.78) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.88)) !important;
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05) !important;
            overflow: hidden !important;
            transition: border-color 0.25s var(--heo-ease), box-shadow 0.25s var(--heo-ease), background 0.25s var(--heo-ease) !important;
        }

        #theme-heo .notion-toggle[open] {
            border-color: rgba(59, 130, 246, 0.24) !important;
            box-shadow: 0 18px 40px rgba(59, 130, 246, 0.08) !important;
        }

        #theme-heo .notion-toggle > summary {
            list-style: none !important;
            cursor: pointer !important;
            padding: 0.98rem 1.15rem 0.98rem 1.15rem !important;
            background: transparent !important;
            border: none !important;
            transition: color 0.2s var(--heo-ease), background 0.2s var(--heo-ease) !important;
            position: relative !important;
            font-weight: 600 !important;
            color: var(--heo-text) !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.72rem !important;
            min-height: 3.4rem !important;
            padding-right: 3.3rem !important;
        }

        #theme-heo .notion-toggle[open] > summary {
            color: #2563eb !important;
            background: linear-gradient(180deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03)) !important;
            border-bottom: 1px solid rgba(191, 219, 254, 0.75) !important;
        }

        #theme-heo .notion-toggle > summary::-webkit-details-marker {
            display: none !important;
        }

        #theme-heo .notion-toggle > summary::after {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            right: 1.05rem !important;
            width: 0.6rem !important;
            height: 0.6rem !important;
            border-right: 2px solid rgba(100, 116, 139, 0.75) !important;
            border-bottom: 2px solid rgba(100, 116, 139, 0.75) !important;
            transform: translateY(-65%) rotate(45deg) !important;
            transition: transform 0.25s var(--heo-ease), border-color 0.25s var(--heo-ease) !important;
        }

        #theme-heo .notion-toggle[open] > summary::after {
            transform: translateY(-35%) rotate(225deg) !important;
            border-color: rgba(37, 99, 235, 0.82) !important;
        }

        #theme-heo .notion-toggle > summary:hover {
            background: rgba(148, 163, 184, 0.08) !important;
        }

        #theme-heo .notion-toggle[open] > summary:hover {
            background: linear-gradient(180deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.04)) !important;
        }

        #theme-heo .notion-toggle > div {
            padding: 0.95rem 1.15rem 1.1rem !important;
            margin: 0 !important;
            border: 0 !important;
            background: transparent !important;
            animation: slideDown 0.26s var(--heo-ease) !important;
        }

        html.dark #theme-heo .notion-toggle {
            border-color: rgba(255, 255, 255, 0.08) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(17, 24, 39, 0.76)) !important;
            box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24) !important;
        }

        html.dark #theme-heo .notion-toggle[open] {
            border-color: rgba(245, 158, 11, 0.18) !important;
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.28) !important;
        }

        #theme-heo .notion-toggle > summary .notion-equation-inline,
        #theme-heo .notion-toggle > summary .notion-inline-code {
            padding: 0.06rem 0.34rem !important;
            border-radius: 0.52rem !important;
            box-shadow: none !important;
            transform: none !important;
            vertical-align: baseline;
        }

        #theme-heo .notion-toggle > summary .notion-equation-inline {
            background: rgba(255, 255, 255, 0.56) !important;
            border-color: rgba(191, 219, 254, 0.82) !important;
            color: #1d4ed8 !important;
        }

        #theme-heo .notion-toggle > summary .notion-inline-code {
            background: rgba(255, 255, 255, 0.62) !important;
            border-color: rgba(191, 219, 254, 0.72) !important;
            color: #334155 !important;
        }

        #theme-heo .notion-toggle[open] > summary .notion-equation-inline {
            background: rgba(255, 255, 255, 0.68) !important;
            border-color: rgba(147, 197, 253, 0.78) !important;
            color: #1d4ed8 !important;
        }

        #theme-heo .notion-toggle[open] > summary .notion-inline-code {
            background: rgba(255, 255, 255, 0.72) !important;
            border-color: rgba(191, 219, 254, 0.74) !important;
            color: #334155 !important;
        }

        html.dark #theme-heo .notion-toggle > summary .notion-equation-inline {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(148, 163, 184, 0.22) !important;
            color: rgba(255, 244, 214, 0.9) !important;
        }

        html.dark #theme-heo .notion-toggle > summary .notion-inline-code {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(148, 163, 184, 0.18) !important;
            color: rgba(226, 232, 240, 0.92) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary .notion-equation-inline {
            background: rgba(255, 244, 214, 0.08) !important;
            border-color: rgba(245, 158, 11, 0.22) !important;
            color: rgba(255, 244, 214, 0.94) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary .notion-inline-code {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(245, 158, 11, 0.16) !important;
            color: rgba(241, 245, 249, 0.94) !important;
        }

        #theme-heo .notion-toggle > summary .notion-equation-inline .katex,
        #theme-heo .notion-toggle > summary .notion-inline-code {
            font-size: 0.95em !important;
        }

        #theme-heo .notion-toggle > summary:hover .notion-equation-inline,
        #theme-heo .notion-toggle > summary:hover .notion-inline-code,
        #theme-heo .notion-toggle[open] > summary:hover .notion-equation-inline,
        #theme-heo .notion-toggle[open] > summary:hover .notion-inline-code {
            box-shadow: none !important;
            transform: none !important;
        }

        html.dark #theme-heo .notion-toggle > summary {
            color: rgba(241, 245, 249, 0.94) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary {
            color: rgba(255, 244, 214, 0.94) !important;
            background: linear-gradient(180deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05)) !important;
            border-bottom-color: rgba(245, 158, 11, 0.14) !important;
        }

        html.dark #theme-heo .notion-toggle > summary:hover {
            background: rgba(255, 255, 255, 0.04) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary:hover {
            background: linear-gradient(180deg, rgba(245, 158, 11, 0.14), rgba(245, 158, 11, 0.06)) !important;
        }

        html.dark #theme-heo .notion-toggle > summary::after {
            border-color: rgba(148, 163, 184, 0.82) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary::after {
            border-color: rgba(255, 244, 214, 0.78) !important;
        }

        html.dark #theme-heo .notion-toggle > div {
            background: transparent !important;
        }

        /* ===== 警告/提示框通知样式 ===== */
        // #theme-heo .notion-callout {
        //     border-radius: 14px !important;
        //     border: 1px solid rgba(0, 0, 0, 0.08) !important;
        //     // background: rgba(255, 255, 255, 0.85) !important;
        //     backdrop-filter: blur(12px) !important;
        //     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
        //     padding: 20px 24px !important;
        //     margin: 1.5rem 0 !important;
        //     position: relative !important;
        //     overflow: hidden !important;
        // }

        // #theme-heo .notion-callout::before {
        //     content: '' !important;
        //     position: absolute !important;
        //     left: 0 !important;
        //     top: 0 !important;
        //     bottom: 0 !important;
        //     width: 4px !important;
        //     // background: linear-gradient(to bottom, #4f65f0, #a252ff) !important;
        //     border-radius: 4px 0 0 4px !important;
        // }

        // #theme-heo .notion-callout .notion-page-icon {
        //     color: #4f65f0 !important;
        //     font-size: 1.4em !important;
        //     margin-right: 16px !important;
        //     flex-shrink: 0 !important;
        // }

        // html.dark #theme-heo .notion-callout {
        //     border-color: rgba(255, 255, 255, 0.12) !important;
        //     // background: rgba(30, 30, 32, 0.85) !important;
        //     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        // }

        // html.dark #theme-heo .notion-callout::before {
        //     background: linear-gradient(to bottom, #eab308, #f97316) !important;
        // }

        // html.dark #theme-heo .notion-callout .notion-page-icon {
        //     color: #eab308 !important;
        // }

        /* ===== 书签块卡片式设计 ===== */
        #theme-heo .notion-bookmark {
            border-radius: 14px !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(12px) !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
            overflow: hidden !important;
            transition: all 0.3s var(--heo-ease) !important;
            margin: 1.5rem 0 !important;
        }

        #theme-heo .notion-bookmark:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(37, 99, 235, 0.2) !important;
        }

        #theme-heo .notion-bookmark > div:first-child {
            padding: 20px !important;
        }

        #theme-heo .notion-bookmark-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: var(--heo-text) !important;
            margin-bottom: 8px !important;
        }

        #theme-heo .notion-bookmark-description {
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: var(--heo-text-secondary) !important;
            height: auto !important;
            max-height: 3em !important;
        }

        #theme-heo .notion-bookmark-link {
            margin-top: 12px !important;
        }

        html.dark #theme-heo .notion-bookmark {
            border-color: rgba(255, 255, 255, 0.12) !important;
            background: rgba(30, 30, 32, 0.8) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        }

        html.dark #theme-heo .notion-bookmark:hover {
            border-color: rgba(234, 179, 8, 0.2) !important;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3) !important;
        }

        /* ===== 文件块卡片下载面板 ===== */
        #theme-heo .notion-file-link {
            border-radius: 1.05rem !important;
            border: 1px solid rgba(203, 213, 225, 0.76) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.9)) !important;
            backdrop-filter: blur(12px) !important;
            padding: 0.95rem 1rem !important;
            margin: 0.9rem 0 !important;
            transition: border-color 0.25s var(--heo-ease), box-shadow 0.25s var(--heo-ease), transform 0.25s var(--heo-ease), background 0.25s var(--heo-ease) !important;
            text-decoration: none !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.8rem !important;
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.05) !important;
        }

        #theme-heo .notion-file-link:hover {
            background: linear-gradient(180deg, rgba(239, 246, 255, 0.92), rgba(248, 250, 252, 0.9)) !important;
            border-color: rgba(96, 165, 250, 0.36) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 18px 38px rgba(59, 130, 246, 0.1) !important;
        }

        #theme-heo .notion-file-icon {
            margin-right: 0 !important;
            color: #2563eb !important;
            font-size: 1.06rem !important;
            width: 1.25rem !important;
            flex-shrink: 0 !important;
        }

        #theme-heo .notion-file-title {
            font-weight: 600 !important;
            color: var(--heo-text) !important;
            flex: 1 !important;
            min-width: 0 !important;
        }

        #theme-heo .notion-file-size {
            color: var(--heo-text-tertiary) !important;
            font-size: 0.75rem !important;
            margin-left: auto !important;
            padding-left: 0.75rem !important;
            white-space: nowrap !important;
        }

        html.dark #theme-heo .notion-file-link {
            border-color: rgba(255, 255, 255, 0.08) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(17, 24, 39, 0.76)) !important;
            box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24) !important;
        }

        html.dark #theme-heo .notion-file-link:hover {
            background: linear-gradient(180deg, rgba(51, 65, 85, 0.86), rgba(17, 24, 39, 0.8)) !important;
            border-color: rgba(245, 158, 11, 0.22) !important;
            box-shadow: 0 22px 46px rgba(0, 0, 0, 0.3) !important;
        }

        html.dark #theme-heo .notion-file-icon {
            color: #fbbf24 !important;
        }

        /* ===== 音频块自定义播放器 ===== */
        // #theme-heo .notion-audio {
        //     border-radius: 12px !important;
        //     border: 1px solid rgba(0, 0, 0, 0.08) !important;
        //     background: rgba(255, 255, 255, 0.8) !important;
        //     backdrop-filter: blur(10px) !important;
        //     padding: 20px !important;
        //     margin: 1.5rem 0 !important;
        // }

        // #theme-heo .notion-audio audio {
        //     width: 100% !important;
        //     border-radius: 8px !important;
        //     background: rgba(248, 249, 250, 0.9) !important;
        // }

        // #theme-heo .notion-audio audio::-webkit-media-controls-panel {
        //     background: rgba(248, 249, 250, 0.9) !important;
        //     border-radius: 8px !important;
        // }

        // html.dark #theme-heo .notion-audio {
        //     border-color: rgba(255, 255, 255, 0.12) !important;
        //     background: rgba(30, 30, 32, 0.8) !important;
        // }

        // html.dark #theme-heo .notion-audio audio {
        //     background: rgba(40, 40, 42, 0.9) !important;
        // }

        // html.dark #theme-heo .notion-audio audio::-webkit-media-controls-panel {
        //     background: rgba(40, 40, 42, 0.9) !important;
        // }

        /* ===== 公式阅读卡片 ===== */
        #theme-heo .notion-equation-block {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 1.2rem 0 !important;
            padding: 1.1rem 1.2rem !important;
            border-radius: 1.2rem !important;
            border: 1px solid rgba(244, 114, 182, 0.18) !important;
            background: linear-gradient(180deg, rgba(253, 242, 248, 0.96), rgba(252, 231, 243, 0.9)) !important;
            box-shadow: 0 16px 36px rgba(190, 24, 93, 0.06) !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            cursor: default !important;
            text-align: left !important;
        }

        #theme-heo .notion-equation-block .katex-display {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: auto;
            overflow-y: hidden;
        }

        #theme-heo .notion-equation-block .katex {
            min-width: max-content;
            color: #831843;
        }

        #theme-heo .notion-equation-inline {
            display: inline-flex !important;
            align-items: center !important;
            max-width: 100% !important;
            background: rgba(252, 231, 243, 0.7) !important;
            border-radius: 0.7rem !important;
            padding: 0.12rem 0.44rem !important;
            border: 1px solid rgba(244, 114, 182, 0.16) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
            color: #9d174d !important;
        }

        html.dark #theme-heo .notion-equation-block {
            border-color: rgba(244, 114, 182, 0.2) !important;
            background: linear-gradient(180deg, rgba(80, 7, 36, 0.46), rgba(63, 10, 40, 0.38)) !important;
            box-shadow: 0 20px 44px rgba(0, 0, 0, 0.24) !important;
        }

        html.dark #theme-heo .notion-equation-block .katex {
            color: rgba(255, 228, 238, 0.94);
        }

        html.dark #theme-heo .notion-equation-inline {
            background: rgba(91, 33, 60, 0.5) !important;
            border-color: rgba(244, 114, 182, 0.2) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
            color: rgba(255, 228, 238, 0.92) !important;
        }

        #theme-heo .notion-equation-block .katex,
        #theme-heo .notion-equation-block .katex-display,
        #theme-heo .notion-equation-block .katex-html,
        #theme-heo .notion-equation-inline .katex,
        #theme-heo .notion-equation-inline .katex-html {
            background: transparent !important;
        }

        #theme-heo .notion-equation-inline .katex {
            display: inline-flex !important;
            align-items: center !important;
            gap: 0 !important;
        }

        #theme-heo .notion-equation-inline .katex .base {
            background: transparent !important;
        }

        html.dark #theme-heo .notion-equation-block .katex,
        html.dark #theme-heo .notion-equation-block .katex-display,
        html.dark #theme-heo .notion-equation-block .katex-html,
        html.dark #theme-heo .notion-equation-inline .katex,
        html.dark #theme-heo .notion-equation-inline .katex-html,
        html.dark #theme-heo .notion-equation-inline .katex .base {
            background: transparent !important;
        }

      /* ===== 内联代码微调 ===== */
        #theme-heo .notion-inline-code {
            background: linear-gradient(135deg, rgba(241, 245, 249, 0.94) 0%, rgba(248, 250, 252, 0.9) 100%) !important;
            border-radius: 0.58rem !important;
            padding: 0.16rem 0.46rem !important;
            border: 1px solid rgba(148, 163, 184, 0.24) !important;
            font-family: var(--heo-font-mono) !important;
            font-size: 0.88em !important;
            color: #475569 !important;
            transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
            box-shadow: 0 1px 2px rgba(148, 163, 184, 0.08) !important;
        }

        #theme-heo .notion-inline-code:hover {
            background: rgba(226, 232, 240, 0.92) !important;
            border-color: rgba(100, 116, 139, 0.3) !important;
            box-shadow: 0 2px 6px rgba(148, 163, 184, 0.14) !important;
            transform: none;
        }

        html.dark #theme-heo .notion-inline-code {
            background: linear-gradient(135deg, rgba(51, 65, 85, 0.72) 0%, rgba(30, 41, 59, 0.68) 100%) !important;
            border-color: rgba(148, 163, 184, 0.22) !important;
            color: #e2e8f0 !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
        }

        html.dark #theme-heo .notion-inline-code:hover {
            background: rgba(51, 65, 85, 0.9) !important;
            border-color: rgba(148, 163, 184, 0.34) !important;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.26) !important;
        }

        /* ===== 颜色背景文本对比度 ===== */
        #theme-heo .notion-red_background,
        #theme-heo .notion-pink_background,
        #theme-heo .notion-blue_background,
        #theme-heo .notion-purple_background,
        #theme-heo .notion-teal_background,
        #theme-heo .notion-yellow_background,
        #theme-heo .notion-orange_background,
        #theme-heo .notion-brown_background,
        #theme-heo .notion-gray_background,
        #theme-heo .notion-green_background {
            border-radius: 8px !important;
            padding: 2px 7px !important;
            margin: 0 1px !important;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
            color: inherit;
        }

        #theme-heo #article-wrapper #notion-article .notion-callout.notion-red_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-pink_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-blue_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-purple_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-teal_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-yellow_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-orange_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-brown_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-gray_background,
        #theme-heo #article-wrapper #notion-article .notion-callout.notion-green_background {
            background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
            background-blend-mode: soft-light;
        }

        html.dark #theme-heo .notion-red_background,
        html.dark #theme-heo .notion-pink_background,
        html.dark #theme-heo .notion-blue_background,
        html.dark #theme-heo .notion-purple_background,
        html.dark #theme-heo .notion-teal_background,
        html.dark #theme-heo .notion-yellow_background,
        html.dark #theme-heo .notion-orange_background,
        html.dark #theme-heo .notion-brown_background,
        html.dark #theme-heo .notion-gray_background,
        html.dark #theme-heo .notion-green_background {
            opacity: 0.96 !important;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        /* ===== 响应式细节优化 ===== */
        @media (max-width: 768px) {
            /* 移动端文章内容优化 - 防止拥挤，避免横屏滚动 */
            #theme-heo #article-wrapper,
            #theme-heo #article-wrapper #notion-article {
                font-size: 14px !important;
                line-height: 1.65 !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
            }
            
            #theme-heo #article-wrapper #notion-article p {
                margin: 0 0 0.8em !important;
            }
            
            #theme-heo #article-wrapper #notion-article h2 {
                font-size: 1.25rem !important;
                margin: 2.2rem 0 0.5rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article h3 {
                font-size: 1.1rem !important;
                margin: 1.8rem 0 0.4rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article h4 {
                font-size: 1rem !important;
                margin: 1.2rem 0 0.3rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article ul,
            #theme-heo #article-wrapper #notion-article ol {
                padding-left: 1.25rem;
                margin: 0.2rem 0 0.8rem;
                list-style-position: outside;
            }
            
            #theme-heo #article-wrapper #notion-article li {
                margin-bottom: 0.25rem;
            }
            
            #theme-heo #article-wrapper #notion-article li > ul,
            #theme-heo #article-wrapper #notion-article li > ol {
                margin: 0.25rem 0 0.45rem;
            }
            
            #theme-heo #article-wrapper #notion-article blockquote {
                margin: 0 0 1rem;
                padding: 0.5rem 0.8rem;
            }
            
            #theme-heo #article-wrapper #notion-article .notion-list {
                margin-block-end: 0.6rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article .notion-list-disc,
            #theme-heo #article-wrapper #notion-article .notion-list-numbered {
                padding-inline-start: 1.25rem !important;
            }
            
            #theme-heo .notion-code {
                padding: 16px !important;
                font-size: 0.85em !important;
                overflow-x: auto !important;
            }
            
            #theme-heo .notion-callout,
            #theme-heo .notion-bookmark,
            #theme-heo .notion-audio,
            #theme-heo .notion-equation-block {
                padding: 16px !important;
                margin: 1rem 0 !important;
            }
            
            #theme-heo .notion-toggle > summary {
                padding: 10px 36px 10px 14px !important;
            }
            
            #theme-heo .notion-file-link {
                padding: 10px 14px !important;
            }
            
            /* 移动端表格优化 - 防止水平滚动 */
            #theme-heo .notion-table,
            #theme-heo .notion-simple-table {
                font-size: 0.9em !important;
                padding: 8px !important;
                overflow-x: auto !important;
                display: block !important;
            }
            
            #theme-heo .notion-table-cell,
            #theme-heo .notion-simple-table td {
                padding: 8px 10px !important;
                min-width: 60px !important;
            }
            
            #theme-heo .notion-table-view-header-cell-inner {
                padding: 6px 10px !important;
            }
            
            /* 移动端图片优化 - 减小边距 */
            #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image {
                margin: 0.65rem auto !important;
                border-radius: 10px !important;
            }
            
            #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image {
                margin: 0.4rem auto !important;
            }

            #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-wrapper-image + .notion-asset-wrapper-image {
                margin-top: 0.1rem !important;
            }

            #theme-heo #article-wrapper #notion-article .notion-row {
                gap: 0.5rem;
            }

            #theme-heo #article-wrapper #notion-article .notion-column {
                padding-top: 4px;
                padding-bottom: 4px;
            }

            #theme-heo #article-wrapper #notion-article .notion-column .notion-asset-caption {
                margin-top: 0.25rem !important;
                padding: 0 0.25rem !important;
                font-size: 0.76rem !important;
            }

            #theme-heo #article-wrapper #notion-article .notion-asset-caption {
                font-size: 0.8rem !important;
                padding: 0 0.5rem !important;
            }

        }
        
        /* 超小屏幕优化（480px以下） */
        @media (max-width: 480px) {
            #theme-heo #article-wrapper,
            #theme-heo #article-wrapper #notion-article {
                font-size: 13px !important;
                line-height: 1.6 !important;
            }
            
            #theme-heo #article-wrapper #notion-article p {
                margin: 0 0 0.7em !important;
            }
            
            #theme-heo #article-wrapper #notion-article h2 {
                font-size: 1.15rem !important;
                margin: 1.8rem 0 0.4rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article h3 {
                font-size: 1rem !important;
                margin: 1.5rem 0 0.35rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article h4 {
                font-size: 0.95rem !important;
                margin: 1rem 0 0.25rem !important;
            }
            
            #theme-heo #article-wrapper #notion-article ul,
            #theme-heo #article-wrapper #notion-article ol {
                padding-left: 1.1rem;
                margin: 0.2rem 0 0.7rem;
                list-style-position: outside;
            }
            
            #theme-heo #article-wrapper #notion-article li {
                margin-bottom: 0.2rem;
            }
            
            #theme-heo #article-wrapper #notion-article li > ul,
            #theme-heo #article-wrapper #notion-article li > ol {
                margin: 0.2rem 0 0.35rem;
            }
            
            #theme-heo #article-wrapper #notion-article blockquote {
                margin: 0 0 0.8rem;
                padding: 0.4rem 0.7rem;
            }
            
            #theme-heo .notion-code {
                padding: 12px !important;
                font-size: 0.8em !important;
            }
            
            #theme-heo .notion-callout,
            #theme-heo .notion-bookmark,
            #theme-heo .notion-audio,
            #theme-heo .notion-equation-block {
                padding: 12px !important;
                margin: 0.8rem 0 !important;
            }
            
            #theme-heo .notion-table,
            #theme-heo .notion-simple-table {
                font-size: 0.85em !important;
                padding: 6px !important;
            }
            
            #theme-heo .notion-table-cell,
            #theme-heo .notion-simple-table td {
                padding: 6px 8px !important;
                min-width: 50px !important;
            }
            
            #theme-heo .notion-table-view-header-cell-inner {
                padding: 5px 8px !important;
            }
            
            /* 480px以下暗色模式表格边框增强 */
            html.dark #theme-heo .notion-table,
            html.dark #theme-heo .notion-simple-table {
                border-color: rgba(255, 255, 255, 0.4) !important;
            }
            
            html.dark #theme-heo .notion-table-cell,
            html.dark #theme-heo .notion-simple-table td {
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            html.dark #theme-heo .notion-table-header-inner {
                border-top-color: rgba(255, 255, 255, 0.35) !important;
                border-bottom-color: rgba(255, 255, 255, 0.4) !important;
            }
            
            html.dark #theme-heo .notion-table-row {
                border-bottom-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            html.dark #theme-heo .notion-table-view-header-cell-inner {
                border-right-color: rgba(255, 255, 255, 0.35) !important;
            }
        }

        /* ===== 可访问性改进 ===== */
        #theme-heo .notion-link:focus-visible,
        #theme-heo .notion-file-link:focus-visible,
        #theme-heo .notion-toggle > summary:focus-visible,
        #theme-heo .notion-bookmark:focus-visible {
            outline: 2px solid rgba(37, 99, 235, 0.6) !important;
            outline-offset: 2px !important;
            border-radius: 6px !important;
        }

        html.dark #theme-heo .notion-link:focus-visible,
        html.dark #theme-heo .notion-file-link:focus-visible,
        html.dark #theme-heo .notion-toggle > summary:focus-visible,
        html.dark #theme-heo .notion-bookmark:focus-visible {
            outline-color: rgba(234, 179, 8, 0.6) !important;
        }

        #theme-heo .notion-property-checkbox:focus-visible {
            outline: 2px solid rgba(37, 99, 235, 0.6) !important;
            outline-offset: 2px !important;
        }

        html.dark #theme-heo .notion-property-checkbox:focus-visible {
            outline-color: rgba(234, 179, 8, 0.6) !important;
        }

        #theme-heo .heo-about-shell {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin-top: 0 !important;
        }

        #theme-heo #wrapper-outer .article.heo-post-shell.heo-about-shell {
            margin-top: 1rem !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        #theme-heo #wrapper-outer .article.heo-post-shell.heo-about-shell::before {
            display: none !important;
        }

        #theme-heo .heo-about-shell .heo-post-shell__inner {
            padding-top: 1rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }

        #theme-heo .heo-about {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            padding: 1rem 0 0.75rem;
        }

        #theme-heo .heo-about-magazine-grid {
            display: grid;
            gap: 1rem;
            align-items: start;
        }

        #theme-heo .heo-about-magazine-grid--intro {
            grid-template-columns: minmax(0, 1.6fr) minmax(21rem, 0.84fr);
        }

        #theme-heo .heo-about-magazine-grid--feature {
            grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
        }

        #theme-heo .heo-about-section--intro,
        #theme-heo .heo-about-section--skills,
        #theme-heo .heo-about-section--profile,
        #theme-heo .heo-about-section--timeline {
            min-height: 0;
        }

        #theme-heo .heo-about-section {
            overflow: hidden;
            align-self: stretch;
        }

        #theme-heo .heo-about-section--intro,
        #theme-heo .heo-about-section--profile,
        #theme-heo .heo-about-section--skills,
        #theme-heo .heo-about-section--timeline {
            transform: none;
        }

        #theme-heo .heo-about-section--books {
            margin-top: 0;
        }

        #theme-heo .heo-about-section-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.9rem;
            margin-bottom: 1.1rem;
        }

        #theme-heo .heo-about-section-heading__eyebrow {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #64748b;
        }

        #theme-heo .heo-about-section-heading__title {
            font-size: clamp(1.35rem, 2vw, 1.8rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-about-section-heading__extra {
            flex-shrink: 0;
            align-self: flex-start;
        }

        #theme-heo .heo-about-bookshelf__footnote {
            color: var(--heo-card-muted);
            font-size: 0.88rem;
            line-height: 1.7;
        }

        #theme-heo .heo-about-section--books-overview::after {
            inset: 0;
            border-radius: inherit;
            background:
                radial-gradient(circle at top right, rgba(255, 255, 255, 0.28), transparent 34%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.08), transparent 42%);
            opacity: 0.72;
            overflow: hidden;
        }

        #theme-heo .heo-about-section--books-overview .heo-card__body {
            display: flex;
            flex-direction: column;
            gap: 1.4rem;
            padding: 1.5rem;
        }

        #theme-heo .heo-about-bookshelf-overview {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
        }

        #theme-heo .heo-about-bookshelf-overview__top {
            display: grid;
            grid-template-columns: minmax(0, 1.3fr) minmax(16rem, 0.7fr);
            gap: 1.25rem;
            align-items: start;
        }

        #theme-heo .heo-about-bookshelf-overview__main {
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
        }

        #theme-heo .heo-about-bookshelf-overview__action {
            display: flex;
            justify-content: flex-end;
            min-width: 0;
        }

        #theme-heo .heo-about-bookshelf-overview__title {
            margin: 0;
            font-size: clamp(1.6rem, 2.6vw, 2.2rem);
            line-height: 1.1;
            font-weight: 900;
            letter-spacing: -0.04em;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-about-bookshelf-overview__desc {
            margin: 0;
            color: var(--heo-card-text);
            line-height: 1.8;
        }

        #theme-heo .heo-about-bookshelf-overview__meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
        }

        #theme-heo .heo-about-bookshelf-overview__tag {
            display: inline-flex;
            align-items: center;
            min-height: 2rem;
            padding: 0.35rem 0.8rem;
            border-radius: 999px;
            border: 1px solid rgba(203, 213, 225, 0.8);
            background: rgba(255, 255, 255, 0.8);
            color: var(--heo-card-muted);
            font-size: 0.78rem;
            font-weight: 700;
            line-height: 1.2;
        }

        #theme-heo .heo-about-bookshelf-overview__tag--brand {
            border-color: rgba(59, 130, 246, 0.2);
            background: rgba(239, 246, 255, 0.92);
            color: #2563eb;
        }

        #theme-heo .heo-about-bookshelf-overview__tag--success {
            border-color: rgba(34, 197, 94, 0.18);
            background: rgba(240, 253, 244, 0.92);
            color: #15803d;
        }

        #theme-heo .heo-about-bookshelf-overview__tag--warm {
            border-color: rgba(245, 158, 11, 0.18);
            background: rgba(255, 251, 235, 0.94);
            color: #b45309;
        }

        #theme-heo .heo-about-bookshelf-overview__stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.85rem;
        }

        #theme-heo .heo-about-bookshelf-overview__stat {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.35rem;
            padding: 1rem;
            min-height: 7rem;
            border-radius: 1.2rem;
            border: 1px solid rgba(203, 213, 225, 0.85);
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
        }

        #theme-heo .heo-about-bookshelf-overview__stat-value {
            font-size: clamp(1.4rem, 2vw, 2rem);
            font-weight: 900;
            color: #1d4ed8;
            line-height: 1;
        }

        #theme-heo .heo-about-bookshelf-overview__stat-label {
            color: var(--heo-card-muted);
            font-size: 0.88rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-bookshelf-panel-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
            align-items: start;
        }

        #theme-heo .heo-about-bookshelf-panel {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            min-width: 0;
            min-height: 0;
            padding: 1.15rem;
            border-radius: 1.4rem;
            border: 1px solid rgba(203, 213, 225, 0.82);
            background: rgba(255, 255, 255, 0.6);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
        }

        #theme-heo .heo-about-bookshelf__empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 12rem;
            padding: 1.25rem;
            border: 1px dashed rgba(148, 163, 184, 0.5);
            border-radius: 1.2rem;
            background: rgba(248, 250, 252, 0.85);
            color: var(--heo-card-muted);
            text-align: center;
            line-height: 1.8;
        }


        #theme-heo .heo-about-bookshelf__heading-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.7rem;
        }

        #theme-heo .heo-about-bookshelf__panel-count {
            display: inline-flex;
            align-items: center;
            min-height: 2rem;
            padding: 0.35rem 0.78rem;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.06);
            color: var(--heo-card-muted);
            font-size: 0.78rem;
            font-weight: 800;
        }

        #theme-heo .heo-about-bookshelf__toolbar {
            width: min(100%, 18rem);
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.65rem;
            padding: 0.95rem 1rem;
            border: 1px solid rgba(203, 213, 225, 0.72);
            border-radius: 1.2rem;
            background: rgba(255, 255, 255, 0.72);
            box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
        }

        #theme-heo .heo-about-bookshelf__toolbar--static {
            justify-content: center;
        }

        #theme-heo .heo-about-bookshelf__action {
            border: 1px solid rgba(59, 130, 246, 0.18);
            background: rgba(239, 246, 255, 0.92);
            color: #2563eb;
            border-radius: 999px;
            padding: 0.55rem 0.95rem;
            font-size: 0.82rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #theme-heo .heo-about-bookshelf__action:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
        }

        #theme-heo .heo-about-bookshelf__action:disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }

        #theme-heo .heo-about-bookshelf__status {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.2rem;
            color: var(--heo-card-muted);
            font-size: 0.8rem;
            line-height: 1.5;
            text-align: right;
        }

        #theme-heo .heo-about-bookshelf__status--left {
            align-items: flex-start;
            text-align: left;
        }

        #theme-heo .heo-about-bookshelf__status-error {
            color: #dc2626;
        }

        #theme-heo .heo-about-bookshelf__item {
            display: grid;
            grid-template-columns: 6.5rem minmax(0, 1fr);
            gap: 1rem;
            align-items: stretch;
            align-self: start;
            min-width: 0;
            min-height: 0;
            padding: 1rem;
            border: 1px solid rgba(203, 213, 225, 0.88);
            border-radius: 1.35rem;
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
            text-decoration: none !important;
            overflow: hidden;
        }

        #theme-heo .heo-about-bookshelf {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            min-width: 0;
            align-content: start;
        }

        #theme-heo .heo-about-bookshelf__cover-wrap {
            width: 100%;
            height: 100%;
            min-height: 8.6rem;
            aspect-ratio: 3 / 4;
            overflow: hidden;
            border-radius: 1rem;
            background: rgba(226, 232, 240, 0.55);
        }

        #theme-heo .heo-about-bookshelf__cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        #theme-heo .heo-about-bookshelf__meta {
            display: flex;
            flex-direction: column;
            gap: 0.55rem;
            min-width: 0;
            min-height: 100%;
            align-self: stretch;
        }

        #theme-heo .heo-about-bookshelf__summary {
            color: var(--heo-card-text);
            line-height: 1.72;
            font-size: 0.92rem;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-about-bookshelf__footer {
            margin-top: auto;
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            align-items: center;
        }

        #theme-heo .heo-about-bookshelf__title {
            color: var(--heo-card-title);
            font-weight: 800;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-about-bookshelf__author {
            color: var(--heo-card-muted);
            font-size: 0.92rem;
        }

        #theme-heo .heo-about-bookshelf__progress {
            margin-top: auto;
            width: fit-content;
            padding: 0.35rem 0.7rem;
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.88);
            color: #2563eb;
            font-size: 0.78rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-section-heading__desc {
            max-width: 42rem;
            color: var(--heo-card-muted);
            line-height: 1.75;
        }

        #theme-heo .heo-about-hero {
            overflow: hidden;
            position: relative;
        }

        #theme-heo .heo-about-hero::after,
        #theme-heo .heo-about-section::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
                radial-gradient(circle at top right, rgba(255, 255, 255, 0.34), transparent 36%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.1), transparent 42%);
            opacity: 0.8;
        }

        #theme-heo .heo-about-hero .heo-card__body,
        #theme-heo .heo-about-section .heo-card__body,
        #theme-heo .heo-about-article-shell .heo-card__body {
            padding: 1.5rem;
        }

        #theme-heo .heo-about-hero__body {
            position: relative;
            display: block;
            min-height: clamp(18.5rem, 35vw, 23rem);
            padding-right: clamp(13.8rem, 27vw, 20.2rem);
            isolation: isolate;
        }

        #theme-heo .heo-about-hero__avatar-bg {
            position: absolute;
            top: clamp(1rem, 2.2vw, 1.7rem);
            right: clamp(1rem, 2.3vw, 1.75rem);
            z-index: 0;
            pointer-events: none;
            opacity: 0.78;
            transform: rotate(3deg);
            transform-origin: center;
        }

        #theme-heo .heo-about-hero__avatar-bg::before {
            content: '';
            position: absolute;
            inset: -1.35rem;
            border-radius: 2.9rem;
            background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.14), rgba(255, 255, 255, 0.03) 56%, transparent 76%);
            filter: blur(18px);
            opacity: 0.88;
        }

        #theme-heo .heo-about-hero__avatar-bg::after {
            content: '';
            position: absolute;
            inset: -0.35rem;
            border-radius: 2.45rem;
            background: radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.26), transparent 54%), linear-gradient(180deg, rgba(248, 250, 252, 0.03), rgba(248, 250, 252, 0.12));
            mix-blend-mode: screen;
        }

        #theme-heo .heo-about-hero__main {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 0.95rem;
            max-width: min(100%, 44rem);
        }

        #theme-heo .heo-about-hero__badge {
            width: fit-content;
            padding: 0.35rem 0.75rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.12);
            color: #4338ca;
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        #theme-heo .heo-about-hero__title {
            font-size: clamp(2.2rem, 4vw, 3.6rem);
            font-weight: 900;
            line-height: 1.02;
            letter-spacing: -0.05em;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-about-hero__subtitle {
            font-size: 1.02rem;
            font-weight: 600;
            color: #475569;
        }

        #theme-heo .heo-about-hero__description,
        #theme-heo .heo-about-hero__intro,
        #theme-heo .heo-about-intro__content,
        #theme-heo .heo-about-timeline__desc,
        #theme-heo .heo-about-side-note {
            color: var(--heo-card-text);
            line-height: 1.85;
        }

        #theme-heo .heo-about-hero__intro {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            margin-top: 0.25rem;
        }

        #theme-heo .heo-about-hero__tagline {
            width: fit-content;
            padding: 0.7rem 1rem;
            border: 1px solid rgba(191, 219, 254, 0.9);
            border-radius: 1rem;
            background: rgba(239, 246, 255, 0.8);
            color: #1d4ed8;
            font-weight: 700;
        }

        #theme-heo .heo-about-hero__avatar-ring {
            position: relative;
            width: clamp(10.8rem, 20.5vw, 15.2rem);
            height: clamp(10.8rem, 20.5vw, 15.2rem);
            padding: 0.55rem;
            border-radius: 2.35rem;
            background: linear-gradient(145deg, rgba(255,255,255,0.62), rgba(255,255,255,0.16));
            border: 1px solid rgba(255, 255, 255, 0.52);
            box-shadow: 0 30px 70px rgba(99, 102, 241, 0.1), 0 12px 26px rgba(15, 23, 42, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            opacity: 0.95;
        }

        #theme-heo .heo-about-hero__avatar-ring::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.02) 46%, transparent 72%);
            pointer-events: none;
        }

        #theme-heo .heo-about-hero__avatar-ring::after {
            content: '';
            position: absolute;
            inset: 0.55rem;
            border-radius: 1.92rem;
            border: 1px solid rgba(255, 255, 255, 0.34);
            pointer-events: none;
        }

        #theme-heo .heo-about-hero__avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            border-radius: 1.92rem;
            opacity: 0.97;
            filter: saturate(1.05) contrast(1.05) brightness(1.03);
        }

        #theme-heo .heo-about-hero__stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
            margin-top: 1.2rem;
            padding: 0 1.5rem 1.5rem;
        }

        #theme-heo .heo-about-stat,
        #theme-heo .heo-about-contact-item,
        #theme-heo .heo-about-skill-card,
        #theme-heo .heo-about-icon-card {
            border: 1px solid rgba(203, 213, 225, 0.88);
            border-radius: 1.25rem;
            background: rgba(255, 255, 255, 0.72);
            box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
        }

        #theme-heo .heo-about-stat {
            padding: 1rem 1.05rem;
        }

        #theme-heo .heo-about-stat__value {
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-about-stat__label {
            margin-top: 0.28rem;
            font-weight: 700;
            color: #334155;
        }

        #theme-heo .heo-about-stat__helper {
            margin-top: 0.22rem;
            color: var(--heo-card-muted);
            font-size: 0.86rem;
        }

        #theme-heo .heo-about-skills,
        #theme-heo .heo-about-skill-list,
        #theme-heo .heo-about-timeline,
        #theme-heo .heo-about-contact-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #theme-heo .heo-about-section--profile .heo-card__body,
        #theme-heo .heo-about-section--timeline .heo-card__body {
            display: flex;
            flex-direction: column;
            height: auto;
        }

        #theme-heo .heo-about-section--persona .heo-card__body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #theme-heo .heo-about-section--profile .heo-about-side-tags {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
            margin-top: 0;
            align-content: start;
        }

        #theme-heo .heo-about-profile-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.9rem;
            margin-bottom: 1rem;
        }

        #theme-heo .heo-about-section--persona .heo-about-profile-cards {
            margin-bottom: 0;
        }

        #theme-heo .heo-about-profile-card {
            position: relative;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: end;
            gap: 1rem;
            overflow: hidden;
            min-height: 12rem;
            padding: 1.1rem 1.15rem;
            border: 1px solid rgba(203, 213, 225, 0.9);
            border-radius: 1.35rem;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(248, 250, 252, 0.95));
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
            isolation: isolate;
        }

        #theme-heo .heo-about-profile-card--personality {
            grid-template-columns: 1fr;
            min-height: 12.4rem;
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)),
                linear-gradient(135deg, rgba(34, 197, 94, 0.06), rgba(59, 130, 246, 0.03));
        }

        #theme-heo .heo-about-profile-card--hobby {
          background-position: 74% 30%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: rgba(0, 0, 0, 0.3);
          padding-right: clamp(7.2rem, 18vw, 9.6rem);
        }

        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__content,
        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__content {
            max-width: min(62%, 23rem);
        }

        #theme-heo .heo-about-profile-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 40%);
            opacity: 0.7;
            pointer-events: none;
            z-index: 0;
        }

        #theme-heo .heo-about-profile-card--hobby::before {
            background:
                linear-gradient(90deg, rgba(2, 6, 23, 0.54) 0%, rgba(2, 6, 23, 0.28) 32%, rgba(2, 6, 23, 0.08) 56%, rgba(2, 6, 23, 0.18) 100%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 38%);
            opacity: 1;
        }

        #theme-heo .heo-about-profile-card::after {
            content: '';
            position: absolute;
            inset: auto -1.5rem -1.5rem auto;
            width: 6rem;
            height: 6rem;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.16), transparent 68%);
            pointer-events: none;
            z-index: 0;
        }

        #theme-heo .heo-about-profile-card--hobby::after {
            background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 68%);
        }

        #theme-heo .heo-about-profile-card,
        #theme-heo .heo-about-profile-card__combo-anime,
        #theme-heo .heo-about-profile-card__combo-music {
            position: relative;
        }

        #theme-heo .heo-about-profile-card__content,
        #theme-heo .heo-about-profile-card__media {
            z-index: 1;
        }

        #theme-heo .heo-about-section--persona .heo-about-profile-card__content {
            padding-right: 5.2rem;
        }

        #theme-heo .heo-about-section--persona .heo-about-profile-card__title-row {
            justify-content: flex-start;
        }

        #theme-heo .heo-about-section--persona .heo-about-profile-card__badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 2;
        }

        #theme-heo .heo-about-profile-card__eyebrow {
            margin-bottom: 0.4rem;
            font-size: 0.74rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
        }

        #theme-heo .heo-about-profile-card__title {
            color: #0f172a;
            font-size: clamp(1.3rem, 2vw, 1.6rem);
            font-weight: 800;
            line-height: 1.15;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-about-profile-card__accent {
            margin-top: 0.18rem;
            color: #0f766e;
            font-size: 0.94rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-profile-card__description {
            margin-top: 0.75rem;
            color: #475569;
            line-height: 1.72;
        }

        #theme-heo .heo-about-profile-card__title-row {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 0.8rem;
        }

        #theme-heo .heo-about-profile-card__badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2rem;
            padding: 0.35rem 0.75rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.28);
            background: rgba(255, 255, 255, 0.16);
            color: #f8fafc;
            font-size: 0.8rem;
            font-weight: 800;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        #theme-heo .heo-about-profile-card__media {
            align-self: end;
            justify-self: end;
            width: clamp(6.5rem, 22vw, 9.5rem);
        }

        #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__content {
            max-width: min(70%, 30rem);
        }

        #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__media {
            position: absolute;
            right: 0.35rem;
            bottom: -0.15rem;
            width: clamp(7.4rem, 20vw, 10.4rem);
            pointer-events: none;
            z-index: 0;
        }

        #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__image {
            opacity: 0.26;
            filter: grayscale(0.05) saturate(0.9) drop-shadow(0 10px 18px rgba(34, 197, 94, 0.08));
        }

        #theme-heo .heo-about-profile-card__image {
            width: 100%;
            height: auto;
            object-fit: contain;
            object-position: bottom right;
            display: block;
            filter: drop-shadow(0 16px 28px rgba(34, 197, 94, 0.14));
        }

        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__eyebrow,
        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__title,
        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__accent,
        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__description {
            color: #f8fafc;
        }

        #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__accent {
            color: #99f6e4;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__eyebrow {
            color: #15803d;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__accent {
            color: #059669;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__description {
            color: #166534;
            max-width: min(78%, 32rem);
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__badge {
            border-color: rgba(34, 197, 94, 0.18);
            background: rgba(255, 255, 255, 0.7);
            color: #15803d;
            box-shadow: 0 10px 24px rgba(34, 197, 94, 0.12);
        }

        #theme-heo .heo-about-profile-card__media--reading {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 4.4rem;
            min-width: 4.4rem;
            align-self: stretch;
            border-radius: 1.1rem;
            border: 1px solid rgba(34, 197, 94, 0.16);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(220, 252, 231, 0.84));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        #theme-heo .heo-about-profile-card__reading-icon {
            width: 3rem;
            height: 3rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: linear-gradient(135deg, #22c55e, #10b981);
            color: #ffffff;
            font-size: 1.15rem;
            font-weight: 800;
            box-shadow: 0 14px 28px rgba(16, 185, 129, 0.22);
        }

        #theme-heo .heo-about-profile-card--reading {
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            color: #f8fafc;
        }

        #theme-heo .heo-about-profile-card--reading::before {
            background:
                linear-gradient(135deg, rgba(4, 20, 14, 0.26), rgba(3, 7, 18, 0.58) 48%, rgba(3, 7, 18, 0.72)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 38%);
            opacity: 1;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__eyebrow,
        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__title,
        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__accent,
        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__description {
            color: #f8fafc;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__accent {
            color: #86efac;
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__description {
            max-width: min(78%, 32rem);
            color: rgba(240, 253, 244, 0.92);
            text-shadow: 0 2px 12px rgba(2, 6, 23, 0.3);
        }

        #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__badge {
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(255, 255, 255, 0.16);
            color: #dcfce7;
            box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);
        }

        #theme-heo .heo-about-profile-card--fandom-music {
            grid-column: 1 / -1;
            display: block;
            min-height: 0;
            padding: 0;
            border: none;
            background: transparent;
            box-shadow: none;
            overflow: visible;
        }

        #theme-heo .heo-about-profile-card--fandom-music::before,
        #theme-heo .heo-about-profile-card--fandom-music::after {
            display: none;
        }

        #theme-heo .heo-about-profile-card__fandom-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
            gap: 0.95rem;
            align-items: stretch;
            min-width: 0;
        }

        #theme-heo .heo-about-profile-card__fandom-panel {
            position: relative;
            display: grid;
            min-width: 0;
            min-height: 100%;
            overflow: hidden;
            isolation: isolate;
        }

        #theme-heo .heo-about-profile-card__fandom-panel::before,
        #theme-heo .heo-about-profile-card__fandom-panel::after {
            display: none;
        }

        #theme-heo .heo-about-profile-card__fandom-panel--anime {
            padding: 0;
            border: none;
            border-radius: 1.35rem;
            background: transparent;
            box-shadow: none;
        }

        #theme-heo .heo-about-profile-card__fandom-panel--music {
            padding: 0;
            border: none;
            background: transparent;
            box-shadow: none;
        }

        #theme-heo .heo-about-profile-card__combo-anime {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.45rem;
            min-width: 0;
            min-height: 20rem;
            position: relative;
            z-index: 1;
        }

        #theme-heo .heo-about-profile-card__combo-anime::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
            background: linear-gradient(180deg, rgba(2, 6, 23, 0.02) 0%, rgba(2, 6, 23, 0.16) 42%, rgba(2, 6, 23, 0.62) 100%);
            pointer-events: none;
        }

        #theme-heo .heo-about-profile-card__combo-anime-item {
            position: relative;
            overflow: hidden;
            min-height: 100%;
            border-radius: 1rem;
            background: rgba(15, 23, 42, 0.12);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        #theme-heo .heo-about-profile-card__combo-anime-item::after {
            content: '';
            position: absolute;
            inset: auto 0 0 0;
            height: 48%;
            background: linear-gradient(180deg, rgba(2, 6, 23, 0), rgba(2, 6, 23, 0.72));
            pointer-events: none;
        }

        #theme-heo .heo-about-profile-card__combo-anime-image {
            width: 100%;
            height: 100%;
            min-height: 15rem;
            object-fit: cover;
            display: block;
            transition: transform var(--heo-dur-fast) var(--heo-ease), object-position var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-about-profile-card__combo-anime-item:nth-child(3) .heo-about-profile-card__combo-anime-image {
            transform: scale(1.22);
            transform-origin: 72% 12%;
            object-position: 72% 10%;
        }

        #theme-heo .heo-about-profile-card__combo-anime-overlay {
            position: absolute;
            inset: 0;
            z-index: 3;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1rem;
            background: linear-gradient(180deg, rgba(2, 6, 23, 0.2) 0%, rgba(2, 6, 23, 0.12) 32%, rgba(2, 6, 23, 0.78) 100%);
            pointer-events: none;
        }

        #theme-heo .heo-about-profile-card__combo-anime-eyebrow {
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.82);
        }

        #theme-heo .heo-about-profile-card__combo-anime-title,
        #theme-heo .heo-about-profile-card__combo-music-title {
            margin-top: 0.35rem;
            font-size: clamp(1.68rem, 2.55vw, 2.15rem);
            line-height: 1.04;
            font-weight: 900;
            text-shadow: 0 8px 24px rgba(2, 6, 23, 0.34);
        }

        #theme-heo .heo-about-profile-card__combo-anime-subtitle,
        #theme-heo .heo-about-profile-card__combo-music-subtitle {
            margin-top: 0.45rem;
            font-size: 0.96rem;
            line-height: 1.5;
            font-weight: 700;
        }

        #theme-heo .heo-about-profile-card__combo-anime-title {
            margin-top: auto;
            color: #ffffff;
        }

        #theme-heo .heo-about-profile-card__combo-anime-subtitle {
            color: rgba(110, 231, 255, 0.96);
        }

        #theme-heo .heo-about-profile-card__combo-music-title {
            color: #ffffff;
        }

        #theme-heo .heo-about-profile-card__combo-music-subtitle {
            color: rgba(255, 255, 255, 0.92);
        }

        #theme-heo .heo-about-profile-card__combo-music {
            position: relative;
            overflow: hidden;
            border-radius: 1.15rem;
            height: 100%;
            background: rgba(15, 23, 42, 0.12);
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }

        #theme-heo .heo-about-profile-card__combo-music::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(2, 6, 23, 0.48), rgba(2, 6, 23, 0.14) 46%, rgba(2, 6, 23, 0.34));
            pointer-events: none;
        }

        #theme-heo .heo-about-profile-card__combo-music-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        #theme-heo .heo-about-profile-card__combo-music-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1rem;
            color: #ffffff;
        }

        #theme-heo .heo-about-profile-card__combo-music-eyebrow {
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.82);
        }

        #theme-heo .heo-about-profile-card__combo-music-desc {
            max-width: 18rem;
            font-size: 0.98rem;
            line-height: 1.64;
            color: rgba(255, 255, 255, 0.92);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card--hobby {
            background-color: rgba(255, 255, 255, 0.88);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card--hobby::before {
            background:
                linear-gradient(135deg, rgba(248, 250, 252, 0.16), rgba(15, 23, 42, 0.1) 38%, rgba(15, 23, 42, 0.24)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent 42%);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card--reading::before {
            background:
                linear-gradient(135deg, rgba(12, 74, 110, 0.06), rgba(15, 23, 42, 0.18) 42%, rgba(15, 23, 42, 0.3)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent 36%);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card__combo-anime::after {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 23, 42, 0.08) 44%, rgba(2, 6, 23, 0.42) 100%);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card__combo-anime-item::after {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(2, 6, 23, 0.48));
        }

        html:not(.dark) #theme-heo .heo-about-profile-card__combo-anime-overlay {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 23, 42, 0.06) 34%, rgba(2, 6, 23, 0.54) 100%);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card__combo-music::after {
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.05), rgba(15, 23, 42, 0.1) 42%, rgba(15, 23, 42, 0.22));
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-bg {
            opacity: 0.92;
            transform: rotate(1.5deg);
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-bg::before {
            inset: -0.95rem;
            background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.09), rgba(255, 255, 255, 0.02) 58%, transparent 76%);
            filter: blur(10px);
            opacity: 0.56;
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-bg::after {
            background: radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.16), transparent 52%), linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(248, 250, 252, 0.06));
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-ring {
            background: linear-gradient(145deg, rgba(255,255,255,0.34), rgba(255,255,255,0.08));
            border-color: rgba(255, 255, 255, 0.34);
            box-shadow: 0 18px 40px rgba(99, 102, 241, 0.07), 0 8px 18px rgba(15, 23, 42, 0.04);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            opacity: 0.98;
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-ring::before {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.01) 46%, transparent 72%);
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar-ring::after {
            border-color: rgba(255, 255, 255, 0.2);
        }

        html:not(.dark) #theme-heo .heo-about-hero__avatar {
            opacity: 1;
            filter: saturate(1.08) contrast(1.08) brightness(1.02);
        }

        html:not(.dark) #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__image {
            opacity: 0.48;
            filter: grayscale(0.02) saturate(0.98) contrast(1.03) drop-shadow(0 12px 20px rgba(34, 197, 94, 0.1));
        }

        html:not(.dark) #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__media {
            right: 0.2rem;
            bottom: -0.05rem;
        }

        html.dark #theme-heo .heo-about-profile-card__fandom-panel {
            border-color: rgba(71, 85, 105, 0.42);
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.84), rgba(17, 24, 39, 0.88));
            box-shadow: 0 18px 44px rgba(0, 0, 0, 0.3);
        }

        html.dark #theme-heo .heo-about-profile-card__combo-anime-overlay {
            background: linear-gradient(180deg, rgba(2, 6, 23, 0.24) 0%, rgba(2, 6, 23, 0.16) 32%, rgba(2, 6, 23, 0.84) 100%);
        }

        html.dark #theme-heo .heo-about-profile-card__combo-anime-item,
        html.dark #theme-heo .heo-about-profile-card__combo-music {
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.24);
        }

        html.dark #theme-heo .heo-about-profile-card__combo-music::after {
            background: linear-gradient(135deg, rgba(2, 6, 23, 0.56), rgba(2, 6, 23, 0.22) 46%, rgba(2, 6, 23, 0.46));
        }

        @media (max-width: 1023px) {
            #theme-heo .heo-about-profile-card--fandom-music {
                grid-column: auto;
            }

            #theme-heo .heo-about-profile-card__fandom-layout {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-profile-card__combo-anime-image,
            #theme-heo .heo-about-profile-card__combo-music {
                min-height: 12.5rem;
            }
        }

        @media (max-width: 767px) {
            #theme-heo .heo-about-profile-card--fandom-music {
                padding: 0;
            }

            #theme-heo .heo-about-profile-card--fandom-music .heo-about-profile-card__fandom-layout {
                gap: 0.75rem;
            }

            #theme-heo .heo-about-profile-card--fandom-music .heo-about-profile-card__fandom-panel--anime,
            #theme-heo .heo-about-profile-card--fandom-music .heo-about-profile-card__combo-music {
                border-radius: 1.1rem;
            }

            #theme-heo .heo-about-profile-card__combo-anime-overlay {
                padding: 0.82rem;
            }

            #theme-heo .heo-about-profile-card__combo-anime-eyebrow {
                font-size: 0.68rem;
                letter-spacing: 0.1em;
            }

            #theme-heo .heo-about-profile-card__combo-anime-title {
                font-size: 1.18rem;
            }

            #theme-heo .heo-about-profile-card__combo-anime-subtitle {
                margin-top: 0.3rem;
                font-size: 0.72rem;
                line-height: 1.45;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #theme-heo .heo-about-profile-card__combo-anime {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.38rem;
                min-height: 18.5rem;
            }

            #theme-heo .heo-about-profile-card__combo-anime-image {
                min-height: 8.9rem;
            }

            #theme-heo .heo-about-profile-card__combo-anime-label {
                left: 0.45rem;
                right: 0.45rem;
                bottom: 0.45rem;
                font-size: 0.64rem;
            }

            #theme-heo .heo-about-profile-card__combo-music {
                min-height: 11.2rem;
            }

            #theme-heo .heo-about-profile-card__combo-music-overlay {
                padding: 0.82rem;
            }

            #theme-heo .heo-about-profile-card__combo-music-title {
                font-size: 1.42rem;
            }

            #theme-heo .heo-about-profile-card__combo-music-subtitle {
                font-size: 0.84rem;
            }

            #theme-heo .heo-about-profile-card__combo-music-desc {
                max-width: none;
                font-size: 0.93rem;
                line-height: 1.58;
            }
        }

        #theme-heo .heo-about-persona-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-areas:
                'personality creative'
                'hobby reading'
                'anime music';
            gap: 1rem;
            align-items: stretch;
        }

        #theme-heo .heo-about-persona-layout__slot {
            min-width: 0;
        }

        #theme-heo .heo-about-persona-layout__slot--personality {
            grid-area: personality;
        }

        #theme-heo .heo-about-persona-layout__slot--creative {
            grid-area: creative;
        }

        #theme-heo .heo-about-persona-layout__slot--hobby {
            grid-area: hobby;
        }

        #theme-heo .heo-about-persona-layout__slot--reading {
            grid-area: reading;
        }

        #theme-heo .heo-about-persona-layout__slot--anime {
            grid-area: anime;
        }

        #theme-heo .heo-about-persona-layout__slot--music {
            grid-area: music;
        }

        #theme-heo .heo-about-persona-layout__card {
            min-width: 0;
            height: 100%;
        }

        #theme-heo .heo-about-persona-layout__card--personality,
        #theme-heo .heo-about-persona-layout__card--creative {
            min-height: 9.6rem;
        }

        #theme-heo .heo-about-persona-layout__card--hobby,
        #theme-heo .heo-about-persona-layout__card--reading {
            min-height: 8.9rem;
        }

        #theme-heo .heo-about-persona-layout__card--anime {
            overflow: hidden;
            border-radius: 1.35rem;
            height: 27.6rem;
        }

        #theme-heo .heo-about-persona-layout__card--music {
            overflow: hidden;
            border-radius: 1.15rem;
            height: 27.6rem;
        }

        #theme-heo .heo-about-persona-layout__card--creative {
            position: relative;
            display: flex;
            align-items: stretch;
            justify-content: flex-start;
            gap: 0.9rem;
            overflow: hidden;
            min-height: 12.4rem;
            padding: 0.88rem 0.95rem;
            border: 1px solid rgba(203, 213, 225, 0.84);
            border-radius: 1.35rem;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.95));
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
            isolation: isolate;
        }

        #theme-heo .heo-about-persona-layout__card--creative::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.92) 30%, rgba(255, 255, 255, 0.4) 58%, rgba(255, 255, 255, 0.12) 100%);
            pointer-events: none;
            z-index: 1;
        }

        #theme-heo .heo-about-persona-layout__creative-copy,
        #theme-heo .heo-about-persona-layout__creative-figure {
            position: relative;
        }

        #theme-heo .heo-about-persona-layout__creative-copy {
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 0.72rem;
            max-width: min(56%, 15rem);
        }

        #theme-heo .heo-about-persona-layout__creative-eyebrow {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
        }

        #theme-heo .heo-about-persona-layout__creative-title {
            color: #0f172a;
            font-size: clamp(1.24rem, 1.8vw, 1.48rem);
            font-weight: 800;
            line-height: 1.1;
        }

        #theme-heo .heo-about-persona-layout__creative-desc {
            color: #475569;
            line-height: 1.62;
            font-size: 0.9rem;
        }

        #theme-heo .heo-about-persona-layout__creative-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }

        #theme-heo .heo-about-persona-layout__creative-tag {
            display: inline-flex;
            align-items: center;
            min-height: 1.8rem;
            padding: 0.26rem 0.68rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.78);
            border: 1px solid rgba(191, 219, 254, 0.62);
            color: #1d4ed8;
            font-size: 0.76rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-persona-layout__creative-figure {
            position: absolute;
            inset: 0;
            z-index: 0;
            border-radius: inherit;
            background-image:
                linear-gradient(135deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.16)),
                var(--heo-about-creative-image, url('/images/about/guitar-card.jpg'));
            background-size: cover;
            background-repeat: no-repeat;
            background-position: right center;
            pointer-events: none;
        }

        #theme-heo .heo-about-persona-layout__creative-image {
            display: none;
        }

        #theme-heo .heo-about-persona-layout__card--personality .heo-about-profile-card__content {
            max-width: min(62%, 24rem);
        }

        #theme-heo .heo-about-persona-layout__card--anime .heo-about-profile-card__combo-anime {
            height: 100%;
        }

        #theme-heo .heo-about-persona-layout__card--music .heo-about-profile-card__combo-music {
            height: 100%;
        }

        #theme-heo .heo-about-persona-layout__card--music .heo-about-profile-card__combo-music-desc {
            max-width: 16rem;
        }

        @media (max-width: 1023px) {
            #theme-heo .heo-about-persona-layout {
                grid-template-columns: 1fr;
                grid-template-areas:
                    'personality'
                    'creative'
                    'hobby'
                    'reading'
                    'anime'
                    'music';
            }

            #theme-heo .heo-about-persona-layout__card--personality .heo-about-profile-card__content,
            #theme-heo .heo-about-persona-layout__creative-copy,
            #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__content,
            #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__content {
                max-width: none;
            }

            #theme-heo .heo-about-profile-card--hobby {
                background-size: cover;
                background-position: 82% 60%;
                padding-right: 1.15rem;
            }

            #theme-heo .heo-about-persona-layout__card--anime,
            #theme-heo .heo-about-persona-layout__card--music {
                height: 18rem;
            }

            #theme-heo .heo-about-persona-layout__card--anime .heo-about-profile-card__combo-anime,
            #theme-heo .heo-about-persona-layout__card--music .heo-about-profile-card__combo-music {
                height: 100%;
            }
        }

        @media (max-width: 767px) {
            #theme-heo .heo-about-persona-layout {
                grid-template-areas:
                    'personality'
                    'creative'
                    'hobby'
                    'reading'
                    'anime'
                    'music';
            }

            #theme-heo .heo-about-persona-layout__card--creative {
                min-height: 0;
            }

            #theme-heo .heo-about-persona-layout__creative-figure {
                background-position: 74% center;
            }

            #theme-heo .heo-about-persona-layout__card--anime,
            #theme-heo .heo-about-persona-layout__card--music {
                height: 19.4rem;
            }

            #theme-heo .heo-about-persona-layout__card--anime .heo-about-profile-card__combo-anime,
            #theme-heo .heo-about-persona-layout__card--music .heo-about-profile-card__combo-music {
                height: 100%;
            }
        }

        #theme-heo .heo-about-section--intro .heo-about-intro__content {
            font-size: 1.02rem;
        }

        #theme-heo .heo-about-section--timeline .heo-about-timeline__item {
            padding-right: 0.35rem;
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(6.9rem, 1fr));
            grid-auto-rows: minmax(9.25rem, auto);
            gap: 1rem;
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-card {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 0.68rem;
            padding: 1.05rem 0.72rem 0.82rem;
            border-radius: 1.7rem;
            background: var(--heo-skill-bg, linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)));
            border: 1px solid rgba(226, 232, 240, 0.92);
            box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08), 0 6px 14px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-card:nth-child(5n + 1),
        #theme-heo .heo-about-section--skills .heo-about-icon-card:nth-child(4n + 2) {
            transform: none;
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-card:nth-child(7n) {
            //background: linear-gradient(135deg, rgba(239, 246, 255, 0.98), rgba(224, 242, 254, 0.92));
        }

        #theme-heo .heo-about-section--timeline .heo-about-timeline {
            justify-content: flex-start;
            min-height: 0;
        }

        #theme-heo .heo-about-contact-item {
            display: flex;
            flex-direction: column;
            gap: 0.24rem;
            min-width: 0;
            min-height: 100%;
            padding: 0.95rem 1rem;
            text-decoration: none !important;
        }

        #theme-heo .heo-about-contact-item__label {
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
        }

        #theme-heo .heo-about-contact-item__value {
            color: var(--heo-card-title);
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        #theme-heo .heo-about-skill-card {
            padding: 1rem 1.05rem;
        }

        #theme-heo .heo-about-skill-card__title,
        #theme-heo .heo-about-timeline__title,
        #theme-heo .heo-about-icon-card__name {
            color: var(--heo-card-title);
            font-weight: 800;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-about-icon-card__name {
            max-width: 100%;
            font-size: 0.8rem;
            line-height: 1.18;
            letter-spacing: 0.01em;
        }

        #theme-heo .heo-about-skill-card__summary {
            margin-top: 0.4rem;
            color: var(--heo-card-text);
            line-height: 1.7;
        }

        #theme-heo .heo-about-side-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem;
            align-content: flex-start;
        }

        #theme-heo .heo-about-skill-card__tag,
        #theme-heo .heo-about-side-tags__item {
            display: inline-flex;
            align-items: center;
            min-height: 2rem;
            padding: 0.35rem 0.7rem;
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.88);
            color: #2563eb;
            font-size: 0.8rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-icon-card {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            min-width: 0;
            padding: 0.8rem 0.95rem;
            transition: transform var(--heo-dur-fast) var(--heo-ease), box-shadow var(--heo-dur-fast) var(--heo-ease), border-color var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-about-icon-card:hover {
            transform: translateY(-4px);
            border-color: color-mix(in srgb, var(--heo-skill-brand, var(--heo-theme)) 26%, rgba(148, 163, 184, 0.18));
            box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.56);
        }

        #theme-heo .heo-about-icon-card__icon {
            width: 4rem;
            height: 4rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 1.35rem;
            background: rgba(255, 255, 255, 0.72);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        #theme-heo .heo-about-icon-card__svg {
            width: 2rem;
            height: 2rem;
            color: var(--heo-skill-brand, var(--heo-theme));
            flex-shrink: 0;
        }

        #theme-heo .heo-about-icon-card__content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.18rem;
            min-width: 0;
        }

        #theme-heo .heo-about-icon-card__image {
            width: 2rem;
            height: 2rem;
            object-fit: contain;
        }

        #theme-heo .heo-about-timeline__item {
            position: relative;
            display: grid;
            grid-template-columns: 1.25rem minmax(0, 1fr);
            gap: 0.9rem;
            align-items: start;
        }

        #theme-heo .heo-about-timeline__item::after {
            content: '';
            position: absolute;
            left: 0.56rem;
            top: 1.35rem;
            bottom: -1rem;
            width: 1px;
            background: rgba(148, 163, 184, 0.35);
        }

        #theme-heo .heo-about-timeline__item:last-child::after {
            display: none;
        }

        #theme-heo .heo-about-timeline__dot {
            width: 1.1rem;
            height: 1.1rem;
            margin-top: 0.2rem;
            border-radius: 999px;
            background: linear-gradient(135deg, #4f46e5, #3b82f6);
            box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.12);
        }

        #theme-heo .heo-about-reading-flow {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            align-items: start;
        }

        #theme-heo .heo-about-article-shell {
            min-width: 0;
            align-self: stretch;
        }

        #theme-heo .heo-about-feature-card--timeline .heo-about-section-heading {
            margin-bottom: 0.2rem;
        }

        #theme-heo .heo-about-article-shell .heo-card__body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: auto;
            min-height: 0;
        }

        #theme-heo .heo-about-article-content {
            overflow: hidden;
            min-width: 0;
            min-height: 0;
        }

        #theme-heo .heo-about-article-body {
            max-width: none;
        }

        html.dark #theme-heo .heo-about-section-heading__eyebrow,
        html.dark #theme-heo .heo-about-contact-item__label {
            color: #94a3b8;
        }

        html.dark #theme-heo .heo-about-section-heading__title,
        html.dark #theme-heo .heo-about-hero__title,
        html.dark #theme-heo .heo-about-stat__value,
        html.dark #theme-heo .heo-about-stat__label,
        html.dark #theme-heo .heo-about-contact-item__value,
        html.dark #theme-heo .heo-about-timeline__title,
        html.dark #theme-heo .heo-about-icon-card__name {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-about-section-heading__desc,
        html.dark #theme-heo .heo-about-stat__helper,
        html.dark #theme-heo .heo-about-hero__description,
        html.dark #theme-heo .heo-about-hero__intro,
        html.dark #theme-heo .heo-about-intro__content,
        html.dark #theme-heo .heo-about-timeline__desc,
        html.dark #theme-heo .heo-about-side-note {
            color: var(--heo-card-text-dark);
        }

        html.dark #theme-heo .heo-about-hero__badge {
            background: rgba(245, 158, 11, 0.14);
            color: #facc15;
        }

        html.dark #theme-heo .heo-about-hero__subtitle,
        html.dark #theme-heo .heo-about-timeline__year {
            color: #fbbf24;
        }

        html.dark #theme-heo .heo-about-hero__tagline,
        html.dark #theme-heo .heo-about-skill-card__tag,
        html.dark #theme-heo .heo-about-side-tags__item,
        html.dark #theme-heo .heo-about-bookshelf__more {
            border-color: rgba(245, 158, 11, 0.18);
            background: rgba(154, 52, 18, 0.18);
            color: #fde68a;
        }

        html.dark #theme-heo .heo-about-profile-card {
            border-color: rgba(71, 85, 105, 0.42);
            box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
        }

        html.dark #theme-heo .heo-about-profile-card::before {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 42%);
            opacity: 0.52;
        }

        html.dark #theme-heo .heo-about-profile-card::after {
            background: radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 68%);
        }

        html.dark #theme-heo .heo-about-profile-card__eyebrow {
            color: #94a3b8;
        }

        html.dark #theme-heo .heo-about-profile-card__title {
            color: #f8fafc;
        }

        html.dark #theme-heo .heo-about-profile-card__accent {
            color: #67e8f9;
        }

        html.dark #theme-heo .heo-about-profile-card__description {
            color: rgba(226, 232, 240, 0.86);
        }

        html.dark #theme-heo .heo-about-profile-card--personality {
            border-color: rgba(100, 116, 139, 0.42);
            background:
                linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.78)),
                linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.1));
            box-shadow: 0 18px 46px rgba(0, 0, 0, 0.28);
        }

        html.dark #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__accent {
            color: #6ee7b7;
        }

        html.dark #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__image {
            opacity: 0.34;
            filter: grayscale(0.04) saturate(0.96) brightness(1.12) drop-shadow(0 14px 24px rgba(16, 185, 129, 0.16));
        }

        html.dark #theme-heo .heo-about-profile-card--hobby {
            border-color: rgba(148, 163, 184, 0.28);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby::before {
            background: linear-gradient(135deg, rgba(2, 6, 23, 0.06), rgba(2, 6, 23, 0.34) 42%, rgba(2, 6, 23, 0.58));
            opacity: 1;
        }

        html.dark #theme-heo .heo-about-profile-card--hobby::after {
            background: radial-gradient(circle, rgba(45, 212, 191, 0.22), transparent 68%);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__eyebrow {
            color: rgba(226, 232, 240, 0.72);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__title {
            color: #ffffff;
            text-shadow: 0 4px 14px rgba(15, 23, 42, 0.42);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__accent {
            color: #99f6e4;
            text-shadow: 0 2px 10px rgba(15, 23, 42, 0.36);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__description {
            color: rgba(241, 245, 249, 0.92);
            text-shadow: 0 2px 12px rgba(2, 6, 23, 0.42);
        }

        html.dark #theme-heo .heo-about-profile-card--hobby .heo-about-profile-card__badge {
            border-color: rgba(255, 255, 255, 0.14);
            background: rgba(15, 23, 42, 0.42);
            color: #fef08a;
            box-shadow: 0 10px 24px rgba(2, 6, 23, 0.24);
        }

        html.dark #theme-heo .heo-about-persona-layout__card--creative {
            border-color: rgba(100, 116, 139, 0.34);
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.74));
            box-shadow: 0 18px 44px rgba(0, 0, 0, 0.26);
        }

        html.dark #theme-heo .heo-about-persona-layout__card--creative::before {
            background: linear-gradient(90deg, rgba(2, 6, 23, 0.92) 0%, rgba(2, 6, 23, 0.78) 30%, rgba(2, 6, 23, 0.42) 58%, rgba(2, 6, 23, 0.22) 100%);
        }

        html.dark #theme-heo .heo-about-persona-layout__creative-eyebrow {
            color: rgba(226, 232, 240, 0.72);
        }

        html.dark #theme-heo .heo-about-persona-layout__creative-title {
            color: #ffffff;
        }

        html.dark #theme-heo .heo-about-persona-layout__creative-desc {
            color: rgba(226, 232, 240, 0.9);
        }

        html.dark #theme-heo .heo-about-persona-layout__creative-tag {
            background: rgba(15, 23, 42, 0.56);
            border-color: rgba(125, 211, 252, 0.24);
            color: #bfdbfe;
        }

        html.dark #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__title {
            color: #f0fdf4;
        }

        html.dark #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__eyebrow {
            color: #86efac;
        }

        html.dark #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__accent {
            color: #6ee7b7;
        }

        html.dark #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__description {
            color: rgba(220, 252, 231, 0.78);
        }

        html.dark #theme-heo .heo-about-profile-card--reading .heo-about-profile-card__badge {
            border-color: rgba(74, 222, 128, 0.16);
            background: rgba(8, 51, 43, 0.78);
            color: #bbf7d0;
            box-shadow: 0 10px 24px rgba(2, 6, 23, 0.26);
        }

        html.dark #theme-heo .heo-about-profile-card__media--reading {
            border-color: rgba(74, 222, 128, 0.12);
            background: linear-gradient(180deg, rgba(10, 60, 47, 0.82), rgba(17, 24, 39, 0.72));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 10px 22px rgba(0, 0, 0, 0.18);
        }

        html.dark #theme-heo .heo-about-profile-card__reading-icon {
            background: linear-gradient(135deg, #22c55e, #10b981);
            box-shadow: 0 14px 28px rgba(16, 185, 129, 0.18);
        }

        html.dark #theme-heo .heo-about-bookshelf-overview {
            border: 0;
            background: transparent;
            box-shadow: none;
        }

        html.dark #theme-heo .heo-about-section--books-overview::after {
            border-radius: inherit;
            background:
                radial-gradient(circle at top right, rgba(96, 165, 250, 0.14), transparent 34%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.05), transparent 42%);
            opacity: 0.78;
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__desc,
        html.dark #theme-heo .heo-about-bookshelf-overview__stat-label,
        html.dark #theme-heo .heo-about-bookshelf__status,
        html.dark #theme-heo .heo-about-bookshelf__panel-count {
            color: rgba(226, 232, 240, 0.78);
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__tag,
        html.dark #theme-heo .heo-about-bookshelf-overview__stat,
        html.dark #theme-heo .heo-about-bookshelf__toolbar {
            border-color: rgba(71, 85, 105, 0.7);
            background: rgba(15, 23, 42, 0.58);
            box-shadow: 0 12px 28px rgba(2, 6, 23, 0.2);
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__tag {
            color: rgba(226, 232, 240, 0.78);
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__tag--brand {
            border-color: rgba(59, 130, 246, 0.28);
            background: rgba(30, 64, 175, 0.24);
            color: #93c5fd;
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__tag--success {
            border-color: rgba(34, 197, 94, 0.26);
            background: rgba(20, 83, 45, 0.24);
            color: #86efac;
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__tag--warm {
            border-color: rgba(245, 158, 11, 0.26);
            background: rgba(146, 64, 14, 0.24);
            color: #fcd34d;
        }

        html.dark #theme-heo .heo-about-bookshelf-overview__stat-value {
            color: #60a5fa;
        }

        html.dark #theme-heo .heo-about-bookshelf__panel-count {
            background: rgba(148, 163, 184, 0.14);
        }

        html.dark #theme-heo .heo-about-bookshelf__toolbar {
            background: rgba(15, 23, 42, 0.7);
        }

        html.dark #theme-heo .heo-about-bookshelf__action {
            border-color: rgba(96, 165, 250, 0.26);
            background: rgba(30, 64, 175, 0.18);
            color: #bfdbfe;
        }

        html.dark #theme-heo .heo-about-bookshelf__action:hover:not(:disabled) {
            box-shadow: 0 10px 24px rgba(59, 130, 246, 0.2);
        }

        html.dark #theme-heo .heo-about-stat,
        html.dark #theme-heo .heo-about-contact-item,
        html.dark #theme-heo .heo-about-skill-card,
        html.dark #theme-heo .heo-about-icon-card,
        html.dark #theme-heo .heo-about-bookshelf-panel,
        html.dark #theme-heo .heo-about-bookshelf__item {
            border-color: var(--heo-card-dark-border);
            background: rgba(15, 23, 42, 0.72);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
        }

        html.dark #theme-heo .heo-about-bookshelf-panel {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(17, 24, 39, 0.82));
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 40px rgba(2, 6, 23, 0.28);
        }

        html.dark #theme-heo .heo-about-bookshelf__item {
            background: linear-gradient(180deg, rgba(20, 26, 42, 0.92), rgba(24, 32, 54, 0.9));
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.35);
        }

        html.dark #theme-heo .heo-about-bookshelf__summary {
            color: rgba(226, 232, 240, 0.82);
        }

        html.dark #theme-heo .heo-about-bookshelf__author {
            color: rgba(191, 219, 254, 0.72);
        }

        html.dark #theme-heo .heo-about-timeline__item::after {
            background: rgba(71, 85, 105, 0.5);
        }

        html.dark #theme-heo .heo-about-timeline__dot {
            background: linear-gradient(135deg, #f59e0b, #f97316);
            box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.14);
        }

        @media (max-width: 1023px) {
            #theme-heo .heo-about-intro {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-hero__body {
                min-height: 0;
                padding-right: 1.15rem;
                padding-top: clamp(6.9rem, 22vw, 8.2rem);
            }

            #theme-heo .heo-about-hero__avatar-bg {
                top: 0.9rem;
                right: 0.9rem;
            }

            #theme-heo .heo-about-hero__avatar-ring {
                width: clamp(6.2rem, 26vw, 7.8rem);
                height: clamp(6.2rem, 26vw, 7.8rem);
                border-radius: 1.35rem;
                opacity: 0.6;
            }

            #theme-heo .heo-about-hero__avatar {
                border-radius: 1.05rem;
            }

            #theme-heo .heo-about-hero__stats {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-section--skills .heo-about-icon-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            #theme-heo .heo-about-profile-card {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-profile-card__media {
                width: clamp(6rem, 32vw, 9rem);
            }

            #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__content {
                max-width: min(72%, 28rem);
            }

            #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__media {
                width: clamp(6.8rem, 28vw, 9rem);
            }
        }

        @media (max-width: 1279px) {
            #theme-heo .heo-about-magazine-grid--intro,
            #theme-heo .heo-about-magazine-grid--feature,
            #theme-heo .heo-about-bookshelf {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-section--intro,
            #theme-heo .heo-about-section--profile,
            #theme-heo .heo-about-section--skills,
            #theme-heo .heo-about-section--timeline {
                transform: none;
            }

            #theme-heo .heo-about-section--books {
                margin-top: 0;
            }
        }


        @media (max-width: 767px) {
            #theme-heo .heo-about {
                gap: 1rem;
                padding-top: 0.5rem;
            }

            #theme-heo .heo-about-section {
                transform: none !important;
            }

            #theme-heo .heo-about-profile-card:not(.heo-about-profile-card--fandom-music) {
                min-height: 11.2rem;
                padding: 1rem;
            }

            #theme-heo .heo-about-profile-card__title-row {
                flex-direction: column;
                align-items: flex-start;
            }

            #theme-heo .heo-about-profile-card__badge {
                margin-top: 0.55rem;
            }

            #theme-heo .heo-about-profile-card__media {
                width: min(8rem, 46vw);
            }

            #theme-heo .heo-about-profile-card--personality {
                min-height: 9.4rem;
            }

            #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__content {
                max-width: none;
            }

            #theme-heo .heo-about-profile-card--personality .heo-about-profile-card__media {
                right: -0.22rem;
                bottom: -0.3rem;
                width: min(7.2rem, 38vw);
            }

            #theme-heo .heo-about-section-heading {
                flex-direction: column;
            }

            #theme-heo .heo-about-section-heading__extra {
                width: 100%;
            }

            #theme-heo .heo-about-hero .heo-card__body,
            #theme-heo .heo-about-section .heo-card__body,
            #theme-heo .heo-about-article-shell .heo-card__body {
                padding: 1.15rem;
            }

            #theme-heo .heo-about-hero__title {
                font-size: clamp(1.9rem, 10vw, 2.5rem);
            }

            #theme-heo .heo-about-hero__stats {
                padding: 0 1.15rem 1.15rem;
            }

            #theme-heo .heo-about-section--books .heo-about-section-heading {
                flex-direction: column;
            }

            #theme-heo .heo-about-bookshelf-overview__top {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-bookshelf-overview__stats {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-bookshelf__heading-actions,
            #theme-heo .heo-about-bookshelf__toolbar,
            #theme-heo .heo-about-bookshelf__status {
                width: 100%;
                align-items: flex-start;
                text-align: left;
            }

            #theme-heo .heo-about-bookshelf-panel {
                padding: 1rem;
            }

            #theme-heo .heo-about-bookshelf__item {
                grid-template-columns: 5.5rem minmax(0, 1fr);
                gap: 0.85rem;
            }

            #theme-heo .heo-about-bookshelf__summary {
                -webkit-line-clamp: 5;
            }

            #theme-heo .heo-about-bookshelf__item,
            #theme-heo .heo-about-icon-card {
                width: 100%;
            }

            #theme-heo .heo-about-section--skills .heo-about-icon-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 0.72rem;
            }

            #theme-heo .heo-about-section--skills .heo-about-icon-card {
                padding: 0.92rem 0.62rem 0.78rem;
                border-radius: 1.35rem;
            }

            #theme-heo .heo-about-icon-card__icon {
                width: 3.55rem;
                height: 3.55rem;
                border-radius: 1.2rem;
            }

            #theme-heo .heo-about-icon-card__svg {
                width: 1.8rem;
                height: 1.8rem;
            }

            #theme-heo .heo-about-icon-card__name {
                font-size: 0.74rem;
            }

            #theme-heo .heo-about-icon-card__meta {
                display: none;
            }
        }
        .heo-about-override-scope {}

        #theme-heo .heo-about {
            gap: 1.25rem;
        }

        #theme-heo .heo-about-split-grid,
        #theme-heo .heo-about-feature-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
            align-items: start;
        }

        #theme-heo .heo-about-reading-flow {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            align-items: start;
        }

        #theme-heo .heo-about-feature-stack {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            align-content: start;
        }

        #theme-heo .heo-about-section--persona,
        #theme-heo .heo-about-section--skills,
        #theme-heo .heo-about-section--focus,
        #theme-heo .heo-about-section--books-overview,
        #theme-heo .heo-about-article-shell,
        #theme-heo .heo-about-feature-card {
            transform: none;
            margin-top: 0;
            min-height: auto;
        }

        #theme-heo .heo-about-section--persona .heo-card__body,
        #theme-heo .heo-about-section--skills .heo-card__body,
        #theme-heo .heo-about-section--focus .heo-card__body,
        #theme-heo .heo-about-feature-card .heo-card__body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: auto;
        }

        #theme-heo .heo-about-contact-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
            gap: 0.85rem;
            margin-top: 0;
            align-items: stretch;
        }

        #theme-heo .heo-about-feature-card {
            overflow: visible;
            position: relative;
        }

        #theme-heo .heo-about-section--focus .heo-card__body,
        #theme-heo .heo-about-feature-card .heo-card__body {
            padding-left: 1.5rem;
        }

        #theme-heo .heo-about-feature-card__title {
            margin-top: 0.2rem;
            color: var(--heo-card-title);
            font-size: clamp(1.2rem, 1.8vw, 1.5rem);
            font-weight: 800;
            line-height: 1.2;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-about-feature-card__description,
        #theme-heo .heo-about-bookshelf__summary,
        #theme-heo .heo-about-icon-card__meta {
            color: var(--heo-card-text);
            line-height: 1.78;
        }

        #theme-heo .heo-about-feature-card__tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-top: 0.15rem;
        }

        #theme-heo .heo-about-feature-card__tag,
        #theme-heo .heo-about-bookshelf__note {
            display: inline-flex;
            align-items: center;
            width: fit-content;
            min-height: 2rem;
            padding: 0.35rem 0.7rem;
            border-radius: 999px;
            background: rgba(239, 246, 255, 0.92);
            color: #2563eb;
            font-size: 0.8rem;
            font-weight: 700;
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-grid {
            grid-template-columns: repeat(auto-fit, minmax(7.2rem, 1fr));
            grid-auto-rows: minmax(8.4rem, auto);
        }

        #theme-heo .heo-about-section--skills .heo-about-icon-card {
            align-items: center;
            text-align: center;
            gap: 0.75rem;
            background: var(--heo-skill-bg, linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.95)));
        }

        #theme-heo .heo-about-icon-card__symbol {
            color: var(--heo-skill-brand, #1d4ed8);
            font-size: 0.9rem;
            font-weight: 800;
            letter-spacing: 0.08em;
        }

        #theme-heo .heo-about-icon-card__meta {
            font-size: 0.76rem;
        }

        #theme-heo .heo-about-bookshelf {
            grid-template-columns: 1fr;
            gap: 1rem;
            max-height: none;
            overflow: visible;
            padding-right: 0;
        }

        #theme-heo .heo-about-bookshelf__item {
            grid-template-columns: 6.5rem minmax(0, 1fr);
            grid-template-rows: none;
            gap: 1rem;
            align-items: stretch;
        }

        #theme-heo .heo-about-bookshelf__cover-wrap {
            width: 6.5rem;
            aspect-ratio: auto;
            min-height: 9rem;
        }

        #theme-heo .heo-about-bookshelf__meta {
            gap: 0.5rem;
            justify-content: center;
        }

        #theme-heo .heo-about-bookshelf__summary {
            font-size: 0.94rem;
            -webkit-line-clamp: 4;
        }

        #theme-heo .heo-about-profile-cards {
            margin-bottom: 0;
        }

        #theme-heo .heo-about-contact-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
            gap: 0.85rem;
            margin-top: 0;
            align-items: stretch;
        }

        html.dark #theme-heo .heo-about-bookshelf__title {
            color: rgba(248, 250, 252, 0.96);
            text-shadow: 0 1px 0 rgba(15, 23, 42, 0.24);
        }

        html.dark #theme-heo .heo-about-feature-card__eyebrow {
            color: #94a3b8;
        }

        html.dark #theme-heo .heo-about-feature-card__title {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-about-feature-card__description,
        html.dark #theme-heo .heo-about-bookshelf__summary,
        html.dark #theme-heo .heo-about-icon-card__meta {
            color: rgba(226, 232, 240, 0.82);
        }

        html.dark #theme-heo .heo-about-bookshelf__author {
            color: rgba(191, 219, 254, 0.72);
        }

        html.dark #theme-heo .heo-about-feature-card__tag,
        html.dark #theme-heo .heo-about-bookshelf__note {
            border-color: rgba(245, 158, 11, 0.18);
            background: rgba(154, 52, 18, 0.18);
            color: #fde68a;
        }

        html.dark #theme-heo .heo-about-section--skills .heo-about-icon-card {
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(30, 41, 59, 0.86));
            border-color: rgba(71, 85, 105, 0.36);
            box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        html.dark #theme-heo .heo-about-icon-card__icon {
            background: rgba(255, 255, 255, 0.06);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 24px rgba(0, 0, 0, 0.18);
        }

        html.dark #theme-heo .heo-about-icon-card__name {
            color: rgba(248, 250, 252, 0.94);
        }

        @media (max-width: 1279px) {
            #theme-heo .heo-about-split-grid,
            #theme-heo .heo-about-feature-row,
            #theme-heo .heo-about-reading-flow,
            #theme-heo .heo-about-bookshelf-panel-grid,
            #theme-heo .heo-about-bookshelf-overview__top {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-bookshelf-overview__action {
                justify-content: flex-start;
            }

            #theme-heo .heo-about-bookshelf,
            #theme-heo .heo-about-bookshelf__toolbar,
            #theme-heo .heo-about-bookshelf__status {
                width: 100%;
                align-items: flex-start;
                text-align: left;
            }

            #theme-heo .heo-about-bookshelf {
                max-height: none;
                overflow: visible;
                padding-right: 0;
            }
        }

        @media (max-width: 767px) {
            #theme-heo .heo-about-section--focus .heo-card__body,
            #theme-heo .heo-about-feature-card .heo-card__body {
                padding-left: 1.15rem;
            }

            #theme-heo .heo-about-bookshelf-overview {
                padding: 1rem;
            }

            #theme-heo .heo-about-bookshelf-overview__stats {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-about-bookshelf__heading-actions {
                align-items: flex-start;
            }

            #theme-heo .heo-about-bookshelf__item {
                grid-template-columns: 5rem minmax(0, 1fr);
                gap: 0.8rem;
                align-items: start;
                padding: 0.85rem;
            }

            #theme-heo .heo-about-bookshelf__cover-wrap {
                width: 5rem;
                min-height: 7rem;
                aspect-ratio: 5 / 7;
                border-radius: 0.9rem;
            }

            #theme-heo .heo-about-bookshelf__meta {
                min-height: 7rem;
                gap: 0.4rem;
            }

            #theme-heo .heo-about-bookshelf__title {
                font-size: 1rem;
                line-height: 1.35;
            }

            #theme-heo .heo-about-bookshelf__author {
                font-size: 0.88rem;
            }

            #theme-heo .heo-about-bookshelf__summary {
                font-size: 0.85rem;
                line-height: 1.65;
                -webkit-line-clamp: 3;
            }

            #theme-heo .heo-about-bookshelf__progress {
                font-size: 0.74rem;
                padding: 0.28rem 0.58rem;
            }

            #theme-heo .heo-booklist {
                gap: 1rem;
                padding: 0.35rem 0 1.2rem;
            }

            #theme-heo .heo-booklist-hero .heo-card__body,
            #theme-heo .heo-booklist-nav .heo-card__body,
            #theme-heo .heo-booklist-section .heo-card__body,
            #theme-heo .heo-booklist-empty .heo-card__body {
                padding: 0.95rem;
            }

            #theme-heo .heo-booklist-hero__grid {
                grid-template-columns: minmax(0, 1fr);
                gap: 0.85rem;
            }

            #theme-heo .heo-booklist-hero__title {
                margin-top: 0.45rem;
                font-size: clamp(2rem, 9vw, 2.5rem);
                line-height: 1.02;
                word-break: break-word;
            }

            #theme-heo .heo-booklist-hero__subtitle {
                margin-top: 0.4rem;
                font-size: 0.88rem;
                line-height: 1.55;
            }

            #theme-heo .heo-booklist-hero__description {
                margin-top: 0.35rem;
                font-size: 0.84rem;
                line-height: 1.65;
            }

            #theme-heo .heo-booklist-hero__aside {
                gap: 0.7rem;
            }

            #theme-heo .heo-booklist-hero__stats {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.55rem;
            }

            #theme-heo .heo-booklist-hero__stat {
                padding: 0.72rem 0.68rem;
            }

            #theme-heo .heo-booklist-hero__stat-value {
                font-size: 1.15rem;
            }

            #theme-heo .heo-booklist-hero__stat-label {
                font-size: 0.74rem;
                line-height: 1.35;
            }

            #theme-heo .heo-booklist-hero__highlights {
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: minmax(8.5rem, 72%);
                gap: 0.55rem;
                overflow-x: auto;
                overscroll-behavior-x: contain;
                scrollbar-width: thin;
                padding-bottom: 0.15rem;
                -webkit-overflow-scrolling: touch;
            }

            #theme-heo .heo-booklist-hero__highlight {
                min-height: 4.2rem;
                padding: 0.78rem 0.82rem;
            }

            #theme-heo .heo-booklist-nav__header {
                position: relative;
                align-items: flex-start;
                flex-direction: column;
                gap: 0.45rem;
                margin-bottom: 0.7rem;
                padding-right: 0;
                padding-top: 0;
                min-height: 0;
            }

            #theme-heo .heo-booklist-nav__summary {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                display: inline-flex;
                align-items: baseline;
                justify-content: flex-end;
                gap: 0.3rem;
                text-align: right;
                white-space: nowrap;
            }

            #theme-heo .heo-booklist-nav__chips {
                gap: 0.55rem;
                flex-wrap: nowrap;
                overflow-x: auto;
                overscroll-behavior-x: contain;
                scrollbar-width: thin;
                padding-bottom: 0.1rem;
                -webkit-overflow-scrolling: touch;
            }

            #theme-heo .heo-booklist-nav__chip {
                flex: 0 0 auto;
                white-space: nowrap;
            }

            #theme-heo .heo-booklist-featured__grid {
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: minmax(15.5rem, 86%);
                grid-template-columns: none;
                gap: 0.75rem;
                overflow-x: auto;
                overflow-y: visible;
                overscroll-behavior-x: contain;
                scrollbar-width: thin;
                padding: 0 0.12rem 0.2rem;
                -webkit-overflow-scrolling: touch;
            }

            #theme-heo .heo-booklist-section__grid {
                grid-template-columns: 1fr;
            }

            #theme-heo .heo-booklist-card {
                grid-template-columns: 4.35rem minmax(0, 1fr);
                padding: 0.72rem;
                gap: 0.62rem;
                border-radius: 1.1rem;
            }

            #theme-heo .heo-booklist-card__cover-wrap {
                width: 4.35rem;
                min-height: 6.1rem;
                border-radius: 0.82rem;
            }

            #theme-heo .heo-booklist-card__meta {
                gap: 0.24rem;
            }

            #theme-heo .heo-booklist-card__tag {
                padding: 0.34rem 0.62rem;
                font-size: 0.74rem;
            }

            #theme-heo .heo-booklist-card__title {
                font-size: 0.92rem;
                line-height: 1.34;
            }

            #theme-heo .heo-booklist-card__author {
                font-size: 0.8rem;
            }

            #theme-heo .heo-booklist-card__summary {
                font-size: 0.82rem;
                line-height: 1.56;
                -webkit-line-clamp: 2;
            }

            #theme-heo .heo-booklist-card__footer {
                padding-top: 0.08rem;
            }

            #theme-heo .heo-booklist-card__cta {
                font-size: 0.78rem;
            }

        }

        #theme-heo .heo-booklist-layout {
            max-width: 100%;
        }

        #theme-heo .heo-booklist {
            width: 100%;
            max-width: 92rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 0.5rem 0 1.5rem;
        }

        #theme-heo .heo-booklist-hero {
            position: relative;
            overflow: hidden;
            isolation: isolate;
        }

        #theme-heo .heo-booklist-hero::before {
            content: '';
            position: absolute;
            inset: -20% auto auto -8%;
            width: 24rem;
            height: 24rem;
            border-radius: 999px;
            pointer-events: none;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 32%, rgba(59, 130, 246, 0) 72%);
            filter: blur(8px);
            z-index: 0;
        }

        #theme-heo .heo-booklist-hero::after {
            content: '';
            position: absolute;
            right: -8%;
            bottom: -30%;
            width: 26rem;
            height: 26rem;
            border-radius: 999px;
            pointer-events: none;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(79, 70, 229, 0.08) 35%, rgba(79, 70, 229, 0) 72%);
            filter: blur(10px);
            z-index: 0;
        }

            display: flex;
            flex-direction: column;
            gap: 0.7rem;
        }

        #theme-heo .heo-booklist-scroll-hint {
            display: none;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.74rem;
            line-height: 1.4;
            color: rgba(71, 85, 105, 0.72);
        }

        #theme-heo .heo-booklist-scroll-hint::after {
            content: '→';
            font-size: 0.82rem;
            opacity: 0.72;
        }

        #theme-heo .heo-booklist-hero .heo-card__body,
        #theme-heo .heo-booklist-nav .heo-card__body,
        #theme-heo .heo-booklist-section .heo-card__body,
        #theme-heo .heo-booklist-empty .heo-card__body {
            padding: 1.1rem;
        }

        #theme-heo .heo-booklist-hero__grid {
            display: grid;
            grid-template-columns: minmax(0, 1.6fr) minmax(18rem, 0.95fr);
            gap: 1rem;
            align-items: stretch;
        }

        #theme-heo .heo-booklist-hero__intro {
            min-width: 0;
        }

        #theme-heo .heo-booklist-hero__aside {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            min-width: 0;
        }

        #theme-heo .heo-booklist-hero__badge {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 0.28rem 0.65rem;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #475569;
            background: rgba(241, 245, 249, 0.88);
            border: 1px solid rgba(148, 163, 184, 0.18);
        }

        #theme-heo .heo-booklist-hero__title {
            margin-top: 0.65rem;
            font-size: clamp(1.8rem, 4vw, 3rem);
            line-height: 1.04;
            font-weight: 900;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-booklist-hero__subtitle {
            margin-top: 0.55rem;
            font-size: 0.96rem;
            line-height: 1.65;
            color: rgba(51, 65, 85, 0.82);
            text-shadow: none;
        }

        #theme-heo .heo-booklist-hero__description {
            margin-top: 0.45rem;
            max-width: 52rem;
            font-size: 0.9rem;
            line-height: 1.7;
            color: rgba(71, 85, 105, 0.88);
            text-shadow: none;
        }


        #theme-heo .heo-booklist-hero__runtime-tags {
            margin-top: 0.8rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        #theme-heo .heo-booklist-hero__runtime-tag {
            display: inline-flex;
            align-items: center;
            min-height: 1.9rem;
            padding: 0.38rem 0.75rem;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(255, 255, 255, 0.72);
            color: rgba(51, 65, 85, 0.84);
            font-size: 0.76rem;
            line-height: 1.4;
            backdrop-filter: blur(10px);
        }

        #theme-heo .heo-booklist-hero__runtime-tag--brand {
            color: #2563eb;
            background: rgba(239, 246, 255, 0.88);
            border-color: rgba(59, 130, 246, 0.18);
        }

        #theme-heo .heo-booklist-hero__runtime-tag--success {
            color: #047857;
            background: rgba(236, 253, 245, 0.88);
            border-color: rgba(16, 185, 129, 0.18);
        }

        #theme-heo .heo-booklist-hero__intro-note {
            color: rgba(71, 85, 105, 0.88);
        }

        #theme-heo .heo-booklist-hero__stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.7rem;
            margin-top: 0;
        }

        #theme-heo .heo-booklist-hero__stat {
            display: flex;
            flex-direction: column;
            gap: 0.18rem;
            padding: 0.8rem 0.85rem;
            border-radius: 1.05rem;
            background: rgba(248, 250, 252, 0.92);
            border: 1px solid rgba(148, 163, 184, 0.16);
        }

        #theme-heo .heo-booklist-hero__stat-value {
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-booklist-hero__stat-label,
        #theme-heo .heo-booklist-section__count,
        #theme-heo .heo-booklist-featured__meta,
        #theme-heo .heo-booklist-empty__text {
            font-size: 0.8rem;
            color: rgba(71, 85, 105, 0.8);
        }

        #theme-heo .heo-booklist-hero__highlights {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.7rem;
            min-width: 0;
        }

        #theme-heo .heo-booklist-hero__highlight {
            display: flex;
            flex-direction: column;
            gap: 0.28rem;
            justify-content: space-between;
            min-height: 4.8rem;
            padding: 0.85rem 0.9rem;
            border-radius: 1.05rem;
            border: 1px solid rgba(148, 163, 184, 0.16);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92));
        }

        #theme-heo .heo-booklist-hero__highlight-name {
            font-size: 0.96rem;
            font-weight: 800;
            color: var(--heo-card-title);
        }

        #theme-heo .heo-booklist-hero__highlight-meta,
        #theme-heo .heo-booklist-nav__summary,
        #theme-heo .heo-booklist-nav__chip-count {
            font-size: 0.78rem;
            color: rgba(71, 85, 105, 0.76);
        }

        #theme-heo .heo-booklist-section__head {
            position: relative;
            padding-right: 11rem;
            min-height: 4.8rem;
        }

        #theme-heo .heo-booklist-section__meta {
            position: absolute;
            top: 0;
            right: 0;
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }

        #theme-heo .heo-booklist-section__count,
        #theme-heo .heo-booklist-section__anchor {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2rem;
            padding: 0.4rem 0.78rem;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(248, 250, 252, 0.92);
            line-height: 1;
            white-space: nowrap;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
        }

        #theme-heo .heo-booklist-section__count {
            color: rgba(71, 85, 105, 0.88);
            font-weight: 700;
        }

        #theme-heo .heo-booklist-section__anchor {
            color: rgba(51, 65, 85, 0.92);
            font-weight: 700;
        }

        #theme-heo .heo-booklist-nav__header {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 0.8rem;
            margin-bottom: 0.85rem;
        }

        #theme-heo .heo-booklist-nav__chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
        }

        #theme-heo .heo-booklist-nav__chip,
        #theme-heo .heo-booklist-card__tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            padding: 0.42rem 0.8rem;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(248, 250, 252, 0.92);
            color: rgba(51, 65, 85, 0.88);
            font-size: 0.8rem;
            transition: all var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo .heo-booklist-nav__chip:hover {
            transform: translateY(-1px);
            border-color: rgba(59, 130, 246, 0.28);
            color: #1d4ed8;
        }

        #theme-heo .heo-booklist-nav__chip.is-active {
            border-color: rgba(59, 130, 246, 0.3);
            background: linear-gradient(180deg, rgba(239, 246, 255, 0.96), rgba(219, 234, 254, 0.92));
            color: #1d4ed8;
            box-shadow: 0 12px 24px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.92);
        }

        #theme-heo .heo-booklist-nav__chip.is-active .heo-booklist-nav__chip-count {
            color: inherit;
            font-weight: 800;
        }

        #theme-heo .heo-booklist-featured__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 0.85rem;
        }

        #theme-heo .heo-booklist-featured__item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem 1.05rem;
            border-radius: 1.4rem;
            border: 1px solid rgba(148, 163, 184, 0.16);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92));
        }

        #theme-heo .heo-booklist-featured__eyebrow {
            display: inline-flex;
            align-items: center;
            width: fit-content;
            min-height: 1.7rem;
            padding: 0.2rem 0.58rem;
            border-radius: 999px;
            background: rgba(245, 158, 11, 0.1);
            color: rgba(180, 83, 9, 0.96);
            border: 1px solid rgba(245, 158, 11, 0.16);
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            line-height: 1;
            text-transform: uppercase;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
        }

        #theme-heo .heo-booklist-featured__name,
        #theme-heo .heo-booklist-card__title {
            font-size: 1rem;
            font-weight: 800;
            line-height: 1.4;
            color: var(--heo-card-title);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-booklist-featured__desc,
        #theme-heo .heo-booklist-card__summary {
            font-size: 0.9rem;
            line-height: 1.75;
            color: rgba(71, 85, 105, 0.86);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        #theme-heo .heo-booklist-featured__desc {
            -webkit-line-clamp: 3;
        }

        #theme-heo .heo-booklist-featured__footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            margin-top: auto;
            padding-top: 0.3rem;
        }

        #theme-heo .heo-booklist-featured__cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2rem;
            padding: 0.38rem 0.78rem;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.16);
            background: rgba(248, 250, 252, 0.94);
            color: rgba(51, 65, 85, 0.92);
            font-size: 0.8rem;
            font-weight: 700;
            line-height: 1;
            white-space: nowrap;
        }

        #theme-heo .heo-booklist-section-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #theme-heo .heo-booklist-section__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 1rem;
        }

        #theme-heo .heo-booklist-card {
            display: grid;
            grid-template-columns: 5.5rem minmax(0, 1fr);
            gap: 0.9rem;
            align-items: stretch;
            min-height: 10.4rem;
            padding: 0.95rem;
            border-radius: 1.35rem;
            border: 1px solid rgba(148, 163, 184, 0.14);
            background: rgba(255, 255, 255, 0.88);
        }

        #theme-heo .heo-booklist-card__cover-wrap {
            position: relative;
            width: 5.5rem;
            min-height: 7.7rem;
            overflow: hidden;
            border-radius: 1rem;
            background: rgba(226, 232, 240, 0.5);
        }

        #theme-heo .heo-booklist-card__cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        #theme-heo .heo-booklist-card__mobile-title {
            display: none;
        }

        #theme-heo .heo-booklist-card__progress-badge {
            position: absolute;
            top: 0.42rem;
            right: 0.42rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 1.2rem;
            padding: 0.16rem 0.38rem;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.74);
            color: #fff;
            font-size: 0.62rem;
            line-height: 1;
            font-weight: 700;
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
        }

        #theme-heo .heo-booklist-card__meta {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            justify-content: flex-start;
        }

        #theme-heo .heo-booklist-card__title {
            min-height: calc(1.4em * 2);
        }

        #theme-heo .heo-booklist-card__author {
            font-size: 0.86rem;
            color: rgba(59, 130, 246, 0.78);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #theme-heo .heo-booklist-card__summary {
            -webkit-line-clamp: 2;
            min-height: calc(1.75em * 2);
        }

        #theme-heo .heo-booklist-card__footer {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-top: auto;
            padding-top: 0.25rem;
        }

        html.dark #theme-heo .heo-booklist-hero,
        html.dark #theme-heo .heo-booklist-nav,
        html.dark #theme-heo .heo-booklist-section,
        html.dark #theme-heo .heo-booklist-empty,
        html.dark #theme-heo .heo-booklist-featured__item,
        html.dark #theme-heo .heo-booklist-card,
        html.dark #theme-heo .heo-booklist-hero__highlight {
            background: linear-gradient(180deg, rgba(24, 26, 33, 0.95), rgba(17, 24, 39, 0.92));
            border-color: rgba(148, 163, 184, 0.16);
        }

        html.dark #theme-heo .heo-booklist-hero__badge,
        html.dark #theme-heo .heo-booklist-hero__stat,
        html.dark #theme-heo .heo-booklist-nav__chip,
        html.dark #theme-heo .heo-booklist-card__tag,
        html.dark #theme-heo .heo-booklist-section__count,
        html.dark #theme-heo .heo-booklist-section__anchor,
        html.dark #theme-heo .heo-booklist-featured__cta,
        html.dark #theme-heo .heo-booklist-hero__intro-note {
            background: rgba(30, 41, 59, 0.7);
            border-color: rgba(148, 163, 184, 0.16);
            color: rgba(226, 232, 240, 0.84);
        }

        html.dark #theme-heo .heo-booklist-hero__runtime-tag {
            background: rgba(30, 41, 59, 0.7);
            border-color: rgba(148, 163, 184, 0.16);
            color: rgba(226, 232, 240, 0.84);
        }

        html.dark #theme-heo .heo-booklist-hero__runtime-tag--brand {
            color: #bfdbfe;
            background: rgba(30, 64, 175, 0.22);
            border-color: rgba(96, 165, 250, 0.22);
        }

        html.dark #theme-heo .heo-booklist-hero__runtime-tag--success {
            color: #a7f3d0;
            background: rgba(6, 78, 59, 0.3);
            border-color: rgba(16, 185, 129, 0.2);
        }

        html.dark #theme-heo .heo-booklist-hero__runtime-tag--warm {
            color: #fcd34d;
            background: rgba(120, 53, 15, 0.26);
            border-color: rgba(245, 158, 11, 0.2);
        }
        html.dark #theme-heo .heo-booklist-hero__title,
        html.dark #theme-heo .heo-booklist-featured__name,
        html.dark #theme-heo .heo-booklist-card__title,
        html.dark #theme-heo .heo-booklist-hero__highlight-name,
        html.dark #theme-heo .heo-booklist-hero__stat-value {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-booklist-hero__subtitle,
        html.dark #theme-heo .heo-booklist-hero__description,
        html.dark #theme-heo .heo-booklist-featured__desc,
        html.dark #theme-heo .heo-booklist-card__summary,
        html.dark #theme-heo .heo-booklist-hero__stat-label,
        html.dark #theme-heo .heo-booklist-section__count,
        html.dark #theme-heo .heo-booklist-featured__meta,
        html.dark #theme-heo .heo-booklist-empty__text,
        html.dark #theme-heo .heo-booklist-hero__highlight-meta,
        html.dark #theme-heo .heo-booklist-nav__summary,
        html.dark #theme-heo .heo-booklist-nav__chip-count,
        html.dark #theme-heo .heo-booklist-nav__summary-text,
        html.dark #theme-heo .heo-booklist-card__mobile-title,
        html.dark #theme-heo .heo-booklist-scroll-hint {
            color: rgba(226, 232, 240, 0.86);
        }

        html.dark #theme-heo .heo-booklist-nav__summary-value,
        html.dark #theme-heo .heo-booklist-section__anchor,
        html.dark #theme-heo .heo-booklist-section .heo-about-section-heading__title,
        html.dark #theme-heo .heo-booklist-nav .heo-about-section-heading__title,
        html.dark #theme-heo .heo-booklist-featured__cta {
            color: var(--heo-card-title-dark);
        }

        html.dark #theme-heo .heo-booklist-featured__eyebrow {
            color: #fbbf24;
            background: rgba(120, 53, 15, 0.28);
            border-color: rgba(245, 158, 11, 0.24);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }


        html.dark #theme-heo .heo-booklist-nav__chip.is-active {
            border-color: rgba(245, 158, 11, 0.24);
            background: linear-gradient(180deg, rgba(120, 53, 15, 0.26), rgba(92, 33, 4, 0.2));
            color: #fde68a;
            box-shadow: 0 12px 24px rgba(120, 53, 15, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }


        @media (max-width: 767px) {
            #theme-heo .heo-booklist-scroll-hint {
                display: inline-flex;
            }

            #theme-heo .heo-booklist-hero__grid {
                grid-template-columns: minmax(0, 1fr);
                gap: 0.85rem;
            }

            #theme-heo .heo-booklist-hero__intro,
            #theme-heo .heo-booklist-hero__aside {
                min-width: 0;
            }

            #theme-heo .heo-booklist-hero__stats {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.55rem;
            }

            #theme-heo .heo-booklist-hero__stat {
                padding: 0.72rem 0.68rem;
            }

            #theme-heo .heo-booklist-hero__stat-value {
                font-size: 1.15rem;
            }

            #theme-heo .heo-booklist-hero__stat-label {
                font-size: 0.74rem;
                line-height: 1.35;
            }

            #theme-heo .heo-booklist-hero__highlights,
            #theme-heo .heo-booklist-featured__grid {
                display: grid;
                grid-auto-flow: column;
                grid-template-columns: none;
                overflow-x: auto;
                overscroll-behavior-x: contain;
                scrollbar-width: thin;
                -webkit-overflow-scrolling: touch;
                align-items: stretch;
            }

            #theme-heo .heo-booklist-hero__highlights {
                grid-auto-columns: minmax(8.5rem, 72%);
                gap: 0.55rem;
                padding: 0 0.12rem 0.2rem;
            }

            #theme-heo .heo-booklist-featured__grid {
                grid-auto-columns: minmax(15.5rem, 86%);
                gap: 0.75rem;
                overflow-y: visible;
                padding: 0 0.12rem 0.2rem;
            }

            #theme-heo .heo-booklist-section__head {
                padding-right: 0;
                padding-top: 0;
                min-height: 0;
            }

            #theme-heo .heo-booklist-section__meta {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                display: inline-flex;
                margin-top: 0;
                gap: 0.4rem;
                justify-content: flex-end;
                flex-wrap: nowrap;
            }

            #theme-heo .heo-booklist-section__count,
            #theme-heo .heo-booklist-section__anchor {
                min-height: 1.9rem;
                padding: 0.34rem 0.68rem;
                box-shadow: none;
            }

            #theme-heo .heo-booklist-section__grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 1rem 0.8rem;
                padding-bottom: 0;
                overflow: visible;
            }

            #theme-heo .heo-booklist-card {
                display: flex;
                flex-direction: column;
                gap: 0.48rem;
                padding: 0;
                border: 0;
                background: transparent;
                border-radius: 0;
                box-shadow: none;
                min-width: 0;
            }

            #theme-heo .heo-booklist-card::after,
            #theme-heo .heo-booklist-card__meta,
            #theme-heo .heo-booklist-card__topline,
            #theme-heo .heo-booklist-card__title,
            #theme-heo .heo-booklist-card__author,
            #theme-heo .heo-booklist-card__summary,
            #theme-heo .heo-booklist-card__footer,
            #theme-heo .heo-booklist-card__cta {
                display: none;
            }

            #theme-heo .heo-booklist-card__cover-wrap {
                position: relative;
                width: 100%;
                min-height: auto;
                aspect-ratio: 0.76;
                border-radius: 1rem;
                overflow: hidden;
                background: rgba(226, 232, 240, 0.45);
                box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
            }

            #theme-heo .heo-booklist-card__cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            #theme-heo .heo-booklist-card__mobile-title {
                display: -webkit-box;
                font-size: 0.94rem;
                line-height: 1.42;
                font-weight: 700;
                color: var(--heo-card-title);
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                white-space: normal;
                min-height: calc(1.42em * 2);
            }

            #theme-heo .heo-booklist-card__progress-badge {
                position: absolute;
                top: 0.42rem;
                right: 0.42rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 1.2rem;
                padding: 0.16rem 0.38rem;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.74);
                color: #fff;
                font-size: 0.62rem;
                line-height: 1;
                font-weight: 700;
                backdrop-filter: blur(8px);
            }
        }

        @media (max-width: 420px) {
            #theme-heo .heo-booklist-hero__stats {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            #theme-heo .heo-booklist-hero__highlights {
                grid-auto-columns: minmax(8rem, 82%);
            }

            #theme-heo .heo-booklist-featured__grid {
                grid-auto-columns: minmax(14.5rem, 92%);
            }

            #theme-heo .heo-booklist-section__grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 0.9rem 0.65rem;
            }

            #theme-heo .heo-booklist-card__mobile-title {
                font-size: 0.86rem;
            }

            #theme-heo .heo-booklist-card__progress-badge {
                font-size: 0.58rem;
                min-height: 1.08rem;
                padding: 0.14rem 0.32rem;
            }
        }

    `}</style>
  )
}

export { Style }
