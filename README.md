# Web Onboarding with Stripe Payment

Веб-онбординг із динамічним сценарієм (flow), валідацією контактних даних та інтеграцією зі Stripe (3D Secure, редіректи, захист від повторних списань).

---

## 🛠 Стек технологій

- **Core:** React 19, TypeScript (strict), Vite 8
- **State:** Redux Toolkit, Redux Persist (localStorage)
- **Routing & Optimization:** React Router v7, React.lazy + Suspense, prefetching наступного кроку
- **Styling:** styled-components (централізована тема)
- **Payments:** Stripe Elements (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **i18n & Validation:** react-i18next, Zod, libphonenumber-js
- **Code Quality:** ESLint, Prettier

---

## 🚀 Як запустити проєкт локально

### 1. Бекенд (`backend/`)

Потрібен **Node.js >= 22.9**.

```bash
cd ../backend
npm install
cp .env.example .env     # вказати тестові ключі STRIPE_PUBLISHABLE_KEY та STRIPE_SECRET_KEY
npm run dev              # запускається на http://localhost:4242
```

### 2. Фронтенд (`frontend/`)

```bash
npm install
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:4242
npm run dev              # доступний на http://localhost:5173
```

### 3. Перевірка сценаріїв (Flows)

- **Default:** `http://localhost:5173/` (або `?flow=default`) — повний ланцюжок.
- **Short:** `http://localhost:5173/?flow=short` — скорочений флоу.
- **Experimental:** `http://localhost:5173/?flow=experimental` — перевірка фільтрації невідомих екранів.

### 4. Скрипти

- `npm run build` — перевірка типів і production-збірка.
- `npm run lint` / `npm run lint:fix` — перевірка та автофікс ESLint.
- `npm run format` / `npm run format:check` — форматування коду Prettier.

---

## 🏗 Структура проєкту та чому вона саме така

Використано модульну структуру, натхненну FSD:

```
src/
├── app/                  # Конфігурація додатка (роутер, стор, тема, i18n)
│   ├── i18n/             # Ініціалізація react-i18next
│   ├── router/           # AppRouter, flowRegistry, screenRegistry, screenPreloader
│   ├── store/            # store, hooks, persistConfig (Redux Persist)
│   └── styles/           # theme, GlobalStyles
├── features/             # Доменні модулі з ізольованою логікою
│   ├── onboarding/       # Телефон (E.164), Email (Zod), Квізи, useFlowNavigation, flowApi
│   └── checkout/         # Тарифи, Stripe Elements (PaymentForm), CheckoutScreen, SuccessScreen
├── locales/              # JSON-словники перекладів (en)
└── shared/               # Спільні компоненти (Button, Input, Layout, Loader) та API-клієнт
```

### Чому обрано таку архітектуру:

1. **Повна ізоляція екранів:** Екрани не залежать один від одного. Наступний крок та прогрес визначаються динамічно через `useFlowNavigation` на основі конфігурації з `GET /flow`.
2. **Стійкість до невідомих кроків:** Якщо бекенд надсилає невідомий ключ екрана, клієнт відфільтровує його через `selectSupportedFlow` без падіння додатку.
3. **Персистентність стану:** `redux-persist` зберігає всі кроки та дані в `localStorage`. Це забезпечує безшовне повернення після 3D Secure / зовнішніх редіректів та захист від випадкових повторних запитів.
4. **Оптимізація (Lazy Loading + Prefetching):** Усі екрани завантажуються динамічно через `React.lazy()`. При відкритті поточного кроку хук у роутері автоматично завантажує бандл наступного кроку (`preloadScreen`), забезпечуючи миттєвий перехід.
5. **Захищений роутинг:** Навігація використовує `replace: true` (щоб кнопка «Назад» не ламала стан), query-параметри автоматично зберігаються, а доступ до `success` перевіряється через прямий запит до бекенда (`GET /payments/:id`).

---

## ➕ Як додати новий екран

1. **Створити компонент екрана:**  
   Створіть екран у `src/features/onboarding/screens/` із використанням `ScreenLayout` та хука `useFlowNavigation()`:
    ```tsx
    export function NewStepScreen() {
        const { goToNextStep } = useFlowNavigation();
        return (
            <ScreenLayout title="Title" description="Description">
                <Button onClick={goToNextStep}>Continue</Button>
            </ScreenLayout>
        );
    }
    ```
2. **Додати ключ екрана до `flowRegistry.ts`:**
    ```ts
    // src/app/router/flowRegistry.ts
    new_step: { path: "/new_step", title: "New Step" },
    ```
3. **Зареєструвати lazy-компонент у `screenRegistry.tsx`:**
    ```tsx
    // src/app/router/screenRegistry.tsx
    new_step: lazy(() => import("@/features/onboarding/screens/...").then(m => ({ default: m.NewStepScreen }))),
    ```
4. **Додати функцію прелоадера в `screenPreloader.ts`:**
    ```ts
    // src/app/router/screenPreloader.ts
    new_step: () => import("@/features/onboarding/screens/..."),
    ```
5. _(Опційно)_ Додати переклади до `src/locales/en/` та поле в `onboardingSlice.ts`, якщо екран зберігає дані.

---

## 🔮 Що не встигли і що зробили б далі

1. **Автоматизоване тестування:**
    - Unit-тести для селекторів та редюсерів (`Vitest`).
    - Інтеграційні тести форм і валідацій (`React Testing Library`).
    - E2E-тести сценаріїв оплати Stripe (успіх, 3DS, відмова) за допомогою `Playwright`.
2. **Шар аналітики:**
    - Інтеграція єдиного клієнта аналітики для відстеження переглядів екранів (`screen_view`) та ключових дій (вибір тарифу, спроби оплати).
3. **Додаткові локалі:**
    - Інфраструктура i18n готова; варто додати переклад українською (`uk`) та перемикач мови.
4. **Стійкість до збоїв мережі (Network Resilience):**
    - Додавання автоматичного retry з exponential backoff для повторних спроб перевірки статусу платежу та завантаження конфігурації.
