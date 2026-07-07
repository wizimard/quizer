# Quiz Management

Модуль отвечает за **создание и управление квизами** — жизненный цикл викторины со стороны автора: CRUD квизов и вопросов, настройки, расписание доступности, ручной запуск и завершение сессии.

Прохождение квиза участниками (ответы, оценка, сессии) вынесено в отдельный модуль [`quiz-execution`](../quiz-execution/). `quiz-management` предоставляет ему доменные сущности и типы через публичный `index.ts`.

## Ответственность

| Область | Описание |
|---|---|
| Квизы | Создание, чтение, обновление, удаление; список квизов текущего пользователя |
| Вопросы | CRUD вопросов внутри квиза |
| Настройки | Обязательные поля участника, показ ответов после завершения |
| Доступность | Периоды, когда квиз открыт по расписанию; досрочное закрытие периода |
| Сессии | Эндпоинты `start` / `finish` делегируют в `QuizSessionService` из `quiz-execution` |
| Валидация | Проверка структуры квиза и конфигурации вопросов на уровне домена |

## API

Маршруты регистрируются в [`app.ts`](../../app/app.ts):

| Префикс | Контроллер |
|---|---|
| `/api/quiz` | `QuizController` |
| `/api/question` | `QuestionController` |

### Квизы (`/api/quiz`)

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/` | Список квизов автора |
| `POST` | `/` | Создать квиз |
| `GET` | `/:quizId` | Получить квиз по id |
| `PATCH` | `/:quizId` | Обновить название |
| `DELETE` | `/:quizId` | Удалить квиз |
| `PATCH` | `/:quizId/settings` | Обновить настройки |
| `PATCH` | `/:quizId/settings/available-periods` | Управление периодами доступности |
| `PATCH` | `/:quizId/settings/available-periods/:periodId/close` | Закрыть период досрочно |
| `POST` | `/:quizId/start` | Запустить квиз вручную |
| `POST` | `/:quizId/finish` | Завершить активную сессию |

### Вопросы (`/api/question`)

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/:quizId/questions` | Создать вопрос |
| `PATCH` | `/:quizId/questions/:questionId` | Обновить вопрос |
| `DELETE` | `/:quizId/questions/:questionId` | Удалить вопрос |

Все маршруты (кроме `GET /api/quiz/`) требуют аутентификации. Операции с конкретным квизом дополнительно проходят через `quizMiddleware` и `quizOwnershipGuard`.

## Структура папок

```
quiz-management/
├── controllers/          # HTTP-слой: маршруты и обработчики запросов
├── services/             # Бизнес-логика (QuizService, QuestionService)
├── repositories/         # Реализации доступа к данным (Prisma)
├── entities/             # Доменные сущности и value objects
│   ├── question-configs/ # Типы вопросов и их конфигурации
│   └── value-object/     # QuizId, QuestionId
├── dto/                  # DTO для валидации входящих HTTP-запросов (class-validator)
├── interfaces/           # Контракты: репозитории, input-модели, HTTP-ответы, ошибки
├── mappers/              # Преобразования между слоями
│   ├── http/             # Request/Response ↔ input/DTO
│   └── repositories/     # Entity ↔ Prisma-модели
├── middlewares/          # Загрузка квиза в req, проверка владельца
├── utils/
│   ├── errors/           # Доменные ошибки модуля
│   └── validators/       # Валидаторы квиза и конфигурации вопросов
├── quiz-management.module.ts  # DI-регистрация (Inversify ContainerModule)
├── quiz-management.types.ts   # Symbol-идентификаторы для DI (QM_TYPES)
└── index.ts              # Публичный API модуля для других модулей
```

## Архитектура

Слои и поток данных:

```
HTTP Request
    → Controller (DTO + middleware)
    → Mapper (http) → Service input
    → Service (доменная логика, валидация)
    → Repository interface
    → Prisma Repository + persistence mapper
    → Entity
    → Mapper (http) → HTTP Response
```

- **DI**: [Inversify](https://inversify.io/) — зависимости регистрируются в `quiz-management.module.ts`, символы — в `QM_TYPES`.
- **Контроллеры** наследуют `BaseController`, маршруты объявляются в конструкторе.
- **Репозитории** зависят от интерфейсов (`QuizRepository`, `QuestionRepository`, `QuizExecutionRepository`), реализация — Prisma.

### Middleware

| Middleware | Назначение |
|---|---|
| `QuizMiddleware` | Загружает полный `QuizEntity` по `quizId` из URL в `req.quiz` |
| `QuizOwnershipGuard` | Проверяет, что `req.user` — автор квиза (`QuizEntity.assertOwnedBy`) |
| `QuestionExistsGuard` | Проверяет существование вопроса при операциях с `questionId` |

## Доменная модель

### QuizEntity

Центральная сущность квиза: id, название, автор, вопросы, настройки, сессии, статус.

**Статусы** (`TQuizStatus`):

| Статус | Условие |
|---|---|
| `manual_open` | Есть активные сессии (квиз запущен вручную) |
| `open_by_scheduler` | Текущий момент попадает в один из периодов доступности |
| `scheduler` | Есть будущие периоды, но сейчас квиз закрыт |
| `closed` | Нет активных периодов и сессий |

### QuestionEntity

Вопрос с описанием, порядком и типизированной конфигурацией (`QuestionConfigBase`). Метод `validate()` проверяет корректность конфигурации.

### Типы вопросов

Реестр в `entities/question-configs/question-config.registry.ts`:

| Тип | Класс конфигурации |
|---|---|
| `input` | `QuestionConfigInputValue` — свободный ввод |
| `single_choise` | `QuestionConfigSingleChoise` — один вариант |
| `multiple_choise` | `QuestionConfigMultipleChoise` — несколько вариантов |
| `order` | `QuestionConfigOrderValues` — расстановка по порядку |

### ExecutableQuiz

Упрощённое read-only представление квиза для модуля `quiz-execution` (id, автор, название, флаг `isOpen`).

## Зависимости

| Модуль / пакет | Использование |
|---|---|
| `identity-access` | `UserId`, аутентификация (`authGuard`, `req.user`) |
| `quiz-execution` | `QuizSessionService` для start/finish; модуль импортирует типы и сущности из `quiz-management` |
| `@shared/*` | HTTP-инфраструктура, ошибки, логирование |
| Prisma | Персистентность через репозитории |

## Публичный API (`index.ts`)

Экспортируется для использования другими модулями:

- `quizManagementModule`, `QM_TYPES` — подключение DI
- Сущности: `QuizEntity`, `QuestionEntity`, `QuizId`, `QuestionId`, `ExecutableQuiz`
- Интерфейсы репозиториев
- Ошибки: `QuizNotFoundError`, `QuizNotOwnedError`, `QuizValidationFailedError`, `UnknownQuestionTypeError`
- Реестр типов вопросов: `QUESTION_TYPES`, `createQuestionConfigFromPayload`, `isQuestionType`

## Ошибки

| Класс | Когда возникает |
|---|---|
| `QuizNotFoundError` | Квиз не найден (middleware / guard) |
| `QuizNotOwnedError` | Пользователь не является автором квиза |
| `QuizValidationFailedError` | Ошибки валидации при создании квиза |
| `QuestionNotFoundError` | Вопрос не найден при удалении |
| `UnknownQuestionTypeError` | Неизвестный тип вопроса в конфигурации |
