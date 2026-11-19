# Веб-онбординг з оплатою (Stripe Integration)

Тестове завдання: реалізація гнучкого веб-онбордингу з динамічним сценарієм (flow), валідацією контактних даних та інтеграцією платіжного шлюзу Stripe (3D Secure, редіректи, захист від повторних платежів).

---

## 🛠 Технологічний стек

- **Core:** React 19, TypeScript (strict mode), Vite 8
- **State Management:** Redux Toolkit, Redux Persist (localStorage)
- **Routing:** React Router v7
- **Styling:** styled-components (з централізованою темою та глобальними стилями)
- **Payments:** Stripe.js (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Validation & Helpers:** Zod, libphonenumber-js

---

## 🚀 Як запустити проєкт локально

### 1. Передумови

- Встановлений **Node.js** версії **>= 22.9**
- Менеджер пакетів **npm** (або pnpm / yarn)
- Тестовий акаунт у [Stripe Dashboard](https://dashboard.stripe.com/register) (активація бізнесу не потрібна, лише Test Mode)

---

### 2. Запуск бекенда

Бекенд знаходиться в сусідній директорії `backend/` та надає API поверх Stripe:

```bash
# 1. Перейдіть до папки backend
cd ../backend

# 2. Встановіть залежності
npm install

# 3. Створіть файл .env на основі .env.example
cp .env.example .env
```

Відкрийте файл `backend/.env` та вкажіть ваші тестові ключі Stripe:
```env
PORT=4242
CLIENT_ORIGIN=http://localhost:5173
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> **Важливо для перевірки редіректів:** У Stripe Dashboard перейдіть у `Settings -> Payments -> Payment methods` і переконайтеся, що для валюти `EUR` увімкнено хоча б один метод з редіректом (наприклад, iDEAL, Bancontact, Giropay чи Sofort).

Запустіть сервер:
```bash
npm run dev
# Сервер запуститься на http://localhost:4242
```

---

### 3. Запуск фронтенда

У директорії `frontend/`:

```bash
# 1. Встановіть залежності
npm install

# 2. Створіть файл .env (за потреби)
cp .env.example .env
```

Вміст `.env` для фронтенда:
```env
VITE_API_BASE_URL=http://localhost:4242
```

Запустіть dev-сервер:
```bash
npm run dev
# Застосунок буде доступний за адресою http://localhost:5173
```

---

### 4. Тестування різних сценаріїв (Flows)

Фронтенд зчитує параметр `flow` з URL-адреси та запитує відповідний сценарій з бекенда:

- **Основний флоу (за замовчуванням):**  
  `http://localhost:5173/` (або `http://localhost:5173/?flow=default`)  
  *Кроки:* `phone` ➔ `email` ➔ `quiz_single` ➔ `quiz_multi` ➔ `checkout` ➔ `success`

- **Скорочений флоу:**  
  `http://localhost:5173/?flow=short`  
  *Кроки:* `email` ➔ `checkout` ➔ `success`

- **Експериментальний флоу (перевірка невідомих екранів):**  
  `http://localhost:5173/?flow=experimental`  
  *Кроки:* містить невідомі ключі, які коректно фільтруються клієнтом без падіння інтерфейсу.

---

### 5. Інші корисні команди

```bash
# Перевірка типів та збірка production-бандла
npm run build

# Запуск лінтера (ESLint)
npm run lint

# Попередній перегляд зібраного проєкту
npm run preview
```

---

## 🏗 Опис структури проєкту та чому вона саме така

У проєкті використано модульний підхід, натхненний **Feature-Sliced Design (FSD)**. Структура побудована так, щоб мінімізувати зв'язність модулів (low coupling) і забезпечити високу згуртованість коду всередині кожної бізнес-фічі (high cohesion).

```
src/
├── app/                  # Ініціалізація та конфігурація всього застосунку
│   ├── router/           # Конфігурація роутера, мапінги екранів та route guards
│   │   ├── AppRouter.tsx         # Головні маршрути, розв'язання кроків (Resolver)
│   │   ├── flowRegistry.ts       # Опис відомих ключів екранів, шляхів та заголовків
│   │   └── screenRegistry.tsx    # Реєстрація React-компонентів для кожного ключа
│   ├── store/            # Redux Toolkit store + Redux Persist конфігурація
│   │   ├── store.ts              # Конфігурація store та типізація RootState / AppDispatch
│   │   ├── hooks.ts              # Типізовані useAppDispatch, useAppSelector
│   │   └── persistConfig.ts      # Налаштування збереження стану в localStorage
│   └── styles/           # Глобальні стилі та тема styled-components
│       ├── theme.ts              # Кольорова палітра, шрифти, відступи, радіуси
│       ├── GlobalStyles.ts       # CSS Reset та базові стилі
│       └── styled.d.ts           # Розширення типів DefaultTheme для TypeScript
│
├── features/             # Доменні модулі з власною бізнес-логікою, API та UI
│   ├── onboarding/       # Логіка кроків онбордингу, форм та опитувальника
│   │   ├── api/flowApi.ts        # Запит конфігурації флоу з бекенда (GET /flow)
│   │   ├── hooks/                # useFlowNavigation (динамічна навігація і прогрес)
│   │   ├── screens/              # Екрани онбордингу
│   │   │   ├── PhoneScreen/      # Введення телефону з кодом країни та E.164 валідацією
│   │   │   ├── EmailScreen/      # Введення email з валідацією Zod
│   │   │   ├── QuizSingleScreen/ # Питання з одиничним вибором
│   │   │   └── QuizMultiScreen/  # Питання з множинним вибором
│   │   ├── onboardingSlice.ts    # Redux слайс: телефон, email, відповіді квізу, статус флоу
│   │   ├── onboardingSelectors.ts# Селектори (progress, supportedFlow тощо)
│   │   └── onboarding.types.ts   # Типи онбордингу
│   │
│   └── checkout/         # Модуль оплати та інтеграції зі Stripe
│       ├── api/                  # API запити: plansApi, paymentsApi, paymentConfigApi
│       ├── components/           # PaymentForm (Stripe PaymentElement, 3DS, redirects)
│       ├── screens/              # CheckoutScreen, SuccessScreen
│       ├── checkoutSlice.ts      # Redux слайс: плани, створення платежу, перевірка статусу
│       └── checkout.types.ts     # Типізація планів, статусів платежів та PaymentIntent
│
└── shared/               # Перевикористовуваний код без специфічної бізнес-логіки
    ├── api/              # Базовий HTTP клієнт (Fetch wrapper), обробка помилок ApiError
    └── components/       # Спільні UI-компоненти (Button, Input, ChoiceGroup, ScreenLayout)
```

### Чому обрано саме таку архітектуру:

1. **Ізоляція екранів (Screen Independence):**
   - Жоден екран онбордингу **не знає**, який екран передує йому чи йде наступним.
   - Екран лише викликає `goToNextStep()` з хука `useFlowNavigation`. Цей хук динамічно визначає наступний крок на основі масиву екранів, отриманого з бекенда (`GET /flow`).
   - Це дозволяє легко міняти порядок екранів або додавати нові флоу на бекенді без внесення жодних правок у компоненти екранів.

2. **Захист від невідомих кроків (Graceful Degradation):**
   - Якщо бекенд повертає невідомий ключ у флоу, селектор `selectSupportedFlow` відфільтровує його, зіставляючи зі списком у `FLOW_SCREENS`. Застосунок не падає і продовжує роботу за валідними кроками.

3. **Стійкість до перезавантаження сторінки та повернення зі Stripe (State Persistence):**
   - Використано `redux-persist`. Усі введені дані (телефон, email, вибір у квізах, обраний тариф, `paymentId`, `clientSecret` та `idempotencyKey`) зберігаються в `localStorage`.
   - Завдяки цьому при поверненні користувача після 3D Secure або редірект-методів стан повністю відновлюється, а повторний клік чи перезавантаження не генерують зайвих викликів створення платежу (`POST /payments`).

4. **Правильний роутинг та збереження параметрів:**
   - Навігація між кроками виконується через `{ replace: true }`, щоб натискання кнопки «Назад» у браузері не порушувало лінійний хід онбордингу.
   - Усі query-параметри (наприклад, `?flow=short`) автоматично зберігаються при кожному переході за допомогою `location.search`.

5. **Безпека та Route Guards:**
   - Екран `Checkout` захищений перевіркою наявності валідних контактних даних (`phone`, `email`).
   - Екран `Success` закритий гардом `SuccessRouteGuard`, який завжди виконує прямий запит на бекенд (`GET /payments/:id`) для верифікації реального статусу `succeeded`, не довіряючи GET-параметрам у URL.

---

## ➕ Як додати новий екран

Завдяки розділенню обов'язків додавання нового екрана займає лічені хвилини й не потребує змін у вже існуючих екранах:

### Крок 1. Створити компонент нового екрана

Створіть папку з компонентом у `src/features/onboarding/screens/` (або в новій фічі):

```tsx
// src/features/onboarding/screens/AgeScreen/AgeScreen.tsx
import { useState } from "react";
import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { Button } from "@/shared/components/Button/Button";
import { Input } from "@/shared/components/Input/Input";
import { useFlowNavigation } from "@/features/onboarding/hooks/useFlowNavigation";

export function AgeScreen() {
  const [age, setAge] = useState("");
  const { goToNextStep } = useFlowNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age) return;

    // (Опційно) зберегти в Redux
    goToNextStep(); // автоматичний перехід до наступного екрана за флоу
  };

  return (
    <ScreenLayout
      title="How old are you?"
      description="We need your age to personalize your plan."
    >
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={!age} style={{ marginTop: 24 }}>
          Continue
        </Button>
      </form>
    </ScreenLayout>
  );
}
```

### Крок 2. (Опційно) Додати поле в Redux

Якщо новий екран збирає дані, додайте їх у стан:
1. У `src/features/onboarding/onboarding.types.ts`: додати поле у тип `OnboardingState` (наприклад, `age?: string`).
2. У `src/features/onboarding/onboardingSlice.ts`: додати редьюсер `setAge` та початкове значення.

### Крок 3. Зареєструвати ключ у `flowRegistry.ts`

Відкрийте `src/app/router/flowRegistry.ts` та додайте ключ нового екрана до константи `FLOW_SCREENS`:

```ts
export const FLOW_SCREENS = {
  // ...наявні екрани
  age: {
    path: "/age",
    title: "Age",
  },
} as const;
```

### Крок 4. Зареєструвати компонент у `screenRegistry.tsx`

Відкрийте `src/app/router/screenRegistry.tsx` і додайте мапінг ключа на компонент:

```tsx
import { AgeScreen } from "@/features/onboarding/screens/AgeScreen/AgeScreen";

export const SCREEN_REGISTRY: Record<FlowScreenKey, ComponentType> = {
  // ...наявні екрани
  age: AgeScreen,
};
```

**Готово!** Якщо бекенд повертає ключ `"age"` у масиві `screens` (у запиті `GET /flow`), новий екран автоматично:
- отримає власний URL `/:step` (`/age`);
- враховуватиметься в прогрес-барі (`ScreenLayout`);
- отримає плавний перехід без перезавантаження та зі збереженням query-параметрів.

---

## 🔮 Що не встигли і що зробили б далі

Нижче наведено перелік технічних і продуктових покращень, які було б доцільно реалізувати у наступних ітераціях:

### 1. Code Splitting та Lazy Loading екранів
- **Поточний стан:** Усі компоненти екранів імпортуються синхронно в `screenRegistry.tsx`, через що бандл містить важкі бібліотеки (Stripe, libphonenumber-js) одразу при першому завантаженні.
- **Що варто зробити:** Обернути компоненти реєстру в `React.lazy()` та додати `Suspense` з відповідним скелетоном. Додатково реалізувати функцію попереднього завантаження (prefetching) наступного екрана у списку флоу (через динамічний `import()`), щоб перехід між кроками був миттєвим.

### 2. Автоматизоване тестування (Unit, Integration, E2E)
- **Поточний стан:** Перевірка здійснювалася вручну та через типізацію TypeScript/ESLint.
- **Що варто зробити:**
  - **Unit-тести (Vitest):** для редюсерів (`onboardingSlice`, `checkoutSlice`), складних селекторів розрахунку прогресу та утиліт валідації номера телефону (E.164).
  - **Component / Integration тести (React Testing Library):** тестування поведінки помилок вводу (показ помилки тільки після початку вводу `hasEdited`), блокування кнопки сабміту за невалідних даних.
  - **E2E-тести (Playwright):** наскрізне тестування повного сценарію оплати з тестовими картками Stripe (успіх, 3D Secure, відхилена картка) та редірект-методів.

### 3. Шар аналітики (Analytics Layer)
- **Поточний стан:** Логування аналітичних подій відсутнє.
- **Що варто зробити:** Створити єдиний абстрактний сервіс аналітики (`src/shared/analytics/`) із методами `trackScreenView(screenKey, flowName)` та `trackAction(eventName, properties)`. Викликати подію показу екрана через ефект у `ScreenLayout`, а також трекати вибір тарифу, спроби та помилки оплати.

### 4. Інтернаціоналізація (i18n)
- **Поточний стан:** Тексти екранів та повідомлення про помилки частково написані англійською, частково українською.
- **Що варто зробити:** Впровадити `react-i18next` або власну легку систему локалізації. Винести всі статичні тексти, назви кнопок і помилки валідації у словники (`uk.json`, `en.json`) з можливістю перемикання мови через URL-параметр `?lang=uk`.

### 5. Покращення UX та доступності (a11y)
- **Поточний стан:** Базові accessibility-атрибути присутні (`role="progressbar"`, `aria-label`, семантичні форми).
- **Що варто зробити:**
  - Реалізувати авто-фокус на перше поле форми або заголовок при переході між екранами (`focus management`).
  - Додати повноцінні анімовані Skeleton-заглушки під час завантаження тарифних планів та ініціалізації форми Stripe.
  - Надати користувачеві можливість змінити обраний тариф або відредагувати введені контактні дані безпосередньо з екрана Checkout до генерації платежу.

### 6. Стійкість до збоїв мережі (Network Resilience)
- **Поточний стан:** При помилці запиту до бекенда користувач бачить кнопку «Спробувати ще раз».
- **Що варто зробити:** Додати автоматичний retry з експоненційною затримкою (exponential backoff) для запитів `GET /flow` та `GET /payments/:id`, а також покращити обробку мережевих помилок Stripe із конкретними підказками для користувача (наприклад, недостатньо коштів, помилка CVC).
