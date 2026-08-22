# Changelog

All notable changes to the documentation template and skills. Keep a Changelog format; semantic versioning: major - breaking contract changes, minor - new rules/files/skills, patch - wording and fixes.

## [1.4.0] - 2026-08-22

### Added

- Skill `docs-init`: agent-driven package installation for clean projects - installation state detection, runner question (npx/bunx/pnpm dlx), git-clone fallback without node, Windows `--copy` symlink fallback, verification of all six skills, handoff to first-run without duplicate questions
- README "Install via Your Agent" section with a copy-paste prompt for users
- Pinned-version install example via tag tree URL in README

### Documented

- Install semantics: CLI installs a snapshot of default branch at run time; updates via `npx skills update`; version pinning only through tag tree URLs

## [1.3.0] - 2026-08-22

### Added

- Clarification rule: the agent must restate its interpretation and ask before implementing when the goal, boundaries, or expected outcome are unclear (AGENT_PROMPT section 4, AGENTS.md key rules, CHECKLIST item)
- "Initialize .docs in Your Project" guide in README: both install paths, first-run steps, resulting file tree

### Changed

- Canonical template language switched from Russian to English: all `.docs/` templates, AGENTS.md, first-run.md translated
- Initialization Question 1 reworded: now controls the language of generated docs and agent communication; non-English choices are translated at generation time (deslop RU word tags stay bilingual by design)
- Russian v1.2 archived as git tag `v1.2-ru`
- examples/mini-project intentionally kept in Russian as a live demonstration of translate-at-init

## [1.1.0] - 2026-08-22

### Added

- Обязательная проверка MCP-инструментов в начале сессии (AGENT_PROMPT, CHECKLIST, AGENTS.md)
- Стек-адаптивные правила потока данных: query-библиотека или фоновые задачи, фиксируются при инициализации
- Типизация по языку: варианты TS / Rust / Python / Go в DEVELOPMENT.md
- Опциональный `product-spec.md` - источник истины по составу фич (паттерн hpClean)
- Вопрос инициализации N5 про продуктовый спек в first-run
- Скилл `docs-refactor` - приведение проекта к правилам его собственных `.docs/`
- Скилл `docs-onboard` - подключение нового агента к проекту с готовыми доками
- Скрипты синхронизации `scripts/sync-templates.ps1` / `.sh` с hash-верификацией
- CI workflow `.github/workflows/docs-check.yml`: тире, frontmatter скиллов, свежесть templates
- Pre-commit hook `scripts/pre-commit`: тире + any + нейминг компонентов
- Пример заполненных доков `examples/mini-project/`
- LICENSE (Unlicense) и версии скиллов во frontmatter

### Changed

- Канон скиллов перенесён из `.docs/skills/` в корневой `skills/` ради совместимости с `npx skills add`; дистрибуция не изменилась - копирование в целевой проект
- first-run.md переписан единым flow: MCP-проверка, 5 вопросов, установка скиллов, пресеты DESIGN, health check, глубокий анализ или новый проект
- Health check переведён на фактические счётчики top-level секций: AGENT_PROMPT 12, DEVELOPMENT 13, DESIGN 7, CHECKLIST 5, REVIEWER 9

## [1.0.0] - 2026-08-22

### Added

- Лестница ponytail (режим full) секцией в AGENT_PROMPT; пункты в CHECKLIST
- Режим grill в протокол вопросов AGENT_PROMPT
- Deslop каталог: словарные теги EN/RU, структурные паттерны, сохранение голоса, self-check (DEVELOPMENT.md + скилл `deslop` из 10 upstream источников)
- Дизайн-пресеты DESIGN.md: скандинавский (дефолт), нео-брутализм, Zed dark
- Вопросы инициализации: язык проекта, пакетный менеджер (Bun recommended), линт-пресет (ultracite+oxc recommended), дизайн-пресет
- Опциональные шаблоны ROADMAP.md и answers/
- ASCII-пунктуация приведена к собственному правилу во всех файлах (em/en dash -> дефис); vendor scandinavian-design хранится verbatim
