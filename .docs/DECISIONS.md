# {{PROJECT_NAME}} Decisions

User decision journal. The agent must check this file before any question and append decisions after answers, so nothing gets asked twice. Historical entries may keep their original language; new entries are written in the project language chosen at initialization.

## Entry format

```markdown
### YYYY-MM-DD: Short heading

- Decision: ...
- Context: ...
- Consequence: ...
- Source: session/task reference
```

## Entries

<!-- Appended by the agent as decisions are made -->

### 2026-08-22: Скиллы канонически живут в .docs/skills/

- Решение: canonical-копии всех скиллов хранятся в `.docs/skills/<name>/`; при инициализации они копируются в `.agents/skills/` целевого проекта для автообнаружения. Рабочие копии `.agents/skills/` этого репо синхронизируются из canonical.
- Контекст: требование "скиллы устанавливаются вместе с доками"; opencode автообнаруживает только `.agents/skills/`.
- Последствие: правки вносятся только в `.docs/skills/`, затем синхронизируются копии; README описывает модель установки.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Anti-slop сборник из 10 скиллов консолидирован в один deslop

- Решение: вместо установки десяти пересекающихся скиллов создан один внутренний скилл `.docs/skills/deslop/SKILL.md` (словарные теги EN+RU, структурные паттерны, лимиты пунктуации, сохранение голоса, self-check, скоринг).
- Контекст: все десять источников про прозу, а не про код; одновременная установка даёт шум активации и конфликты триггеров.
- Последствие: оригиналы не устанавливаются; выжимка также встроена разделом "Deslop прозы" в DEVELOPMENT.md и AGENT_PROMPT.md.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: DESIGN.md переходит на пресеты, скандинавский дефолт

- Решение: DESIGN.md содержит три пресета (скандинавский - дефолт, нео-брутализм, Zed dark) плюс правило выбора при инициализации. Пользовательский стиль переписывает секцию своего пресета, общие правила остаются. Вендорный скилл scandinavian-design установлен в `.docs/skills/` для глубокой UI-работы.
- Контекст: нужен осмысленный дефолт дизайна с переопределением пользователем; юзер выбрал вариант "пресеты + вопрос".
- Последствие: при инициализации оставляется секция выбранного пресета; DESIGN_* плейсхолдеры удалены из first-run; health check DESIGN теперь 7 секций.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Лестница ponytail встроена в правила, режим full

- Решение: AGENT_PROMPT.md получил секцию 6 "Минимальность": лестница из 7 ступеней, фикс бага у корня через grep вызывающих, запрет незапрошенных абстракций, метка `ponytail:` для осознанных потолков, зоны запрета лени (валидация, ошибки против потери данных, безопасность, a11y). CHECKLIST дополнен тремя пунктами.
- Контекст: база ponytail сочетается с существующим контрактом тестирования (не изменён) и форматом ответа (ponytail управляет кодом, не разговором).
- Последствие: секции 6-10 AGENT_PROMPT перенумерованы в 7-11; health check AGENT_PROMPT теперь 19 секций.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Режим grill встроен в протокол вопросов

- Решение: в AGENT_PROMPT.md раздел 4 добавлен подраздел "Режим grill": один вопрос за раз, рекомендованный ответ к каждому, обход дерева решений depth-first, поиск ответа в коде раньше вопроса, фиксация итогов веток, финальный вопрос про незаписанные допущения.
- Контекст: локальный скилл grill-me оказался заглушкой со ссылкой на несуществующий скилл; контент восстановлен из оригинала mattpocock/skills и адаптирован.
- Последствие: режим включается командой пользователя ("grill", "прожарь"); отдельный скилл не нужен.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Четыре вопроса инициализации в first-run

- Решение: перед заполнением шаблонов агент батчем спрашивает: язык проекта (русский recommended), пакетный менеджер (Bun recommended), линт-пресет (ultracite + oxlint/oxfmt recommended; альтернативы ultracite+biome, голый oxlint/oxfmt, eslint+prettier, ничего), дизайн-пресет (скандинавский recommended). Ответы фиксируются в DECISIONS.md и определяют команды во всех доках.
- Контекст: шаблон ранее не фиксировал менеджер и линтер; ultracite-паттерн risovach взят как канон.
- Последствие: команды в доках пишутся через выбранный менеджер; выбор линтера описывает конкретные конфиги oxlint.config.ts / oxfmt.config.ts.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Опциональные ROADMAP.md и answers/ включены в шаблон

- Решение: добавлены шаблоны `.docs/ROADMAP.md` (фазовая карта фич со статусами done/now/deferred/rejected) и `.docs/answers/README.md` (длинные исследовательские ответы).
- Контекст: оба файла реально используются в живых проектах (hpClean, risovach), но отсутствовали в шаблоне.
- Последствие: создаются опционально; решения из них дублируются в DECISIONS.md.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: ASCII-пунктуация приведена к собственному правилу

- Решение: em/en dash заменены дефисом во всех шаблонах и README репозитория. Исключение: вендорный скилл scandinavian-design хранится verbatim как внешний источник.
- Контекст: правила запрещают длинные тире, но сами шаблоны содержали их со времени создания.
- Последствие: проверка по U+2013/U+2014 чиста вне vendor-папки.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: Инцидент кодировки при массовой чистке

- Решение: зафиксирован инцидент: чистка тире через PowerShell Get-Content/Set-Content без явной кодировки испортила UTF-8 файлы (CP1251 мисдекод + потеря Ж/З/ж/з). Файлы восстановлены из git и копий templates, правки накатаны заново, финальная чистка выполнена через [IO.File]::ReadAllText/WriteAllText с явным UTF-8.
- Контекст: PS 5.1 без BOM читает UTF-8 как системную ANSI; буквы Ж/З/ж/з содержат байты 0x96/0x97, совпадающие с байтами en/em dash в CP1251.
- Последствие: правило для агентов: любые массовые правки текстовых файлов выполнять только с явно указанной кодировкой UTF-8 и верификацией содержимого после записи.
- Источник: сессия обновления шаблонов 2026-08-22.

### 2026-08-22: MCP-проверка обязательна в начале сессии

- Решение: раздел "Доступные инструменты" AGENT_PROMPT стал обязательным шагом: агент перечисляет доступные MCP-серверы, использует документационные инструменты для любых вопросов о библиотеках до ответа из памяти, применяет профильные инструменты вместо обходных путей. Пункты добавлены в CHECKLIST и AGENTS.md шаблона.
- Контекст: агенты регулярно забывают про установленные инструменты и решают задачи руками.
- Последствие: проверка инструментов входит в контракт каждой сессии во всех проектах на шаблоне.
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: Правила потока данных стек-адаптивны

- Решение: AGENT_PROMPT получил подсекцию "Правила потока данных": при query-библиотеке действуют TanStack Query правила; без неё - модель фоновых задач (UI не блокируется, подписки на события); для прочих стеков эквивалент формулируется и согласовывается. Модель фиксируется в DEVELOPMENT.md при инициализации.
- Контекст: жёсткие TanStack-правила подходили только одному типу проектов; hpClean показал паттерн GPUI/concurrency.
- Последствие: CHECKLIST ссылается на выбранную модель; типизация аналогично переведена на языковые варианты (TS/Rust/Python/Go) в новой секции DEVELOPMENT "Типизация по языку".
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: product-spec.md как опциональный источник истины фич

- Решение: добавлен опциональный шаблон `product-spec.md` в корень проекта (паттерн hpClean): состав фич живёт отдельно от .docs/features; вопрос N5 добавлен в first-run; AGENTS.md ссылается на файл, если он есть.
- Контекст: большим продуктовым проектам нужен отдельный файл "что строим", чтобы агенты не диспозили фичи вне scope.
- Последствие: по умолчанию не создаётся; фичи по умолчанию ведутся в features/.
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: Канон скиллов перенесён из .docs/skills в skills/

- Решение: canonical-копии скиллов теперь живут в корневом `skills/`, зеркала `.agents/skills` остаются рабочими копиями. Прежнее решение о `.docs/skills` переопределено пользователем.
- Контекст: CLI npx/bunx/pnpm dlx skills ищет скиллы в skills/, .agents/skills и подобных папках, но не видит .docs/skills - команды установки из README не работали бы.
- Последствие: `npx skills add hullperse/ai-docs` работает напрямую; дистрибуция в целевой проект не изменилась (копирование в .agents/skills); sync-скрипт пересобирает оба места.
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: Новые скиллы docs-refactor и docs-onboard

- Решение: добавлены два скилла. docs-refactor приводит существующий код к правилам его собственных .docs (аудит соответствия таблицей PASS/WARN/FAIL -> пакеты работ -> disposition -> выполнение -> реверификация). docs-onboard подключает новый чат к проекту с готовыми доками (AGENTS.md -> mandatory reading -> резюме контракта в чат).
- Контекст: юзеру нужен был рефакторинг по правилам и быстрое подключение агентов к существующим проектам.
- Последствие: полный набор скиллов: ai-docs, deslop, scandinavian-design, docs-refactor, docs-onboard.
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: Инфраструктура репозитория

- Решение: добавлены scripts/sync-templates.ps1 и .sh (пересборка templates + зеркал с hash-верификацией; DECISIONS.md исключён из автосинка - шаблон остаётся пустым журналом), CI workflow docs-check.yml (тире вне vendor, frontmatter скиллов, свежесть templates через git diff), scripts/pre-commit (тире, any, нейминг компонентов), CHANGELOG.md с версионированием (v1.0.0/v1.1.0), версии во frontmatter скиллов, examples/mini-project (заполненный пример доков микро-CLI).
- Контекст: ручная синхронизация уже дважды приводила к рассинхрону и инциденту; установки командами менеджеров требовали npx-совместимой структуры.
- Последствие: изменения live-файлов требуют запуска sync-скрипта; CI ловит рассинхрон автоматически.
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: Лицензия Unlicense и health check счётчики

- Решение: LICENSE = Unlicense (публичное достояние, любое использование). Health check переведён на фактические счётчики top-level секций: AGENT_PROMPT 12, DEVELOPMENT 13, DESIGN 7, CHECKLIST 5, REVIEWER 8 (заголовки issue-шаблона внутри code fence не считаются), DECISIONS 2.
- Контекст: прежний счётчик "9 секций REVIEWER" и "19 секций AGENT_PROMPT" не соответствовали реальной структуре файлов.
- Последствие: first-run и SKILL.md используют точные числа; README переписан полностью (принципы, карта доков, установка тремя менеджерами, референсы).
- Источник: сессия расширения шаблонов 2026-08-22.

### 2026-08-22: English becomes the canonical template language

- Decision: all `.docs/` templates, AGENTS.md, and first-run.md translated to English; initialization Question 1 reworded to control the language of generated docs and agent communication; non-English choices are translated at generation time. Russian v1.2 archived as git tag `v1.2-ru` (commit dd7d2d6). examples/mini-project intentionally kept Russian as a live translate-at-init demo.
- Context: user goal is wider adoption; skills and README were already English while core templates were Russian - inconsistency grew.
- Consequence: deslop RU word-tag lists stay bilingual by design (they describe Russian-language slop); every future rule edit happens in English first; repo CHANGELOG entries are English from v1.3.0.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Clarify incomplete understanding before implementing

- Decision: new rule in AGENT_PROMPT section 4 plus AGENTS.md key rules and a CHECKLIST item: when the goal, boundaries, or expected outcome of a task are unclear, the agent restates its interpretation in one sentence and asks before implementing instead of guessing. Junk-question guard kept: clarification required exactly where being wrong changes scope.
- Context: existing protocol only demanded clarification "on conflict", which let plausible-but-wrong readings through.
- Consequence: interpretation restatement becomes part of the standard question flow for every project on the template.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Initialization guide added to README

- Decision: README gained an "Initialize .docs in Your Project" section explaining that templates ship inside the ai-docs skill, so one `npx skills add hullperse/ai-docs` call suffices; documents both CLI and manual paths, lists the five init questions, and shows the resulting file tree.
- Context: user asked how the full .docs package actually initializes in target projects.
- Consequence: onboarding cost for new users drops to one command plus an agent conversation.
- Source: session of EN migration 2026-08-22.

### 2026-08-22: Repository and skill renamed to hp_docs / hp-docs

- Decision: GitHub repository renamed `HullPerse/ai-docs` -> `HullPerse/hp_docs`; local folder renamed to `D:\Projects\hp_docs`; the master skill renamed `ai-docs` -> `hp-docs` (folder, frontmatter name, package.json) with all cross-references updated across README, docs-init, docs-onboard, docs-refactor, first-run and sync scripts. Historical DECISIONS entries keep the old name as records of past state.
- Context: user wants repo naming aligned with the HullPerse branding; full rebrand chosen over half-rename because zero external installs existed yet - cheapest possible moment.
- Consequence: install commands become `npx skills add HullPerse/hp_docs`; skill flag is `--skill hp-docs`; docs-init keeps the legacy "install ai-docs" trigger phrase for continuity; old tags v1.2-ru/v1.4.0 remain pointing at pre-rename commits.
- Source: session of rename 2026-08-22.

### 2026-08-22: docs-init skill for agent-driven installation

- Decision: new skill `skills/docs-init/SKILL.md` installs the package into a clean project through an agent: detects installation state (installed / empty / already initialized), asks one runner question (npx recommended), installs into `.agents/skills/` with git-clone fallback when node is absent and `--copy` retry on Windows symlink failures, verifies all six skills plus templates, then hands off to the first-run flow which owns all initialization questions. README gained an "Install via Your Agent" section with a copy-paste prompt and a pinned-version example via tag tree URL.
- Context: clean projects had no root AGENTS.md to anchor an agent; installation semantics (default-branch snapshot, no auto-update, update via `npx skills update`, pinning via tree URLs) were undocumented.
- Consequence: full agent-driven path exists end to end; main branch must stay working at all times since every install snapshots it; releases are tagged so users can pin.
- Source: session of docs-init 2026-08-22.
