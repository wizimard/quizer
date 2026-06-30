# АУДИТ DDD-ПРОЕКТА И ПЛАН РЕФАКТОРИНГА К МОДУЛЬНОЙ АРХИТЕКТУРЕ

> **Проект:** quiz-server  
> **Дата аудита:** 30.06.2026  
> **Объём:** 124 TypeScript-файла в `src/`  
> **Общая DDD-зрелость:** 4.5 / 10 — ранняя стадия: слоистая архитектура с элементами DDD, но без модульных границ и с существенными утечками зависимостей.

---

## 1. Текущее состояние проекта

### 1.1 Общая информация

| Параметр | Значение |
|----------|----------|
| Количество файлов (`src/**/*.ts`) | **124** |
| Controllers + Services | **16** (5 controllers, 11 services) |
| Entities | **3** (`QuizEntity`, `QuestionEntity`, `User`) |
| Repository ports (domain) | **2** (`QuizRepository`, `UserRepository` — второй не используется) |
| Unit-тесты | **0** |
| E2E-тесты | **1** (`test/e2e/auth.e2e-spec.ts`) |
| Самый большой файл | `quiz.repository.ts` — 139 строк (God Classes нет) |

**Основные технологии:**
- **Runtime:** Node.js, TypeScript (ESM)
- **HTTP:** Express 5
- **DI:** Inversify 8
- **ORM:** Prisma 7 + PostgreSQL
- **Валидация:** class-validator, class-transformer
- **Auth:** JWT (jsonwebtoken), bcrypt, cookie-parser
- **Документация:** swagger-ui-express

**Архитектурный стиль:** **Layered Architecture с элементами DDD** (не полноценный Modular Monolith).

Проект организован по горизонтальным слоям (`domain/`, `application/`, `infrastructure/`, `interfaces/`), а не по бизнес-контекстам. Это промежуточная стадия между Transaction Script и DDD:
- Quiz-домен относительно богатый (entities, question configs, policies, validation)
- User/Auth-домен анемичный (логика в `AuthService`)
- Application-слой тесно связан с HTTP DTO
- Infrastructure мапперы знают о presentation-слое

### 1.2 Структура папок (текущая)

```
src/
├── app.ts
├── app.types.ts
├── bootstrap.ts
├── main.ts
├── types.d.ts
│
├── application/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.service.interface.ts
│   │   └── to-token-payload.ts
│   └── quiz/
│       ├── quiz.service.ts
│       ├── quiz-query.service.ts
│       ├── question.service.ts
│       └── execution/
│           ├── answer-evaluation.service.ts
│           ├── answer-evaluator.registry.ts
│           └── answer-evaluators/
│               ├── input-value.answer-evaluator.ts
│               ├── multiple-choise.answer-evaluator.ts
│               ├── order-values.answer-evaluator.ts
│               └── single-choise.answer-evaluator.ts
│
├── composition/
│   ├── index.ts
│   ├── auth.module.ts
│   ├── auth.types.ts
│   ├── quiz.module.ts
│   ├── quiz.types.ts
│   ├── user.module.ts
│   └── user.types.ts
│
├── config/
│   ├── config.service.ts
│   ├── config.service.interface.ts
│   └── index.ts
│
├── domain/
│   ├── quiz/
│   │   ├── errors/
│   │   ├── policies/
│   │   ├── ports/
│   │   ├── question-configs/
│   │   ├── value-objects/
│   │   ├── quiz.entity.ts
│   │   ├── question.entity.ts
│   │   ├── quiz-settings.ts
│   │   └── quiz-available-period.ts
│   └── user/
│       ├── ports/
│       ├── user.entity.ts
│       └── user.entity.interface.ts
│
├── error/
│   ├── exception.filter.ts
│   ├── http.error.ts
│   └── http-validation.error.ts
│
├── infrastructure/
│   ├── auth/
│   │   ├── jwt/
│   │   └── refresh-token-cookie.service.ts
│   └── persistence/
│       ├── database/
│       ├── mappers/
│       └── prisma/
│
├── interfaces/
│   └── http/
│       ├── auth/
│       ├── common/
│       ├── quiz/
│       └── user/
│
└── logger/
    ├── logger.service.ts
    └── logger.interface.ts
```

### 1.3 Оценка по критериям

| # | Критерий | Оценка | Комментарий |
|---|----------|:------:|-------------|
| 1 | Разделение слоёв (Domain/Application/Infrastructure/Interfaces) | **7/10** | Слои явно выделены, DI через Inversify, composition-модули. Но слои горизонтальные, не привязаны к бизнес-контекстам. |
| 2 | Чистота Domain (нет зависимостей от БД, фреймворков) | **5/10** | `quiz.repository.port.ts` импортирует `QuizModel` из `@prisma/client`. `QuizOwnershipPolicy` бросает `HttpError`. `QuestionConfigFactory` использует `inversify`. |
| 3 | Наличие Value Objects (вместо примитивов) | **3/10** | `QuizId` и `UserId` существуют, но **нигде не используются** — везде `string`. `QuestionConfigOption`, `QuizAvailablePeriod` — VO-подобные, но без инвариантов. |
| 4 | Инкапсуляция бизнес-правил (в сущностях, а не сервисах) | **6/10** | `QuizEntity.validate()`, `assertOwnedBy()`, `isOpen()` — хорошо. `QuestionConfig*` — богатая валидация. `User` — анемичный, auth-логика в `AuthService`. |
| 5 | Использование репозиториев (интерфейс в domain, реализация в infra) | **6/10** | `QuizRepository` port реализован в `PrismaQuizRepository`. Domain `UserRepository` port **существует, но не используется** — `AuthService` зависит от `IUserRepository` (infra). |
| 6 | Применение Domain Events | **1/10** | Domain Events отсутствуют полностью. Нет `EventEmitter`, нет event handlers, нет outbox. |
| 7 | Тестируемость (юнит-тесты для domain) | **2/10** | 0 unit-тестов. 1 e2e-тест на auth. `package.json`: `"test": "echo \"Error: no test specified\""`. |
| 8 | Уровень связности между модулями (coupling) | **5/10** | Application импортирует HTTP DTO (`QuizCreateDto`). Mappers импортируют DTO и composition symbols. Infra зависит от interfaces. |
| 9 | Соблюдение SOLID принципов | **6/10** | DI и интерфейсы — хорошо. SRP нарушен в `QuizService` (CRUD + settings + execution). ISP: `QuizRepository` смешивает persistence и execution (`startQuiz`/`finishQuiz`). |
| 10 | Наличие модульности (границы бизнес-контекстов) | **4/10** | Есть `composition/*` модули для DI, но физически код разбит по слоям, а не по bounded contexts. Нет `src/modules/`. |

**Средний балл: 4.5 / 10**

### 1.4 Проблемные зоны

#### God Classes
**Не обнаружены.** Максимальный файл — 139 строк (`infrastructure/persistence/prisma/quiz.repository.ts`). Кодовая база компактна.

#### Циклические зависимости (архитектурные, не TS-import)

| Проблема | Файлы | Описание |
|----------|-------|----------|
| Domain ↔ Persistence contract | `domain/quiz/quiz-settings.ts` ↔ `domain/quiz/ports/quiz.repository.port.ts` | `QuizSettings.buildUpdateData()` возвращает `IQuizUpdateSettingsData` — доменная логика привязана к контракту репозитория |
| Application ↔ Interfaces | `application/quiz/quiz.service.ts` → `@interfaces/http/quiz/dto/*` | Application-слой не может существовать без HTTP-слоя |
| Infrastructure ↔ Interfaces | `infrastructure/persistence/mappers/quiz.mapper.ts` → `@interfaces/http/quiz/dto/*` | Маппер знает о HTTP DTO |
| Infrastructure ↔ Composition | `infrastructure/persistence/mappers/question.mapper.ts` → `@composition/quiz.types` | Infra зависит от DI-символов composition |
| Дублирование ownership | `domain/quiz/quiz.entity.ts` (`assertOwnedBy`) vs `domain/quiz/policies/quiz-ownership.policy.ts` | Policy зарегистрирован в DI, но **нигде не используется** |

#### Смешение ответственности

| Файл | Проблема |
|------|----------|
| `application/quiz/quiz.service.ts` | Совмещает CRUD, settings, execution (start/finish). Знает о `QuizModel` из Prisma (строка 18). |
| `application/quiz/execution/answer-evaluation.service.ts` | Работает с `QuizQuestionModel` (Prisma) напрямую, обходит domain entities |
| `interfaces/http/common/hash.service.ts` | Криптографический сервис в HTTP-слое, а не в infrastructure |
| `domain/quiz/policies/quiz-ownership.policy.ts` | Domain policy бросает `HttpError` (HTTP-зависимость) |

#### Дублирование кода

| Область | Файлы | Описание |
|---------|-------|----------|
| Ownership check | `quiz.entity.ts:assertOwnedBy()` + `quiz-ownership.policy.ts` | Два механизма проверки владельца, используется только entity-метод |
| User repository | `domain/user/ports/user.repository.port.ts` + `infrastructure/.../user.repository.interface.ts` | Два интерфейса, используется только infra-версия |
| ID types | `QuizId`/`UserId` VOs + `string` everywhere | VO созданы, но не приняты |

#### Нарушение Dependency Inversion

| Файл | Нарушение |
|------|-----------|
| `application/auth/auth.service.ts:12` | Зависит от `IUserRepository` (infrastructure), а не от domain port |
| `application/auth/auth.service.ts:9` | Работает с `UserModel` (Prisma), а не `User` entity |
| `domain/quiz/ports/quiz.repository.port.ts:4` | Port возвращает `QuizModel` из Prisma |
| `application/quiz/quiz.service.ts:18` | Импортирует `QuizModel` из `@prisma/client` |

#### Глобальное состояние / синглтоны

| Файл | Описание |
|------|----------|
| `main.ts:46-51` | `bootPromise` — memoized bootstrap promise (для e2e) |
| `main.ts`, `composition/*.module.ts` | Все DI-биндинги в `.inSingletonScope()` |
| `answer-evaluator.registry.ts` | Статический registry evaluators |
| `question-config.registry.ts` | Статический registry question configs |

---

## 2. Целевая модульная архитектура

### 2.1 Bounded Contexts (модули)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Shared Kernel                            │
│  (config, logger, error handling, common types, DI bootstrap)   │
└──────────┬──────────────┬──────────────┬──────────────────────┘
           │              │              │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼──────────┐
    │   Identity  │ │   Quiz    │ │ Quiz Execution │
    │   & Access  │ │Management │ │                │
    └──────┬──────┘ └─────┬─────┘ └──────┬─────────┘
           │              │              │
           │         depends on         │
           │         Identity ──────────┘
           └────────────────────────────┘
```

#### Модуль 1: Identity & Access (Auth)

| Аспект | Описание |
|--------|----------|
| **Ответственность** | Аутентификация (login/register/refresh), генерация JWT, управление refresh-token cookies |
| **Агрегаты** | `Session` (опционально, в будущем) |
| **Ключевые сущности** | `User` (credentials) |
| **Value Objects** | `Email`, `Password`, `UserId`, `TokenPayload` |
| **Зависимости** | Shared Kernel |
| **Текущие файлы** | `application/auth/*`, `infrastructure/auth/*`, `interfaces/http/auth/*`, `composition/auth.module.ts` |

#### Модуль 2: User Management

| Аспект | Описание |
|--------|----------|
| **Ответственность** | Профиль пользователя, получение данных текущего пользователя |
| **Агрегаты** | `User` |
| **Ключевые сущности** | `User` |
| **Зависимости** | Identity & Access (для auth guard) |
| **Текущие файлы** | `domain/user/*`, `interfaces/http/user/*`, `composition/user.module.ts` |

#### Модуль 3: Quiz Management

| Аспект | Описание |
|--------|----------|
| **Ответственность** | CRUD квизов, управление вопросами, настройки, периоды доступности, проверка владельца |
| **Агрегаты** | `Quiz` (root), `Question` (child), `QuizSettings` (child) |
| **Ключевые сущности** | `QuizEntity`, `QuestionEntity`, `QuizSettings`, `QuizAvailablePeriod` |
| **Value Objects** | `QuizId`, `QuestionConfig*`, `QuestionConfigOption` |
| **Domain Services** | `QuizOwnershipPolicy` |
| **Зависимости** | Identity & Access (authorId), Shared Kernel |
| **Текущие файлы** | `domain/quiz/*`, `application/quiz/quiz.service.ts`, `application/quiz/question.service.ts`, `application/quiz/quiz-query.service.ts` |

#### Модуль 4: Quiz Execution

| Аспект | Описание |
|--------|----------|
| **Ответственность** | Публичное прохождение квиза, оценка ответов, start/finish quiz, проверка доступности |
| **Агрегаты** | `QuizSession` (в будущем), read-model `ExecutableQuiz` |
| **Ключевые сущности** | Read-only projections из Quiz Management |
| **Domain Services** | `AnswerEvaluator` (strategy per question type) |
| **Зависимости** | Quiz Management (read), Shared Kernel |
| **Текущие файлы** | `application/quiz/execution/*`, `interfaces/http/quiz/quiz-execute.controller.ts` |

#### Модуль 5: Shared Kernel

| Аспект | Описание |
|--------|----------|
| **Ответственность** | Конфигурация, логирование, обработка ошибок, общие утилиты, DI bootstrap, feature flags |
| **Зависимости** | Нет (корень) |
| **Текущие файлы** | `config/*`, `logger/*`, `error/*`, `main.ts`, `bootstrap.ts`, `app.ts` |

### 2.2 Структура модуля (шаблон)

```
src/
├── shared/                              # Shared Kernel
│   ├── config/
│   ├── logger/
│   ├── error/
│   ├── di/
│   └── feature-flags/
│
├── modules/
│   ├── identity-access/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── password.vo.ts
│   │   │   │   └── user-id.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.port.ts
│   │   │   ├── events/
│   │   │   │   └── user-registered.event.ts
│   │   │   └── errors/
│   │   │       └── invalid-credentials.error.ts
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── login.command.ts
│   │   │   │   └── register.command.ts
│   │   │   ├── handlers/
│   │   │   │   ├── login.handler.ts
│   │   │   │   └── register.handler.ts
│   │   │   ├── queries/
│   │   │   │   └── refresh-tokens.query.ts
│   │   │   └── dto/
│   │   │       └── auth-result.dto.ts        # application-level DTO, NOT HTTP
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── orm-entities/
│   │   │   │   ├── repositories/
│   │   │   │   │   └── prisma-user.repository.ts
│   │   │   │   └── mappers/
│   │   │   │       └── user.mapper.ts
│   │   │   ├── auth/
│   │   │   │   ├── jwt-token.service.ts
│   │   │   │   └── refresh-token-cookie.service.ts
│   │   │   └── hash/
│   │   │       └── bcrypt-hash.service.ts
│   │   ├── interfaces/
│   │   │   └── http/
│   │   │       ├── controllers/
│   │   │       │   └── auth.controller.ts
│   │   │       ├── middlewares/
│   │   │       │   ├── auth.middleware.ts
│   │   │       │   └── auth.guard.ts
│   │   │       ├── dto/
│   │   │       │   ├── user-login.dto.ts
│   │   │       │   └── user-register.dto.ts
│   │   │       └── mappers/
│   │   │           └── auth-response.mapper.ts  # HTTP DTO ↔ Application DTO
│   │   └── identity-access.module.ts            # DI module
│   │
│   ├── quiz-management/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── quiz.entity.ts
│   │   │   │   └── question.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── quiz-id.vo.ts
│   │   │   │   └── question-configs/
│   │   │   ├── aggregates/
│   │   │   │   └── quiz.aggregate.ts
│   │   │   ├── repositories/
│   │   │   │   └── quiz.repository.port.ts
│   │   │   ├── policies/
│   │   │   │   └── quiz-ownership.policy.ts
│   │   │   └── events/
│   │   │       ├── quiz-created.event.ts
│   │   │       └── quiz-updated.event.ts
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   │   ├── create-quiz.command.ts
│   │   │   │   ├── update-quiz.command.ts
│   │   │   │   └── update-quiz-settings.command.ts
│   │   │   ├── queries/
│   │   │   │   ├── get-quiz-by-id.query.ts
│   │   │   │   └── get-quizzes-by-author.query.ts
│   │   │   ├── handlers/
│   │   │   │   ├── create-quiz.handler.ts
│   │   │   │   └── update-quiz.handler.ts
│   │   │   └── dto/
│   │   │       ├── quiz.dto.ts
│   │   │       └── quiz-settings.dto.ts
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── prisma-quiz.repository.ts
│   │   │   │   │   └── prisma-question.repository.ts
│   │   │   │   └── mappers/
│   │   │   │       ├── quiz.mapper.ts
│   │   │   │       └── question.mapper.ts
│   │   │   └── config/
│   │   ├── interfaces/
│   │   │   └── http/
│   │   │       ├── controllers/
│   │   │       │   └── quiz.controller.ts
│   │   │       ├── dto/
│   │   │       │   ├── quiz-create.dto.ts
│   │   │       │   └── quiz-update.dto.ts
│   │   │       └── mappers/
│   │   │           └── quiz-response.mapper.ts
│   │   └── quiz-management.module.ts
│   │
│   └── quiz-execution/
│       ├── domain/
│       │   ├── services/
│       │   │   ├── answer-evaluator.interface.ts
│       │   │   └── answer-evaluators/
│       │   ├── repositories/
│       │   │   └── question-read.repository.port.ts
│       │   └── value-objects/
│       │       └── submitted-answer.vo.ts
│       ├── application/
│       │   ├── commands/
│       │   │   ├── start-quiz.command.ts
│       │   │   ├── finish-quiz.command.ts
│       │   │   └── evaluate-answer.command.ts
│       │   ├── queries/
│       │   │   └── get-quiz-for-execution.query.ts
│       │   └── handlers/
│       │       ├── start-quiz.handler.ts
│       │       └── evaluate-answer.handler.ts
│       ├── infrastructure/
│       │   └── persistence/
│       │       └── repositories/
│       │           └── prisma-question-read.repository.ts
│       ├── interfaces/
│       │   └── http/
│       │       ├── controllers/
│       │       │   └── quiz-execute.controller.ts
│       │       └── dto/
│       └── quiz-execution.module.ts
│
├── composition/                         # Root DI wiring (временно, до полной миграции)
│   └── app.module.ts
│
├── main.ts
└── bootstrap.ts
```

### 2.3 Правила зависимостей

```
┌──────────────────────────────────────────────────────────────┐
│  interfaces (HTTP/CLI/GraphQL)                               │
│  Может импортировать: application, shared                    │
│  НЕ может: domain напрямую (только через application)      │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  application (use cases, handlers)                           │
│  Может импортировать: domain (своего модуля), shared        │
│  Может импортировать: domain других модулей через ports    │
│  НЕ может: infrastructure, interfaces                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│  domain (entities, VOs, policies, ports)                     │
│  Может импортировать: shared (только чистые типы/утилиты)   │
│  НЕ может: application, infrastructure, interfaces,          │
│            фреймворки (inversify, prisma, express)           │
└──────────────────────────────────────────────────────────────┘
                         ▲
┌────────────────────────┴─────────────────────────────────────┐
│  infrastructure (persistence, external APIs)                   │
│  Может импортировать: domain (ports, entities), shared       │
│  НЕ может: application, interfaces                           │
└──────────────────────────────────────────────────────────────┘

Межмодульные зависимости:
  quiz-execution → quiz-management (read ports)
  quiz-management → identity-access (UserId VO)
  user-management → identity-access
  * → shared (всегда разрешено)
```

---

## 3. Пошаговый план рефакторинга

> **Принципы:** каждый этап = рабочее приложение, 2–4 дня, ≤5 файлов за раз без тестов, feature flags для переключения, коммит в конце этапа.

### Этап 1: Фундамент — Shared Kernel и Feature Flags (3 дня)

**Цель:** Выделить общий код, ввести feature flags, настроить ESLint import boundaries.

**Файлы:**
- Создать: `src/shared/config/config.service.ts` (перенос из `src/config/`)
- Создать: `src/shared/logger/logger.service.ts` (перенос из `src/logger/`)
- Создать: `src/shared/error/exception.filter.ts` (перенос из `src/error/`)
- Создать: `src/shared/feature-flags/feature-flags.service.ts`
- Создать: `src/shared/feature-flags/feature-flags.service.interface.ts`
- Создать: `src/shared/di/types.ts` (общие DI symbols)
- Изменить: `src/main.ts`, `src/bootstrap.ts`, `src/app.ts`
- Создать: `.eslintrc` rule `no-restricted-imports` для layer boundaries

**Действия:**
1. Создать `src/shared/` и перенести config, logger, error с re-export из старых путей (backward compat)
2. Создать `FeatureFlagsService` с флагами: `USE_MODULAR_AUTH`, `USE_MODULAR_QUIZ`, `USE_MODULAR_EXECUTION`
3. Добавить ESLint rule: domain не может импортировать `@infrastructure`, `@interfaces`, `@prisma`
4. Обновить path aliases в `tsconfig.json`: `@shared/*`
5. Написать unit-тесты для `FeatureFlagsService`

**Результат:** Shared Kernel выделен, feature flags работают, старые импорты через re-export не ломаются.

**Критерии успеха:**
- `npm run build` — успешно
- `npm run test:e2e` — auth e2e проходит
- `FeatureFlagsService.isEnabled('USE_MODULAR_AUTH')` возвращает `false` по умолчанию

**Риски:**
- Сломанные импорты → re-export из старых путей как alias
- ESLint rule слишком строгий → начать с `warn`, не `error`

**Зависимости:** нет (первый этап)

**Коммит:** `refactor: extract shared kernel and introduce feature flags`

---

### Этап 2: Identity & Access — Domain Layer (3 дня)

**Цель:** Создать чистый domain-слой для auth/user модуля.

**Файлы:**
- Создать: `src/modules/identity-access/domain/entities/user.entity.ts`
- Создать: `src/modules/identity-access/domain/value-objects/email.vo.ts`
- Создать: `src/modules/identity-access/domain/value-objects/password.vo.ts`
- Создать: `src/modules/identity-access/domain/value-objects/user-id.vo.ts`
- Создать: `src/modules/identity-access/domain/repositories/user.repository.port.ts`
- Создать: `src/modules/identity-access/domain/errors/invalid-credentials.error.ts`
- Создать: `src/modules/identity-access/domain/errors/email-already-taken.error.ts`
- Создать: `test/unit/identity-access/domain/user.entity.spec.ts`
- Создать: `test/unit/identity-access/domain/email.vo.spec.ts`

**Действия:**
1. Обогатить `User` entity: `static create(email, password)`, `verifyPassword(plain, hasher)`, `changeEmail(newEmail)` — перенести логику из `AuthService`
2. Создать `Email` VO с валидацией формата
3. Создать `Password` VO с минимальной длиной
4. Перенести `UserId` из `domain/quiz/value-objects/user-id.ts` в модуль identity-access
5. Domain errors вместо `HttpError` (domain бросает `InvalidCredentialsError`, application ловит и маппит в HTTP)
6. Написать unit-тесты для entity и VOs

**Результат:** Богатый User domain, независимый от Prisma/Express. Старый код не тронут.

**Критерии успеха:**
- Unit-тесты: `User.create()` → valid entity, `User.verifyPassword()` → true/false
- `Email.of('invalid')` → throws
- Domain не импортирует ничего из `@prisma`, `@error`, `inversify`

**Риски:**
- Дублирование User entity → старый `domain/user/user.entity.ts` остаётся до этапа 4

**Зависимости:** Этап 1 (shared kernel)

**Коммит:** `feat(identity-access): add rich domain layer with VOs and unit tests`

---

### Этап 3: Identity & Access — Application + Infrastructure (3 дня)

**Цель:** Создать application handlers и infra-реализацию, подключить через Strangler Fig.

**Файлы:**
- Создать: `src/modules/identity-access/application/commands/login.command.ts`
- Создать: `src/modules/identity-access/application/commands/register.command.ts`
- Создать: `src/modules/identity-access/application/handlers/login.handler.ts`
- Создать: `src/modules/identity-access/application/handlers/register.handler.ts`
- Создать: `src/modules/identity-access/application/dto/auth-result.dto.ts`
- Создать: `src/modules/identity-access/infrastructure/persistence/repositories/prisma-user.repository.ts`
- Создать: `src/modules/identity-access/infrastructure/persistence/mappers/user.mapper.ts`
- Создать: `src/modules/identity-access/infrastructure/auth/jwt-token.service.ts`
- Создать: `src/modules/identity-access/infrastructure/hash/bcrypt-hash.service.ts`
- Создать: `src/modules/identity-access/interfaces/http/controllers/auth.controller.v2.ts`
- Создать: `src/modules/identity-access/interfaces/http/mappers/auth-response.mapper.ts`
- Создать: `src/modules/identity-access/identity-access.module.ts`
- Создать: `src/modules/identity-access/application/auth.facade.ts` (Strangler proxy)
- Изменить: `src/composition/auth.module.ts` (условный биндинг по feature flag)
- Создать: `test/unit/identity-access/application/login.handler.spec.ts`
- Создать: `test/e2e/auth.v2.e2e-spec.ts`

**Действия:**
1. `LoginHandler`: принимает `LoginCommand` → вызывает `UserRepository` → domain `User.verifyPassword()` → возвращает `AuthResultDto`
2. `PrismaUserRepository` implements domain `UserRepository` port, маппит Prisma ↔ domain entity
3. `AuthControllerV2` — новый контроллер на `/api/v2/auth/*`
4. `AuthFacade` — прокси: если `USE_MODULAR_AUTH` → новый handler, иначе → старый `AuthService`
5. Обновить `auth.module.ts`: bind `AuthFacade` вместо `AuthService` для контроллера
6. E2E тесты для v2 endpoints

**Результат:** Auth работает через новый модуль (v2 routes) и старый код (v1 routes) параллельно.

**Критерии успеха:**
- `POST /api/v2/auth/login` — работает
- `POST /api/auth/login` (старый) — работает
- Feature flag `USE_MODULAR_AUTH=true` → v1 routes тоже идут через новый код
- Unit-тесты handlers с mock repository

**Риски:**
- Разные форматы ответов v1/v2 → `AuthResponseMapper` обеспечивает совместимость
- JWT payload format → использовать тот же `toTokenPayload`

**Зависимости:** Этапы 1, 2

**Коммит:** `feat(identity-access): add application layer with strangler fig proxy`

---

### Этап 4: Quiz Management — Domain Cleanup (3 дня)

**Цель:** Очистить quiz domain от infra-зависимостей, принять Value Objects.

**Файлы:**
- Создать: `src/modules/quiz-management/domain/` (копия и рефакторинг `src/domain/quiz/`)
- Изменить: `src/modules/quiz-management/domain/entities/quiz.entity.ts` — `QuizId` вместо `string`
- Изменить: `src/modules/quiz-management/domain/repositories/quiz.repository.port.ts` — убрать `QuizModel`, вернуть domain types
- Удалить: Prisma import из port
- Изменить: `src/modules/quiz-management/domain/policies/quiz-ownership.policy.ts` — бросать `QuizNotOwnedError`, не `HttpError`
- Создать: `src/modules/quiz-management/domain/events/quiz-created.event.ts`
- Создать: `test/unit/quiz-management/domain/quiz.entity.spec.ts`
- Создать: `test/unit/quiz-management/domain/question-config-single-choise.spec.ts`

**Действия:**
1. Скопировать `domain/quiz/*` → `modules/quiz-management/domain/`
2. Заменить `string` id на `QuizId.of(id)` во всех entities
3. Убрать `QuizModel` из `QuizRepository` port: `startQuiz`/`finishQuiz` → вынести в quiz-execution module
4. `QuizOwnershipPolicy` → domain error, не HTTP
5. Убрать `inversify` из `QuestionConfigFactory` — сделать чистую фабрику
6. Unit-тесты: `QuizEntity.validate()`, `assertOwnedBy()`, `isOpen()`, question configs

**Результат:** Чистый quiz domain без Prisma/HTTP/inversify.

**Критерии успеха:**
- 0 импортов `@prisma` в `modules/quiz-management/domain/`
- Unit-тесты покрывают validate, ownership, isOpen
- Старый `domain/quiz/` не тронут (работает параллельно)

**Риски:**
- `QuizId` propagation → делать постепенно, entity first, потом services

**Зависимости:** Этап 1

**Коммит:** `refactor(quiz-management): clean domain layer, adopt value objects`

---

### Этап 5: Quiz Management — Application Layer (4 дня)

**Цель:** Разделить `QuizService` на commands/queries, убрать HTTP DTO из application.

**Файлы:**
- Создать: `src/modules/quiz-management/application/commands/create-quiz.command.ts`
- Создать: `src/modules/quiz-management/application/commands/update-quiz.command.ts`
- Создать: `src/modules/quiz-management/application/commands/update-quiz-settings.command.ts`
- Создать: `src/modules/quiz-management/application/commands/delete-quiz.command.ts`
- Создать: `src/modules/quiz-management/application/queries/get-quiz-by-id.query.ts`
- Создать: `src/modules/quiz-management/application/queries/get-quizzes-by-author.query.ts`
- Создать: `src/modules/quiz-management/application/handlers/create-quiz.handler.ts`
- Создать: `src/modules/quiz-management/application/handlers/update-quiz.handler.ts`
- Создать: `src/modules/quiz-management/application/handlers/update-quiz-settings.handler.ts`
- Создать: `src/modules/quiz-management/application/dto/quiz.dto.ts`
- Создать: `src/modules/quiz-management/application/dto/quiz-settings.dto.ts`
- Создать: `src/modules/quiz-management/interfaces/http/mappers/quiz-response.mapper.ts`
- Создать: `src/modules/quiz-management/application/quiz.facade.ts`
- Создать: `test/unit/quiz-management/application/create-quiz.handler.spec.ts`

**Действия:**
1. `CreateQuizCommand { title, questions, authorId }` — application DTO, не HTTP
2. `CreateQuizHandler`: command → domain entity → validate → repository → `QuizDto`
3. `QuizResponseMapper` (interfaces layer): `QuizDto` → `IQuizResponse` (HTTP)
4. Убрать `QuizModel` import из application
5. `QuizFacade` — Strangler proxy с feature flag `USE_MODULAR_QUIZ`
6. Unit-тесты handlers с mock repository

**Результат:** Quiz CRUD через command/query handlers, application не знает о HTTP.

**Критерии успеха:**
- Application не импортирует `@interfaces`
- `CreateQuizHandler` тестируется изолированно
- Feature flag переключает старый/новый путь

**Риски:**
- Большой scope update handler → разбить на sub-handlers (add questions, update questions, delete questions)

**Зависимости:** Этапы 1, 4

**Коммит:** `feat(quiz-management): split QuizService into command/query handlers`

---

### Этап 6: Quiz Execution — Выделение модуля (3 дня)

**Цель:** Вынести execution-логику в отдельный модуль.

**Файлы:**
- Создать: `src/modules/quiz-execution/domain/services/answer-evaluator.interface.ts`
- Создать: `src/modules/quiz-execution/domain/services/answer-evaluators/` (перенос)
- Создать: `src/modules/quiz-execution/domain/repositories/question-read.repository.port.ts`
- Создать: `src/modules/quiz-execution/application/commands/evaluate-answer.command.ts`
- Создать: `src/modules/quiz-execution/application/commands/start-quiz.command.ts`
- Создать: `src/modules/quiz-execution/application/commands/finish-quiz.command.ts`
- Создать: `src/modules/quiz-execution/application/handlers/evaluate-answer.handler.ts`
- Создать: `src/modules/quiz-execution/application/handlers/start-quiz.handler.ts`
- Создать: `src/modules/quiz-execution/application/handlers/finish-quiz.handler.ts`
- Создать: `src/modules/quiz-execution/infrastructure/persistence/repositories/prisma-question-read.repository.ts`
- Создать: `src/modules/quiz-execution/interfaces/http/controllers/quiz-execute.controller.v2.ts`
- Создать: `src/modules/quiz-execution/quiz-execution.module.ts`
- Создать: `test/unit/quiz-execution/domain/answer-evaluators/single-choise.evaluator.spec.ts`

**Действия:**
1. Перенести `startQuiz`/`finishQuiz` из `QuizRepository` port в `QuizExecutionRepository` port
2. `EvaluateAnswerHandler`: load question config → domain evaluator → result
3. Evaluators работают с domain `QuestionConfig`, не с Prisma JSON
4. `QuestionReadRepository` — read-only port, возвращает domain types
5. Feature flag `USE_MODULAR_EXECUTION`
6. Unit-тесты для каждого evaluator

**Результат:** Execution изолирован, evaluators тестируемы без БД.

**Критерии успеха:**
- Evaluator unit-тесты без Prisma
- `startQuiz`/`finishQuiz` убраны из quiz-management repository port
- E2E: execute flow работает через v2

**Риски:**
- Prisma JSON config → mapper в infrastructure converts JSON → domain QuestionConfig

**Зависимости:** Этапы 4, 5

**Коммит:** `feat(quiz-execution): extract execution module with domain evaluators`

---

### Этап 7: Infrastructure Consolidation + DI Modules (3 дня)

**Цель:** Перенести infra-реализации в модули, обновить DI wiring.

**Файлы:**
- Создать: `src/modules/quiz-management/infrastructure/persistence/repositories/prisma-quiz.repository.ts`
- Создать: `src/modules/quiz-management/infrastructure/persistence/mappers/quiz.mapper.ts`
- Создать: `src/modules/quiz-management/infrastructure/persistence/mappers/question.mapper.ts`
- Создать: `src/modules/quiz-management/quiz-management.module.ts`
- Изменить: `src/composition/index.ts` → загружать module containers
- Изменить: `src/main.ts` → загружать `app.module.ts`
- Перенести: `src/interfaces/http/common/hash.service.ts` → `src/modules/identity-access/infrastructure/hash/`

**Действия:**
1. Перенести Prisma repositories в соответствующие модули
2. Mappers: убрать HTTP DTO imports → маппят Prisma ↔ domain only
3. HTTP mappers (interfaces layer): domain/application DTO ↔ HTTP DTO
4. Каждый модуль экспортирует свой `ContainerModule`
5. `app.module.ts` загружает все module containers

**Результат:** Полная модульная infra, mappers не знают о HTTP.

**Критерии успеха:**
- `infrastructure/` mappers не импортируют `@interfaces`
- `npm run build` успешно
- Все e2e тесты проходят

**Риски:**
- DI symbol conflicts → namespace per module (`QUIZ_MGMT_TYPES`, `QUIZ_EXEC_TYPES`)

**Зависимости:** Этапы 3, 5, 6

**Коммит:** `refactor: consolidate infrastructure into modules, update DI wiring`

---

### Этап 8: Cleanup — Удаление legacy кода (3 дня)

**Цель:** Удалить старые слои, включить feature flags по умолчанию.

**Файлы:**
- Удалить: `src/domain/` (после полного переноса)
- Удалить: `src/application/` (после полного переноса)
- Удалить: `src/infrastructure/` (после полного переноса)
- Удалить: старые controllers (v1)
- Удалить: `src/composition/auth.module.ts`, `quiz.module.ts`, `user.module.ts` (заменены module containers)
- Удалить: re-exports из `src/config/`, `src/logger/`, `src/error/`
- Изменить: feature flags defaults → `true`
- Обновить: `tsconfig.json` path aliases
- Обновить: `README` (если есть)

**Действия:**
1. Включить все feature flags → прогнать полный e2e suite
2. Удалить legacy code
3. Удалить re-exports
4. Обновить path aliases: `@modules/*`
5. Финальный e2e regression

**Результат:** Чистая модульная архитектура, legacy удалён.

**Критерии успеха:**
- 0 файлов в `src/domain/`, `src/application/`, `src/infrastructure/` (кроме shared)
- Все feature flags = true
- E2E suite green
- ESLint boundaries — 0 violations

**Риски:**
- Missed import → CI lint + build catch
- Rollback plan: feature flags = false reverts to legacy (если не удалён)

**Зависимости:** Все предыдущие этапы

**Коммит:** `refactor: remove legacy layered code, enable modular architecture`

---

## 4. Strangler Fig стратегия

### Принцип

Старый и новый код живут параллельно. Переключение — через feature flags и версионирование API (`/api/v1/` vs `/api/v2/`). Каждый этап добавляет новый код, не ломая старый.

### Фазы

```
Фаза 1 (Этапы 1-3):     [Legacy Auth] ←→ [New Auth Module]
                         v1 routes          v2 routes

Фаза 2 (Этапы 4-5):     [Legacy Quiz]  ←→ [New Quiz Module]
                         v1 routes          v2 routes

Фаза 3 (Этап 6):        [Legacy Execution] ←→ [New Execution Module]

Фаза 4 (Этапы 7-8):     Feature flags ON → удаление legacy
```

### Пример: AuthFacade (Strangler Proxy)

```typescript
// src/modules/identity-access/application/auth.facade.ts
import { inject, injectable } from 'inversify';
import type { IAuthService } from '@application/auth/auth.service.interface'; // legacy
import type { LoginHandler } from './handlers/login.handler';
import type { RegisterHandler } from './handlers/register.handler';
import type { FeatureFlagsService } from '@shared/feature-flags/feature-flags.service';
import type { IAuthRequestResponse } from './dto/auth-result.dto';

@injectable()
export class AuthFacade {
  constructor(
    @inject('LEGACY_AUTH_SERVICE') private readonly legacyAuth: IAuthService,
    @inject('LOGIN_HANDLER') private readonly loginHandler: LoginHandler,
    @inject('REGISTER_HANDLER') private readonly registerHandler: RegisterHandler,
    @inject('FEATURE_FLAGS') private readonly flags: FeatureFlagsService,
  ) {}

  async login(email: string, password: string): Promise<IAuthRequestResponse> {
    if (this.flags.isEnabled('USE_MODULAR_AUTH')) {
      return this.loginHandler.execute({ email, password });
    }
    return this.legacyAuth.login(email, password);
  }

  async register(email: string, password: string): Promise<IAuthRequestResponse> {
    if (this.flags.isEnabled('USE_MODULAR_AUTH')) {
      return this.registerHandler.execute({ email, password });
    }
    return this.legacyAuth.register(email, password);
  }
}
```

### Маршрутизация: v1 + v2 параллельно

```typescript
// src/app.ts (упрощённо)
// v1 — legacy controllers (существующие)
app.use('/api/auth', legacyAuthController.router);
app.use('/api/quiz', legacyQuizController.router);

// v2 — new modular controllers
app.use('/api/v2/auth', newAuthController.router);
app.use('/api/v2/quiz', newQuizController.router);
app.use('/api/v2/quiz-execute', newQuizExecuteController.router);
```

### Переключение prod

1. **Dev/Staging:** `USE_MODULAR_AUTH=true` → тестируем v2
2. **Canary:** v1 routes через `AuthFacade` с flag=true → shadow testing
3. **Prod:** flag=true для всех → мониторинг 24h
4. **Cleanup:** удаление v1 routes и legacy code

### Feature Flags конфигурация

```typescript
// src/shared/feature-flags/feature-flags.service.ts
export class FeatureFlagsService {
  private readonly flags = new Map<string, boolean>([
    ['USE_MODULAR_AUTH', process.env.FF_MODULAR_AUTH === 'true'],
    ['USE_MODULAR_QUIZ', process.env.FF_MODULAR_QUIZ === 'true'],
    ['USE_MODULAR_EXECUTION', process.env.FF_MODULAR_EXECUTION === 'true'],
  ]);

  isEnabled(flag: string): boolean {
    return this.flags.get(flag) ?? false;
  }
}
```

---

## 5. План тестирования

### Стратегия по этапам

| Этап | Unit Tests | Integration Tests | E2E Tests |
|------|-----------|-------------------|-----------|
| 1. Shared Kernel | `FeatureFlagsService` | — | Существующий auth e2e |
| 2. IA Domain | `User.entity`, `Email.vo`, `Password.vo` | — | Существующий auth e2e |
| 3. IA Application | `LoginHandler`, `RegisterHandler` (mock repo) | `PrismaUserRepository` (test DB) | `auth.v2.e2e-spec.ts` |
| 4. Quiz Domain | `QuizEntity`, `QuestionConfig*`, `QuizOwnershipPolicy` | — | Существующие e2e |
| 5. Quiz Application | `CreateQuizHandler`, `UpdateQuizHandler` (mock repo) | `PrismaQuizRepository` (test DB) | `quiz.v2.e2e-spec.ts` |
| 6. Quiz Execution | `AnswerEvaluators` (all types) | `QuestionReadRepository` | `quiz-execute.v2.e2e-spec.ts` |
| 7. Infra Consolidation | — | All repositories (test DB) | Full regression |
| 8. Cleanup | — | — | Full regression |

### Unit-тесты domain (приоритет)

```
test/unit/
├── identity-access/
│   └── domain/
│       ├── user.entity.spec.ts
│       ├── email.vo.spec.ts
│       └── password.vo.spec.ts
├── quiz-management/
│   └── domain/
│       ├── quiz.entity.spec.ts
│       ├── question.entity.spec.ts
│       └── question-configs/
│           ├── single-choise.spec.ts
│           ├── multiple-choise.spec.ts
│           ├── input-value.spec.ts
│           └── order-values.spec.ts
└── quiz-execution/
    └── domain/
        └── answer-evaluators/
            ├── single-choise.evaluator.spec.ts
            ├── multiple-choise.evaluator.spec.ts
            ├── input-value.evaluator.spec.ts
            └── order-values.evaluator.spec.ts
```

### Регрессионное тестирование

1. **После каждого этапа:** `npm run test:e2e` — все e2e must pass
2. **Перед cleanup (этап 8):** полный regression suite:
   - Auth: register, login, refresh, invalid credentials
   - Quiz CRUD: create, update, delete, get by id, get by author
   - Quiz settings: update settings, available periods
   - Quiz execution: get quiz, get questions, evaluate answer, start, finish
   - Ownership: unauthorized access → 403
   - Validation: invalid data → 422
3. **Contract tests:** v1 и v2 endpoints возвращают идентичные response shapes
4. **CI:** `npm run test` (unit) + `npm run test:e2e` на каждый PR

### Jest конфигурация (добавить)

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/unit'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
  },
};
```

---

## 6. Примеры рефакторинга

### Пример 1: `auth.service.ts` → Identity & Access Module

**До (текущий код):**

```typescript
// src/application/auth/auth.service.ts
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(USER_TYPES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(AUTH_TYPES.TOKEN_SERVICE) private readonly tokenService: ITokenService,
    @inject(APP_TYPES.HASH_SERVICE) private readonly hashService: IHashService,
  ) {}

  public async login(email: string, password: string): Promise<IAuthRequestResponse> {
    const user: UserModel | null = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new HttpError(422, 'wrong email or password', 'AuthService');
    }
    const isPasswordValid = await this.hashService.verifyHash(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(422, 'wrong email or password', 'AuthService');
    }
    const tokenPayload = toTokenPayload(user);
    return { ...this.tokenService.generateAuthTokens(tokenPayload), user: tokenPayload };
  }
}
```

**Проблемы:**
- Зависит от `IUserRepository` (infrastructure), не domain port
- Работает с `UserModel` (Prisma), не domain entity
- Бизнес-логика (проверка пароля, валидация) в application service
- Бросает `HttpError` — привязка к HTTP

**После:**

```typescript
// domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: UserId,
    private email: Email,
    private passwordHash: string,
  ) {}

  static async register(email: Email, password: Password, hasher: PasswordHasher): Promise<User> {
    return new User(UserId.generate(), email, await hasher.hash(password.value));
  }

  async verifyPassword(plain: Password, hasher: PasswordHasher): Promise<boolean> {
    return hasher.verify(plain.value, this.passwordHash);
  }
}

// application/handlers/login.handler.ts
@injectable()
export class LoginHandler {
  constructor(
    @inject(IA_TYPES.USER_REPOSITORY) private readonly userRepo: UserRepository,
    @inject(IA_TYPES.TOKEN_SERVICE) private readonly tokenService: TokenService,
    @inject(IA_TYPES.PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResultDto> {
    const email = Email.of(command.email);
    const password = Password.of(command.password);

    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await user.verifyPassword(password, this.hasher))) {
      throw new InvalidCredentialsError();
    }

    const tokens = this.tokenService.generate(user.id);
    return AuthResultDto.from(user, tokens);
  }
}

// interfaces/http/controllers/auth.controller.v2.ts
async login(req: Request, res: Response): Promise<void> {
  try {
    const result = await this.loginHandler.execute({
      email: req.body.email,
      password: req.body.password,
    });
    this.ok(res, AuthResponseMapper.toHttp(result));
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      throw new HttpError(422, 'wrong email or password');
    }
    throw error;
  }
}
```

**Почему лучше:**
- Domain entity содержит бизнес-логику (`verifyPassword`)
- Application handler — тонкий orchestrator
- Domain errors → HTTP errors маппятся в interfaces layer
- `UserRepository` port в domain, `PrismaUserRepository` в infrastructure
- `Email`, `Password` — value objects с валидацией
- Handler тестируется с mock repository без БД

---

### Пример 2: `quiz.repository.port.ts` → Clean Domain Port

**До (текущий код):**

```typescript
// src/domain/quiz/ports/quiz.repository.port.ts
import type { QuizModel } from '@prisma/client';

export interface QuizRepository {
  create(data: IQuizEntity): Promise<IQuizEntity>;
  update(...): Promise<IQuizEntity>;
  findById(id: string): Promise<IQuizEntity | null>;
  startQuiz(quizId: string): Promise<QuizModel>;   // ← Prisma type!
  finishQuiz(quizId: string): Promise<QuizModel>;   // ← Prisma type!
}
```

**Проблемы:**
- Port импортирует `QuizModel` из Prisma — domain зависит от ORM
- `startQuiz`/`finishQuiz` — ответственность execution, не management
- `string` id вместо `QuizId`

**После:**

```typescript
// modules/quiz-management/domain/repositories/quiz.repository.port.ts
import type { Quiz } from '../entities/quiz.entity';
import type { QuizId } from '../value-objects/quiz-id.vo';
import type { UserId } from '@modules/identity-access/domain/value-objects/user-id.vo';

export interface QuizRepository {
  save(quiz: Quiz): Promise<Quiz>;
  findById(id: QuizId): Promise<Quiz | null>;
  findByAuthor(authorId: UserId): Promise<Quiz[]>;
  delete(id: QuizId): Promise<void>;
}

// modules/quiz-execution/domain/repositories/quiz-execution.repository.port.ts
export interface QuizExecutionRepository {
  startQuiz(id: QuizId): Promise<ExecutableQuiz>;
  finishQuiz(id: QuizId): Promise<ExecutableQuiz>;
  findForExecution(id: QuizId): Promise<ExecutableQuiz | null>;
}
```

**Почему лучше:**
- 0 зависимостей от Prisma в domain
- Разделение ответственности: management vs execution
- Value Objects (`QuizId`, `UserId`) вместо примитивов
- Каждый port — одна причина для изменения (ISP)

---

### Пример 3: `answer-evaluation.service.ts` → Domain Evaluators

**До (текущий код):**

```typescript
// src/application/quiz/execution/answer-evaluation.service.ts
@injectable()
export class AnswerEvaluationService {
  constructor(
    @inject(QUIZ_TYPES.QUESTION_REPOSITORY) private readonly questionRepository: IQuestionRepository
  ) {}

  async evaluateAnswer(quizId: string, questionId: string, submittedAnswer: unknown) {
    const questionModel: QuizQuestionModel | null = await this.questionRepository.getQuestion(quizId, questionId);
    if (!questionModel) throw new HttpError(404, 'question_not_found');

    const config = questionModel.config; // Prisma JSON
    // ... manual JSON parsing and type checking ...
    return { correct: evaluateAnswer(questionType, config, submittedAnswer) };
  }
}
```

**Проблемы:**
- Работает с Prisma model напрямую
- Парсит JSON config в application layer
- Зависит от infrastructure repository interface
- Evaluators — domain logic, но живут в application

**После:**

```typescript
// modules/quiz-execution/domain/services/answer-evaluators/single-choise.evaluator.ts
export class SingleChoiceEvaluator implements AnswerEvaluator {
  evaluate(config: SingleChoiceConfig, answer: SubmittedAnswer): boolean {
    return config.correctAnswerId === answer.value;
  }
}

// modules/quiz-execution/application/handlers/evaluate-answer.handler.ts
@injectable()
export class EvaluateAnswerHandler {
  constructor(
    @inject(QE_TYPES.QUESTION_READ_REPO) private readonly questionRepo: QuestionReadRepository,
    @inject(QE_TYPES.EVALUATOR_REGISTRY) private readonly evaluators: EvaluatorRegistry,
  ) {}

  async execute(command: EvaluateAnswerCommand): Promise<EvaluationResultDto> {
    const question = await this.questionRepo.findById(
      QuizId.of(command.quizId),
      QuestionId.of(command.questionId),
    );
    if (!question) throw new QuestionNotFoundError();

    const evaluator = this.evaluators.getFor(question.config.type);
    const isCorrect = evaluator.evaluate(question.config, SubmittedAnswer.of(command.answer));

    return new EvaluationResultDto(isCorrect);
  }
}

// modules/quiz-execution/infrastructure/persistence/repositories/prisma-question-read.repository.ts
@injectable()
export class PrismaQuestionReadRepository implements QuestionReadRepository {
  async findById(quizId: QuizId, questionId: QuestionId): Promise<QuestionReadModel | null> {
    const row = await this.prisma.quizQuestionModel.findFirst({ where: { ... } });
    if (!row) return null;
    return QuestionMapper.toReadModel(row); // Prisma JSON → domain QuestionConfig
  }
}
```

**Почему лучше:**
- Evaluators — чистый domain, тестируются без БД
- JSON parsing — в infrastructure mapper, не в application
- `QuestionReadRepository` — read-only port, возвращает domain types
- Handler — тонкий orchestrator
- `SubmittedAnswer` VO валидирует входные данные

---

## 7. Cheat Sheet для команды

### Куда класть X?

| Что | Куда | Пример |
|-----|------|--------|
| **Валидация входных данных (HTTP)** | `interfaces/http/dto/` + class-validator | `quiz-create.dto.ts` |
| **Валидация бизнес-правил** | `domain/entities/` или `domain/value-objects/` | `QuizEntity.validate()` |
| **Валидация формата (email, id)** | `domain/value-objects/` | `Email.of(value)` |
| **Транзакции** | `application/handlers/` (orchestration) | `CreateQuizHandler` |
| **Логирование** | `shared/logger/` | `LoggerService` |
| **Кэш** | `infrastructure/cache/` | `RedisQuizCache` |
| **Конфиги** | `shared/config/` | `ConfigService` |
| **Миграции БД** | `prisma/migrations/` (вне модулей) | `prisma/schema.prisma` |
| **ORM entities** | `infrastructure/persistence/orm-entities/` | Prisma models (generated) |
| **Domain entities** | `domain/entities/` | `quiz.entity.ts` |
| **HTTP → Domain mapping** | `interfaces/http/mappers/` | `quiz-response.mapper.ts` |
| **Prisma → Domain mapping** | `infrastructure/persistence/mappers/` | `quiz.mapper.ts` |
| **Бизнес-ошибки** | `domain/errors/` | `QuizNotOwnedError` |
| **HTTP-ошибки** | `shared/error/` | `HttpError`, `HttpValidationError` |
| **Middleware** | `interfaces/http/middlewares/` | `auth.guard.ts` |
| **Feature flags** | `shared/feature-flags/` | `FeatureFlagsService` |
| **Domain events** | `domain/events/` | `QuizCreatedEvent` |
| **Event handlers** | `application/event-handlers/` | `OnQuizCreatedHandler` |
| **DI модули** | `[module-name].module.ts` (корень модуля) | `quiz-management.module.ts` |
| **Тесты unit** | `test/unit/[module-name]/` | `quiz.entity.spec.ts` |
| **Тесты e2e** | `test/e2e/` | `quiz.v2.e2e-spec.ts` |

### Конвенции именования файлов

| Тип | Паттерн | Пример |
|-----|---------|--------|
| Entity | `[name].entity.ts` | `quiz.entity.ts` |
| Value Object | `[name].vo.ts` | `quiz-id.vo.ts` |
| Repository port | `[name].repository.port.ts` | `quiz.repository.port.ts` |
| Repository impl | `prisma-[name].repository.ts` | `prisma-quiz.repository.ts` |
| Command | `[action]-[entity].command.ts` | `create-quiz.command.ts` |
| Query | `get-[entity]-by-[param].query.ts` | `get-quiz-by-id.query.ts` |
| Handler | `[action]-[entity].handler.ts` | `create-quiz.handler.ts` |
| Controller | `[name].controller.ts` | `quiz.controller.ts` |
| DTO (HTTP) | `[name]-[action].dto.ts` | `quiz-create.dto.ts` |
| DTO (Application) | `[name].dto.ts` | `quiz.dto.ts` |
| Mapper (infra) | `[name].mapper.ts` | `quiz.mapper.ts` |
| Mapper (HTTP) | `[name]-response.mapper.ts` | `quiz-response.mapper.ts` |
| Error | `[description].error.ts` | `quiz-not-owned.error.ts` |
| Event | `[entity]-[action].event.ts` | `quiz-created.event.ts` |
| Policy | `[name].policy.ts` | `quiz-ownership.policy.ts` |
| Module | `[module-name].module.ts` | `quiz-management.module.ts` |
| Facade (Strangler) | `[name].facade.ts` | `auth.facade.ts` |
| Test | `[name].spec.ts` | `quiz.entity.spec.ts` |
| E2E Test | `[name].e2e-spec.ts` | `auth.v2.e2e-spec.ts` |

### Правила импортов

```
✅ РАЗРЕШЕНО
  interfaces  → application, shared
  application → domain (своего модуля), shared
  application → domain ports других модулей (только ports/ и value-objects/)
  infrastructure → domain, shared
  domain → shared (только чистые типы)
  любой → shared

❌ ЗАПРЕЩЕНО
  domain → application, infrastructure, interfaces
  domain → @prisma, inversify, express
  application → infrastructure, interfaces
  infrastructure → application, interfaces
  модуль A → внутренности модуля B (только ports и VOs)
```

### Path Aliases (целевые)

```json
{
  "@shared/*": ["./src/shared/*"],
  "@modules/*": ["./src/modules/*"],
  "@composition/*": ["./src/composition/*"]
}
```

---

## 8. Метрики контроля

| Метрика | Текущее | Цель (после рефакторинга) | Как измерять |
|---------|---------|---------------------------|--------------|
| DDD-зрелость (средний балл) | 4.5/10 | ≥ 8/10 | Повторный аудит |
| Unit test coverage (domain) | 0% | ≥ 80% | `jest --coverage` |
| Unit test coverage (application) | 0% | ≥ 70% | `jest --coverage` |
| E2E tests | 1 | ≥ 15 | `find test/e2e -name "*.ts" \| wc -l` |
| Domain purity violations | 4 файла | 0 | ESLint `no-restricted-imports` |
| Prisma imports in domain | 1 | 0 | `grep -r "@prisma" src/modules/*/domain/` |
| HTTP imports in application | 3+ файла | 0 | `grep -r "@interfaces" src/modules/*/application/` |
| Unused abstractions | 3 (UserRepo port, QuizId, QuizOwnershipPolicy) | 0 | Code review |
| Feature flags | 0 | 3 | `FeatureFlagsService` |
| Legacy files remaining | 124 | 0 (в старых слоях) | `find src/domain src/application src/infrastructure -name "*.ts"` |
| Max file length | 139 строк | ≤ 150 строк | `wc -l` |
| Modules count | 0 | 4 (+ shared) | `ls src/modules/` |
| Commits per stage | — | 1 | Git log |

---

## 9. Риски и их митигация

| # | Риск | Вероятность | Влияние | Митигация |
|---|------|:-----------:|:-------:|-----------|
| 1 | Сломанные e2e при миграции | Высокая | Высокое | Strangler Fig: старый код работает параллельно. E2E на каждый PR |
| 2 | DI wiring errors при переносе модулей | Средняя | Среднее | Поэтапная миграция, feature flags для rollback |
| 3 | Scope creep (рефакторинг затягивается) | Высокая | Среднее | Этапы ≤ 4 дней, ≤ 5 файлов за раз. Строгий scope per stage |
| 4 | Команда не знакома с DDD patterns | Средняя | Среднее | Cheat Sheet (секция 7), pair programming на первых этапах |
| 5 | Дублирование кода (legacy + new) | Высокая | Низкое | Временное. Cleanup на этапе 8. Facade минимизирует дубли |
| 6 | Prisma schema changes во время рефакторинга | Низкая | Высокое | Freeze schema changes. Миграции — только critical fixes |
| 7 | Performance regression | Низкая | Среднее | Facade добавляет 1 if-check. Benchmark на staging |
| 8 | Недостаток тестов → regression | Высокая | Высокое | Писать unit-тесты ДО рефакторинга (этап 2-4). Contract tests v1 vs v2 |
| 9 | Merge conflicts при параллельной работе | Средняя | Среднее | Каждый этап — отдельный модуль. Разные разработчики → разные модули |
| 10 | Откат невозможен после cleanup | Низкая | Высокое | Feature flags остаются до полной стабилизации. Git tags per stage |

---

## 10. Заключение

### Резюме

Проект **quiz-server** находится на ранней стадии DDD-зрелости (4.5/10). Уже сделаны правильные шаги:
- Горизонтальное разделение на слои (domain, application, infrastructure, interfaces)
- DI через Inversify с composition modules
- Богатый quiz domain (entities, question configs, validation, policies)
- Repository port для Quiz

Однако архитектура **слойная, а не модульная** — код организован по техническим слоям, а не по бизнес-контекстам. Ключевые проблемы:
- **Утечки зависимостей:** Prisma types в domain ports, HTTP DTO в application, HttpError в domain
- **Анемичный user domain:** вся auth-логика в `AuthService`
- **Orphaned abstractions:** `QuizId`, `UserId`, `UserRepository` port, `QuizOwnershipPolicy` — созданы, но не используются
- **Нулевое тестовое покрытие:** 0 unit-тестов, 1 e2e
- **Отсутствие domain events**

### Рекомендации

1. **Начать с этапов 1-3 (Shared Kernel + Identity & Access)** — наименьший scope, максимальный learning effect для команды
2. **Писать unit-тесты ДО рефакторинга** — зафиксировать текущее поведение, затем менять структуру
3. **Не удалять legacy до этапа 8** — Strangler Fig обеспечивает безопасность
4. **Параллелить этапы 4-5 (Quiz Domain) и 3 (IA Application)** — разные модули, разные разработчики
5. **Внедрить ESLint import boundaries на этапе 1** — предотвратить новые violations
6. **Оценочная длительность:** 24 рабочих дня (~5 недель) для 1 разработчика, ~3 недели для 2 разработчиков

### Ожидаемый результат

После завершения всех 8 этапов:
- 4 изолированных модуля + Shared Kernel
- Domain purity: 0 framework imports
- ≥ 80% unit test coverage domain
- Feature flags удалены, legacy удалён
- DDD-зрелость: ≥ 8/10
- Каждый модуль — потенциальный микросервис (если потребуется)
