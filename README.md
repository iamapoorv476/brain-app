Brainly - Your Second Brain

Brainly is a digital "Second Brain" application designed to help you capture, organize, and retrieve your digital knowledge. It allows users to save important content from the web—specifically YouTube videos and Twitter (X) threads—into a centralized, searchable dashboard. It also features public sharing capabilities, allowing you to share your curated "brain" with the world.

## Features

- **User Authentication**:Secure Signup and Signin using JWT (Access & Refresh Tokens)
- **Content Aggregation**:Easily save links from YouTube and Twitter.
- **Rich Embeds**:Automatically detects and renders embedded video players for YouTube and tweet cards for Twitter.
- **Tagging System**:Organize content with tags (infrastructure present in backend).
- **Search & Filter**:Filter content by type (All, YouTube, Twitter) or search by title.
- **Public Sharing**:Generate a unique shareable link to publish your brain's content to the web.
- **Dark Mode**:Fully responsive UI with light, dark, and system-preference theme support.
-**Responsive Sidebar**:Collapsible navigation with usage statistics.

## Tech Stack

### Frontend

- Framework: React (Vite)

- Language: TypeScript

- Styling: Tailwind CSS

- Routing: React Router DOM

- HTTP Client: Axios

- Icons: Lucide React & Custom SVG Icons

### Backend

- Runtime: Node.js

- Framework: Express.js

- Language: TypeScript

- Database: MongoDB (via Mongoose)

- Authentication: JSON Web Tokens (JWT) & Cookie Parser

## Project Structure
brain-app/
├── brainly/             # Backend Node.js/Express Application
│   ├── src/
│   │   ├── controller/  # Request logic
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # API Routes
│   │   └── utils/       # Helper functions
│   └── ...
└── brainly-frontend/    # Frontend React Application
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Application views
    │   ├── hooks/       # Custom React hooks
    │   └── icons/       # SVG Icons
    └── ...


## Getting Started

Follow these steps to run the project locally.

Prerequisites

- Node.js (v16+ recommended)
- MongoDB (Local or Atlas URI)

1. Backend Setup

Navigate to the backend directory:
cd brainly

Install dependencies:
npm install

Create a .env file in the brainly directory with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

Start the server:
npm run dev
The backend will run on http://localhost:5000.

2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
cd brainly-frontend

Install dependencies:
npm install

Start the Vite development server:
npm run dev

The frontend will run on http://localhost:5173.

API Endpoints

Authentication

POST /api/v1/users/register - Register new user
POST /api/v1/users/login - Login user

Content Management

POST /api/v1/contents/create - Create new content
GET /api/v1/contents/find - Get all user content
DELETE /api/v1/contents/:id - Delete content

Sharing

POST /api/v1/shareLink - Generate share link
GET /api/v1/share/:shareLink - Get shared content

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request


