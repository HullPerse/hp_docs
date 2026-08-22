# Changelog

Все заметные изменения шаблона документации и скиллов. Формат - Keep a Changelog, версии семантические: мажор - ломающие изменения контракта, минор - новые правила/файлы/скиллы, патч - формулировки и фиксы.

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
