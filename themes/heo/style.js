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
            --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 4.9rem);
            --heo-post-header-bottom: clamp(2.25rem, 7vw, 3rem);
        }

        #theme-heo #post-bg .min-h-inherit {
            min-height: inherit;
        }

        #theme-heo #post-bg-content {
            min-height: inherit;
            align-items: flex-end;
            padding-top: var(--heo-post-header-offset);
            padding-bottom: var(--heo-post-header-bottom);
        }

        #theme-heo #post-info {
            border-color: rgba(255, 255, 255, 0.16) !important;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08)) !important;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.12);
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
                --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 7rem);
                --heo-post-header-bottom: 3.5rem;
            }
        }

        html.dark #theme-heo #post-info {
            border-color: rgba(255, 255, 255, 0.1) !important;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.32), rgba(15, 23, 42, 0.2)) !important;
            box-shadow: 0 26px 86px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        @media (max-width: 767px) {
            #theme-heo #post-bg {
                min-height: clamp(22rem, 100svh - 0.5rem, 30rem) !important;
                --heo-post-header-offset: calc(env(safe-area-inset-top, 0px) + 4rem);
                --heo-post-header-bottom: clamp(1.6rem, 6vw, 2.2rem);
            }

            #theme-heo #post-bg-content {
                padding-top: var(--heo-post-header-offset);
                padding-bottom: var(--heo-post-header-bottom);
            }

            #theme-heo #post-info {
                border-radius: 1.5rem !important;
                padding: 1.1rem !important;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)) !important;
            }

            html.dark #theme-heo #post-info {
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.28), rgba(15, 23, 42, 0.18)) !important;
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

        #theme-heo .heo-toc-drawer__overlay {
            background: rgba(15, 23, 42, 0.18);
            -webkit-backdrop-filter: blur(2px);
            backdrop-filter: blur(2px);
        }

        #theme-heo .heo-toc-drawer__panel {
            border: 1px solid rgba(226, 232, 240, 0.92);
            border-radius: 1.75rem;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 24px 64px rgba(15, 23, 42, 0.16);
            -webkit-backdrop-filter: saturate(180%) blur(18px);
            backdrop-filter: saturate(180%) blur(18px);
        }

        #theme-heo .heo-toc-drawer__header {
            padding: 0.95rem 1rem 0.9rem;
            border-bottom: 1px solid rgba(226, 232, 240, 0.88);
            background: rgba(255, 255, 255, 0.96);
        }

        #theme-heo .heo-toc-drawer__eyebrow {
            color: #94a3b8;
            font-size: 0.68rem;
            font-weight: 700;
            letter-spacing: 0.24em;
            text-transform: uppercase;
        }

        #theme-heo .heo-toc-drawer__title {
            margin-top: 0.28rem;
            color: #334155;
            font-size: 0.95rem;
            font-weight: 700;
        }

        #theme-heo .heo-toc-drawer__close {
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

        #theme-heo .heo-toc-drawer__content {
            max-height: min(58vh, 28rem);
            overflow-y: auto;
            padding: 0.5rem;
        }

        #theme-heo .heo-toc-drawer__content-card {
            border: 1px solid rgba(226, 232, 240, 0.88);
            border-radius: 1.35rem;
            background: #ffffff;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
            padding: 0.25rem;
        }

        @media (hover: hover) {
            #theme-heo .heo-toc-drawer__close:hover {
                transform: translateY(-1px);
                border-color: rgba(191, 219, 254, 0.78);
                background: rgba(248, 250, 252, 0.95);
                color: #334155;
                box-shadow: 0 10px 20px rgba(59, 130, 246, 0.08);
            }
        }

        #theme-heo .heo-toc-drawer__close:focus-visible {
            outline: none;
            border-color: rgba(59, 130, 246, 0.72);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16), 0 10px 20px rgba(59, 130, 246, 0.08);
        }

        html.dark #theme-heo .heo-toc-drawer__overlay {
            background: rgba(0, 0, 0, 0.55);
            -webkit-backdrop-filter: blur(6px);
            backdrop-filter: blur(6px);
        }

        html.dark #theme-heo .heo-toc-drawer__panel {
            border-color: rgba(71, 85, 105, 0.4);
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.92));
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.34);
        }

        html.dark #theme-heo .heo-toc-drawer__header {
            border-color: rgba(71, 85, 105, 0.3);
            background: rgba(15, 23, 42, 0.92);
        }

        html.dark #theme-heo .heo-toc-drawer__title {
            color: #f8fafc;
        }

        html.dark #theme-heo .heo-toc-drawer__close {
            border-color: rgba(71, 85, 105, 0.4);
            background: rgba(51, 65, 85, 0.92);
            color: #cbd5e1;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
        }

        html.dark #theme-heo .heo-toc-drawer__content-card {
            border-color: rgba(71, 85, 105, 0.24);
            background: rgba(30, 41, 59, 0.32);
            box-shadow: none;
        }

        @media (hover: hover) {
            html.dark #theme-heo .heo-toc-drawer__close:hover {
                border-color: rgba(245, 158, 11, 0.24);
                background: rgba(71, 85, 105, 0.96);
                color: #fde68a;
                box-shadow: 0 10px 24px rgba(120, 53, 15, 0.18);
            }
        }

        html.dark #theme-heo .heo-toc-drawer__close:focus-visible {
            border-color: rgba(245, 158, 11, 0.28);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 10px 24px rgba(120, 53, 15, 0.18);
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
            border-right: 1px solid rgba(203, 213, 225, 0.9);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
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
                border-right: none;
                border-bottom: 1px solid rgba(203, 213, 225, 0.9);
            }

            html.dark #theme-heo .heo-post-card__cover {
                border-bottom-color: rgba(71, 85, 105, 0.72);
            }
        }

        body {
            background-color: #f7f9fe;
            background-image: radial-gradient(rgba(60, 132, 246, 0.03) 1px, transparent 0);
            background-size: 24px 24px;
        }

        html.dark body {
            background-color: #0f1115;
            background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0);
            background-size: 24px 24px;
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

        #theme-heo .heo-today-card__more-label {
            color: inherit;
            font-weight: 600;
            letter-spacing: 0.01em;
        }

        @media (max-width: 1279px) {
            #theme-heo .heo-hero-menu-grid {
                gap: 0.55rem;
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

        #theme-heo #article-wrapper,
        #theme-heo #article-wrapper #notion-article {
            font-size: var(--heo-article-font-size);
            line-height: var(--heo-article-line-height);
            color: var(--heo-text);
            letter-spacing: 0.01em;
        }

        #theme-heo #article-wrapper #notion-article p {
            margin: 0 0 var(--heo-article-paragraph-gap);
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
            font-size: 0.85em; /* 圆点小一点更精致 */
        }

        /* 链接与下划线优化：去网页化，更像 Apple 设计 */
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

        /* 统一普通 ul/ol 的样式，保持一致性 */
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

        #theme-heo #article-wrapper #notion-article blockquote {
            margin: 0 0 var(--heo-article-block-gap);
            padding: 0.8rem 1.2rem 0.8rem 1.4rem;
            border-left: 4px solid #6366f1;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(99, 102, 241, 0.01) 100%);
            border-radius: 0 12px 12px 0;
            color: var(--heo-text-secondary);
            position: relative;
            transition: all 0.2s ease;
        }

        #theme-heo #article-wrapper #notion-article blockquote::before {
            content: '"';
            position: absolute;
            left: 0.8rem;
            top: 0.6rem;
            font-size: 2rem;
            line-height: 1;
            color: rgba(99, 102, 241, 0.15);
            font-family: Georgia, serif;
            font-weight: 700;
        }

        #theme-heo #article-wrapper #notion-article blockquote:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%);
            transform: translateX(4px);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote {
            border-left-color: #f59e0b;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.02) 100%);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote::before {
            color: rgba(245, 158, 11, 0.2);
        }

        html.dark #theme-heo #article-wrapper #notion-article blockquote:hover {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.04) 100%);
        }


        #theme-heo #article-wrapper #notion-article code {
            font-family: var(--heo-font-mono);
            font-size: 0.92em;
        }


        /* Article Images (B-Plan: Apple-style frame) */
        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image {
            margin: 0.9rem auto !important;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
            transition: transform var(--heo-dur) var(--heo-ease),
            box-shadow var(--heo-dur) var(--heo-ease);
            max-width: 100% !important;
            min-width: 0 !important;
            width: auto !important;
            display: block;
        }

        #theme-heo #article-wrapper #notion-article .notion-row {
            gap: 0.75rem;
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
            border-radius: 10px;
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
            border-radius: 10px !important;
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
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image img {
            border-radius: 12px !important;
            display: block;
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image {
            border-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Image Caption (Apple-style minimal) */
        #theme-heo #article-wrapper #notion-article .notion-asset-caption {
            margin-top: 0.75rem !important;
            padding: 0 1rem;
            font-size: 0.85rem !important;
            line-height: 1.5;
            color: var(--heo-text-tertiary) !important;
            text-align: center !important;
            font-style: normal !important;
        }

        #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        html.dark #theme-heo #article-wrapper #notion-article .notion-asset-wrapper-image:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2);
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

        /* CategoryBar 容器：磨砂玻璃质感与圆角 */
        #theme-heo #category-bar {
            background: rgba(255, 255, 255, 0.6) !important;
            -webkit-backdrop-filter: saturate(210%) blur(24px);
            backdrop-filter: saturate(210%) blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            border-radius: 24px !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 26px rgba(0, 0, 0, 0.06);
            transition: all var(--heo-dur) var(--heo-ease);
        }

        html.dark #theme-heo #category-bar {
            background: rgba(27, 28, 32, 0.5) !important;
            -webkit-backdrop-filter: saturate(170%) blur(26px);
            backdrop-filter: saturate(170%) blur(26px);
            border-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.35);
        }

        /* 分类项：同步发光胶囊样式 */
        #theme-heo #category-bar .category-bar-item {
            border-radius: 16px !important;
            transition: all 0.25s var(--heo-ease) !important;
            padding: 4px 12px !important;
            margin: 0 4px !important;
        }

        #theme-heo #category-bar .category-bar-item:hover,
        #theme-heo #category-bar .category-bar-item.selected {
            background: rgba(37, 99, 235, 0.1) !important;
            border: 1px solid rgba(191, 219, 254, 0.76) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 16px rgba(37, 99, 235, 0.07) !important;
            color: #2563eb !important;
            transform: translateY(-1px);
        }

        html.dark #theme-heo #category-bar .category-bar-item:hover,
        html.dark #theme-heo #category-bar .category-bar-item.selected {
            background: rgba(245, 158, 11, 0.1) !important;
            border: 1px solid rgba(245, 158, 11, 0.18) !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 6px 16px rgba(120, 53, 15, 0.12) !important;
            color: #facc15 !important;
            transform: translateY(-1px);
        }

        /* 侧边栏文章列表项（最新发布/随机文章等）聚焦效果适配真实 DOM */
        #theme-heo #sideRight a.my-3.flex {
            padding: 8px !important;
            margin-top: 4px !important;
            margin-bottom: 4px !important;
            border-radius: 16px !important;
            transition: all 0.25s var(--heo-ease) !important;
            text-decoration: none !important;
        }

        /* 亮色模式悬停 */
        #theme-heo #sideRight a.my-3.flex:hover {
            background: rgba(37, 99, 235, 1) !important;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4),
            0 0 0 1px rgba(37, 99, 235, 0.1);
            transform: translateY(-1px);
        }

        /* 亮色模式文字反色 */
        #theme-heo #sideRight a.my-3.flex:hover .text-sm,
        #theme-heo #sideRight a.my-3.flex:hover .text-gray-400,
        #theme-heo #sideRight a.my-3.flex:hover .menu-link {
            color: #ffffff !important;
        }

        /* 暗色模式悬停 */
        html.dark #theme-heo #sideRight a.my-3.flex:hover {
            background: rgba(234, 179, 8, 1) !important;
            box-shadow: 0 8px 20px rgba(234, 179, 8, 0.5),
            0 0 0 1px rgba(234, 179, 8, 0.2);
            transform: translateY(-1px);
        }

        /* 暗色模式文字反色 */
        html.dark #theme-heo #sideRight a.my-3.flex:hover .text-sm,
        html.dark #theme-heo #sideRight a.my-3.flex:hover .text-gray-400,
        html.dark #theme-heo #sideRight a.my-3.flex:hover .menu-link {
            color: #000000 !important;
        }

        /* 缩略图圆角微调 */
        #theme-heo #sideRight a.my-3.flex:hover img {
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* 文章页目录（Catalog / TOC）适配 Heo Pro 风格 - 修正版 */
        /* 1. 容器样式 (确保背景只在最外层，移除内层背景) */
        #theme-heo #sideRight .px-3.py-1.dark\:text-white.text-black {
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
        }

        /* 2. 目录项（链接）基础样式与动画 */
        #theme-heo .notion-table-of-contents-item.catalog-item {
            border-radius: 8px !important;
            margin: 3px 4px !important;
            padding: 7px 10px !important;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            display: block !important;
            text-decoration: none !important;
            width: calc(100% - 8px) !important; /* 填满容器宽度 */
            max-width: none !important;
            opacity: 0.55 !important; /* 非聚焦项淡化 */
        }

        /* 3. 亮色模式：当前选中项 (Active) 与 Hover */
        #theme-heo .notion-table-of-contents-item.catalog-item:hover,
        #theme-heo .notion-table-of-contents-item.catalog-item a span.font-bold.text-indigo-600,
        #theme-heo .notion-table-of-contents-item.catalog-item:has(span.font-bold.text-indigo-600) {
            background: rgba(37, 99, 235, 0.9) !important;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25) !important;
            transform: none !important; /* 移除位移 */
            opacity: 1 !important; /* 聚焦项清晰 */
            filter: none !important; /* 移除模糊 */
        }

        #theme-heo .notion-table-of-contents-item.catalog-item:hover span,
        #theme-heo .notion-table-of-contents-item.catalog-item span.font-bold.text-indigo-600 {
            color: #ffffff !important;
            font-weight: 500 !important;
        }

        /* 4. 暗色模式：当前选中项 (Active) 与 Hover */
        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:hover,
        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:has(span.font-bold.text-indigo-600) {
            background: rgba(234, 179, 8, 0.95) !important;
            box-shadow: 0 2px 8px rgba(234, 179, 8, 0.35) !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
        }

        html.dark #theme-heo .notion-table-of-contents-item.catalog-item:hover span,
        html.dark #theme-heo .notion-table-of-contents-item.catalog-item span.font-bold.text-indigo-600 {
            color: #000000 !important;
            font-weight: 500 !important;
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

        #theme-heo #sideRight .heo-mini-post-card {
            border-color: rgba(203, 213, 225, 0.92);
            background: rgba(255, 255, 255, 0.62);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }

        #theme-heo #sideRight .heo-mini-post-card__title {
            color: #1e293b;
            transition: color var(--heo-dur-fast) var(--heo-ease);
        }

        #theme-heo #sideRight .heo-mini-post-card__date {
            color: #94a3b8;
        }

        #theme-heo #sideRight .heo-mini-post-card.is-active {
            border-color: rgba(148, 163, 184, 0.96);
            background: rgba(239, 246, 255, 0.9);
            box-shadow: 0 14px 28px rgba(59, 130, 246, 0.08);
        }

        #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__title {
            color: #4f46e5;
        }

        @media (hover: hover) {
            #theme-heo #sideRight .heo-mini-post-card:hover {
                transform: translateY(-2px);
                border-color: rgba(148, 163, 184, 0.92);
                background: rgba(248, 250, 252, 0.92);
                box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
            }

            #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__title {
                color: #334155;
            }
        }

        #theme-heo #sideRight .heo-mini-post-card:focus-visible {
            outline: none;
            transform: translateY(-2px);
            border-color: rgba(191, 219, 254, 0.88);
            background: rgba(248, 250, 252, 0.96);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.18), 0 12px 26px rgba(15, 23, 42, 0.08);
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__title {
            font-size: 1.7rem;
            font-weight: 900;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__cta {
            font-size: 1.15rem;
            font-weight: 800;
        }

        #theme-heo #sideRight .heo-touch-card .heo-touch-card__arrow {
            width: 2rem;
            height: 2rem;
            border-radius: 999px;
            background: rgba(79, 101, 240, 0.08);
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card {
            border-color: rgba(100, 116, 139, 0.34);
            background: rgba(15, 23, 42, 0.16);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card__title {
            color: #e2e8f0;
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card__date {
            color: #94a3b8;
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card.is-active {
            border-color: rgba(245, 158, 11, 0.28);
            background: rgba(180, 83, 9, 0.16);
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card.is-active .heo-mini-post-card__title {
            color: #fcd34d;
        }

        @media (hover: hover) {
            html.dark #theme-heo #sideRight .heo-mini-post-card:hover {
                border-color: rgba(245, 158, 11, 0.24);
                background: rgba(154, 52, 18, 0.14);
                box-shadow: 0 12px 26px rgba(0, 0, 0, 0.14);
            }

            html.dark #theme-heo #sideRight .heo-mini-post-card:hover .heo-mini-post-card__title {
                color: #fde68a;
            }
        }

        html.dark #theme-heo #sideRight .heo-mini-post-card:focus-visible {
            border-color: rgba(245, 158, 11, 0.28);
            background: rgba(154, 52, 18, 0.16);
            box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.18), 0 12px 26px rgba(0, 0, 0, 0.14);
        }


        #theme-heo .heo-home-nav-entry-grid {
            gap: 0.75rem;
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

        html.dark #loading-box .loading-text {
            color: var(--heo-text);
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

        /* ===== macOS风格折叠框 ===== */
        #theme-heo .notion-toggle {
            margin: 12px 0 !important;
            border-radius: 8px !important;
            border: 1px solid rgba(0, 0, 0, 0.12) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            overflow: hidden !important;
            transition: all 0.3s var(--heo-ease) !important;
        }

        #theme-heo .notion-toggle[open] {
            border-color: transparent !important; /* 展开时隐藏容器边框，避免双边框 */
        }

        #theme-heo .notion-toggle > summary {
            list-style: none !important;
            cursor: pointer !important;
            padding: 14px 40px 14px 16px !important;
            background: rgba(255, 255, 255, 0.98) !important;
            border: none !important;
            border-radius: 8px 8px 0 0 !important;
            transition: all 0.2s var(--heo-ease) !important;
            position: relative !important;
            font-weight: 500 !important;
            color: var(--heo-text) !important;
            display: block !important;
        }

        #theme-heo .notion-toggle[open] > summary {
            background: rgba(173, 216, 230, 0.15) !important; /* 极浅蓝色背景 */
            border: 1px solid rgba(100, 149, 237, 0.3) !important; /* 浅蓝色描边 */
            border-bottom: 1px solid rgba(100, 149, 237, 0.3) !important; /* 保持底部边框 */
            border-radius: 8px 8px 0 0 !important;
            margin: 0 !important; /* 移除补偿，因为容器边框已透明 */
        }

        #theme-heo .notion-toggle > summary::-webkit-details-marker {
            display: none !important;
        }

        #theme-heo .notion-toggle > summary::after {
            content: '▸' !important;
            font-size: 0.9em !important;
            color: var(--heo-text-tertiary) !important;
            transition: transform 0.3s var(--heo-ease) !important;
            margin-left: 8px !important;
            flex-shrink: 0 !important;
        }

        #theme-heo .notion-toggle[open] > summary::after {
            transform: translateY(-50%) rotate(90deg) !important;
            color: rgba(100, 149, 237, 0.8) !important; /* 浅蓝色箭头 */
        }

        #theme-heo .notion-toggle > summary:hover {
            background: rgba(0, 0, 0, 0.03) !important;
        }

        #theme-heo .notion-toggle[open] > summary:hover {
            background: rgba(173, 216, 230, 0.2) !important; /* 悬停时稍微加深 */
        }

        #theme-heo .notion-toggle > div {
            padding: 0 16px 16px 16px !important;
            border: 1px solid rgba(100, 149, 237, 0.3) !important; /* 浅蓝色描边 */
            // border-top: none !important;
            margin-top: -1px !important; /* 上移1px，使内容区域顶部边框与标题底部边框重叠 */
            margin-left: 0 !important;
            border-radius: 0 0 8px 8px !important;
            background: rgba(255, 255, 255, 0.98) !important;
            animation: slideDown 0.3s var(--heo-ease) !important;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 暗色模式 */
        html.dark #theme-heo .notion-toggle {
            border-color: rgba(255, 255, 255, 0.15) !important;
            background: rgba(27, 28, 32, 0.98) !important;
        }

        html.dark #theme-heo .notion-toggle[open] {
            border-color: transparent !important; /* 展开时隐藏容器边框 */
        }

        html.dark #theme-heo .notion-toggle > summary {
            background: rgba(27, 28, 32, 0.98) !important;
            color: var(--heo-text) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary {
            background: rgba(255, 140, 0, 0.2) !important; /* 亮橘色背景 */
            border: 1px solid rgba(255, 165, 0, 0.4) !important; /* 橘色描边 */
            border-bottom: 1px solid rgba(255, 165, 0, 0.4) !important; /* 保持底部边框 */
            border-radius: 8px 8px 0 0 !important;
            margin: 0 !important; /* 移除补偿 */
        }

        html.dark #theme-heo .notion-toggle > summary:hover {
            background: rgba(255, 255, 255, 0.05) !important;
        }

        html.dark #theme-heo .notion-toggle[open] > summary:hover {
            background: rgba(255, 140, 0, 0.25) !important; /* 悬停时稍微加深 */
        }

        html.dark #theme-heo .notion-toggle[open] > summary::after {
            transform: translateY(-50%) rotate(90deg) !important;
            color: rgba(255, 165, 0, 0.8) !important; /* 橘色箭头 */
        }

        html.dark #theme-heo .notion-toggle > div {
            border: 1px solid rgba(255, 165, 0, 0.4) !important; /* 橘色描边 */
            // border-top: none !important;
            margin-top: -1px !important; /* 上移1px，使内容区域顶部边框与标题底部边框重叠 */
            background: rgba(27, 28, 32, 0.98) !important;
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

        /* ===== 文件块按钮式外观 ===== */
        #theme-heo .notion-file-link {
            border-radius: 10px !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px) !important;
            padding: 12px 16px !important;
            margin: 8px 0 !important;
            transition: all 0.3s var(--heo-ease) !important;
            text-decoration: none !important;
            display: flex !important;
            align-items: center !important;
        }

        #theme-heo .notion-file-link:hover {
            background: rgba(37, 99, 235, 0.05) !important;
            border-color: rgba(37, 99, 235, 0.2) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1) !important;
        }

        #theme-heo .notion-file-icon {
            margin-right: 12px !important;
            color: #4f65f0 !important;
            font-size: 1.2em !important;
        }

        #theme-heo .notion-file-title {
            font-weight: 500 !important;
            color: var(--heo-text) !important;
            flex: 1 !important;
        }

        #theme-heo .notion-file-size {
            color: var(--heo-text-tertiary) !important;
            font-size: 12px !important;
            margin-left: 12px !important;
        }

        html.dark #theme-heo .notion-file-link {
            border-color: rgba(255, 255, 255, 0.12) !important;
            background: rgba(40, 40, 42, 0.8) !important;
        }

        html.dark #theme-heo .notion-file-link:hover {
            background: rgba(234, 179, 8, 0.05) !important;
            border-color: rgba(234, 179, 8, 0.2) !important;
            box-shadow: 0 4px 12px rgba(234, 179, 8, 0.1) !important;
        }

        html.dark #theme-heo .notion-file-icon {
            color: #eab308 !important;
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

        /* ===== 公式块清晰显示 ===== */
        #theme-heo .notion-equation-block {
            border-radius: 12px !important;
            background: rgba(248, 249, 250, 0.9) !important;
            backdrop-filter: blur(10px) !important;
            padding: 20px !important;
            margin: 1.5rem 0 !important;
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
            overflow: auto !important;
        }

        #theme-heo .notion-equation-inline {
            background: rgba(248, 249, 250, 0.9) !important;
            border-radius: 6px !important;
            padding: 2px 6px !important;
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
        }

        html.dark #theme-heo .notion-equation-block {
            background: rgba(30, 30, 32, 0.9) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
        }

        html.dark #theme-heo .notion-equation-inline {
            background: rgba(40, 40, 42, 0.9) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
        }

      /* ===== 内联代码微调 ===== */
        #theme-heo .notion-inline-code {
            background: linear-gradient(135deg, rgba(236, 87, 87, 0.06) 0%, rgba(236, 87, 87, 0.02) 100%) !important;
            border-radius: 6px !important;
            padding: 3px 8px !important;
            border: 1px solid rgba(236, 87, 87, 0.2) !important;
            font-family: var(--heo-font-mono) !important;
            font-size: 0.88em !important;
            color: #e11d48 !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 2px rgba(236, 87, 87, 0.1) !important;
        }

        #theme-heo .notion-inline-code:hover {
            background: rgba(236, 87, 87, 0.1) !important;
            border-color: rgba(236, 87, 87, 0.35) !important;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(236, 87, 87, 0.15) !important;
        }

        html.dark #theme-heo .notion-inline-code {
            background: linear-gradient(135deg, rgba(255, 123, 114, 0.1) 0%, rgba(255, 123, 114, 0.04) 100%) !important;
            border-color: rgba(255, 123, 114, 0.3) !important;
            color: #ffaba3 !important;
        }

        html.dark #theme-heo .notion-inline-code:hover {
            background: rgba(255, 123, 114, 0.15) !important;
            border-color: rgba(255, 123, 114, 0.5) !important;
            box-shadow: 0 2px 6px rgba(255, 123, 114, 0.2) !important;
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
            border-radius: 6px !important;
            padding: 2px 6px !important;
            margin: 0 1px !important;
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
            opacity: 0.9 !important;
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
    `}</style>

  )
}

export { Style }
