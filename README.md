
# PremisePool

A brief description of what this project does and who it's for

# 💡 PremisePool

**IdeaMall** (also called **PremisePool**) is a modern web app built with React and Redux Toolkit that lets users create, share, and interact with “premises” (ideas, posts, or scripts). It’s designed for collaborative content generation with comment threads, payments, and multilingual input options.

## 🚀 Overview

IdeaMall is a feature-rich idea-sharing platform where users can:

- Create and edit **premises** or projects
- Add and reply to **comments**
- Like or react to discussions
- Use **virtual multilingual keyboards** for typing in multiple languages
- Manage **user authentication and access control**
- Handle **payments** for premium actions or credits
- Enjoy **interactive UI animations** with smooth experience

The app focuses on real-time collaboration, user engagement, and accessibility for creators across languages.

## 🧠 Core Logic & Functionality

### 🏗 1. Premise Management

Located in `Components/Premisepool/` and API handlers under `app/EndPoints/premisePoolApi.js`.

- Create, edit, and manage ideas (“premises”).
- Use Redux slices like `premiseSlice.js` to manage global premise states.
- Fetch and mutate premise data via custom API endpoints.
- Includes filtering, pagination, and draft management logic.

### 💬 2. Comment & Reply System

Files:

- `AllComments.js`, `AllCommentsBackup.js`, `commentApi.js`, `reply.js`

Features:

- Nested comments and replies with like buttons and reactions.
- Uses Redux Toolkit queries to fetch and update comment threads.
- Comment like popups and inline reply logic for better UX.

### 💳 3. Payment System

Files under `Components/Payment/`

- Handles user credit packages and invoices.
- Displays payable amounts and integrates with the app’s purchase flow.
- Includes `LimitPaymentPage.jsx`, `PaymentInvoicePopup.jsx`, etc.

### 🌍 4. Multilingual Input Keyboard

Folder: `Components/Keyboard/`

- Includes prebuilt layouts for **Arabic**, **Bengali**, **Farsi**, **Chinese**, and more.
- Uses `react-simple-keyboard` for custom typing interfaces.
- Enables seamless multilingual premise and comment creation.

### 👥 5. User Authentication & State

Slices:

- `authSlice.js` — handles login, token storage, and logout.
- `userSlice.js` — stores user profile and access info.

Cookies and localStorage (via `js-cookie`) are used for maintaining sessions.

### ⚙️ 6. Global Hooks & API Integration

- All APIs managed under `app/EndPoints/` using a modular structure.
- `faseBaseQuery.js` handles base API logic (axios instance, headers, etc.).
- `Global.js` hook provides shared states or utility logic across components.

---

## 🧩 Folder Structure

```
src/
│
├── app/
│   ├── store.js              # Redux store configuration
│   ├── EndPoints/            # All API endpoints (Premise, Comments, Payment)
│   ├── Hooks/                # Reusable hooks
│   └── Slices/               # Redux slices for each feature
│
├── Components/
│   ├── Premisepool/          # Main feature (Premise creation, comments, etc.)
│   ├── Payment/              # Handles payment & package logic
│   ├── Keyboard/             # Multilingual input keyboards
│   └── utils.js              # Common reusable utilities
│
├── App.js                    # Root component
├── index.js                  # Entry point
└── index.css, App.css        # Global styles
```

## 🛠️ Tech Stack

| Category         | Tools Used                                       |
| ---------------- | ------------------------------------------------ | ---------- |
| Frontend         | React 18, Redux Toolkit                          |
| Routing          | React Router DOM                                 |
| UI/UX            | Framer Motion, DaisyUI, Tailwind CSS             |
| API              | Axios                                            |
| Auth             | js-cookie                                        |
| State Management | Redux Toolkit Slices                             | ContextAPi |
| Rich Text        | Draft.js, React Quill                            |
| Notifications    | React Toastify                                   |
| Utility          | react-draggable, react-infinite-scroll-component |
| Testing          | Jest, React Testing Library                      |

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone "URL"
cd ideamall
```

### 2. Install dependencies

```bash
npm install -f
```

### 3. Run in development mode

```bash
npm start
```

App runs on **http://localhost:3000**

### 4. Build for production

```bash
npm run build
```

## 🔑 Environment Variables

Create a `.env` file in the root and add:

```env
REACT_APP_BASE_URL=https://your-backend-api.com
REACT_APP_STRIPE_KEY=your_public_key_if_any
```

(You may add any API keys or URLs used by your endpoints.)

## ✨ Key Features

- 🧱 **Modular API architecture**
- 🧩 **Redux slices for clean state separation**
- 💬 **Nested comments and reactions**
- 💳 **Integrated payment system**
- 🌐 **Multilingual input keyboard**
- 🚀 **Performance optimized UI**
- 🔁 **Auto-refresh logic with RTK Query**
- 🧭 **Guided tours via `react-joyride`**

## 👨‍💻 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request ✅

## 🐛 Troubleshooting

| Issue                    | Possible Fix                                      |
| ------------------------ | ------------------------------------------------- |
| App not starting         | Run `npm install` again, check Node version ≥ 16  |
| API not working          | Check your `.env` base URL                        |
| Redux state not updating | Ensure correct slice import & store configuration |
| Keyboard not appearing   | Confirm `react-simple-keyboard` is installed      |

## 🧾 License

This project is licensed under **MNF**.

## 🧠 Author

**MD. Ikhtiaj Arif**  
Full Stack Developer — React, Next.js, Express, PostgreSQL, MongoDB, TypeScript

> 💬 _“Great ideas start with small premises.”_
