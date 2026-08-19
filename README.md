# .docs-templates

Универсальные шаблоны `.docs/` для проектов с AI-агентами (opencode, freebuff, grok build и другие).

## Структура

```
.docs-templates/
  AGENTS.md              -- точка входа агента (копируется 1:1)
  first-run.md           -- промпт для первого запуска и заполнения шаблонов
  README.md              -- этот файл
  .docs/
    AGENT_PROMPT.md      -- контракт сессии (с плейсхолдерами)
    DEVELOPMENT.md       -- постоянный контракт проекта (с плейсхолдерами)
    DESIGN.md            -- дизайн-система (упрощённый, с плейсхолдерами)
    DECISIONS.md         -- журнал решений (копируется 1:1)
    CHECKLIST.md         -- чеклист реализации (с плейсхолдерами)
    REVIEWER.md          -- промпт ревьюера (копируется 1:1)
    agents-audit.prompt.md -- аудит актуальности правил (копируется 1:1)
    features/
      README.md          -- инструкция по ведению feature-файлов
    reviews/
      README.md          -- описание папки с issue-файлами
```

## Как использовать

### Для нового проекта

1. Скопируй содержимое `.docs-templates/` в корень проекта:
   ```bash
   cp -r .docs-templates/AGENTS.md <project>/
   cp -r .docs-templates/.docs/ <project>/.docs/
   ```

2. При первом запуске агента он найдёт `AGENTS.md`, прочитает `first-run.md` и автоматически заполнит плейсхолдеры.

3. Агент предложит:
   - **Глубокий анализ** существующего проекта (код, зависимости, архитектура)
   - **Инициализацию** нового проекта (выбор стека, создание структуры)

4. Альтернативно: вставь содержимое `first-run.md` как первый промпт агенту.

### Для существующего проекта

1. Скопируй только универсальные файлы (DECISIONS.md, REVIEWER.md, agents-audit.prompt.md).
2. Скопируй шаблоны AGENT_PROMPT.md и DEVELOPMENT.md и вручную заполни плейсхолдеры.

### Что делает агент при first-run

1. Сканирует проект (package.json, структуру, зависимости)
2. Заполняет плейсхолдеры `{{...}}` в шаблонах
3. Задаёт вопрос: анализ существующего проекта или пропустить
4. Если анализ -- детально проверяет код, пакеты, инструменты
5. Предлагает улучшения с disposition (сейчас/отложить/отклонить)
6. Записывает все решения в DECISIONS.md

## Уровни файлов

### Универсальные (копируются без изменений)
- `AGENTS.md`
- `.docs/DECISIONS.md`
- `.docs/REVIEWER.md`
- `.docs/agents-audit.prompt.md`
- `.docs/reviews/README.md`
- `.docs/features/README.md`

### С плейсхолдерами (заполняются при first-run)
- `.docs/AGENT_PROMPT.md` -- `{{PROJECT_NAME}}`, `{{PROJECT_CONTEXT}}`, `{{COMMANDS}}`
- `.docs/DEVELOPMENT.md` -- `{{PROJECT_NAME}}`, `{{PROJECT_OVERVIEW}}`, `{{FIXED_DECISIONS}}`, `{{DIRECTORY_STRUCTURE}}`, `{{COMMANDS}}`
- `.docs/DESIGN.md` -- все `{{...}}` (опционально для не-UI проектов)
- `.docs/CHECKLIST.md` -- `{{LINT_COMMAND}}`, `{{TYPECHECK_COMMAND}}`, `{{TEST_COMMAND}}`

## Поддерживаемые агенты

Шаблоны универсальны и работают с любым AI-агентом, который:
- читает файлы проекта
- выполняет команды
- записывает файлы

Проверено для:
- opencode (OpenAI)
- freebuff (Buffy/mimo)
- grok build (xAI)

## Кастомизация

После first-run можно:
- Добавить проект-специфичные правила в `DEVELOPMENT.md`
- Расширить `DESIGN.md` для UI-проектов
- Добавить feature-файлы в `.docs/features/`
- Настроить `CHECKLIST.md` под особенности проекта
