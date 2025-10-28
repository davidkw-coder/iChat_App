# School Chat Application

A real-time school communication system built with React, TypeScript, Tailwind CSS, and Cloudflare Workers backend.

## Project Overview

This is a comprehensive chat application designed for educational institutions, enabling real-time communication between students, teachers, and administrators. The application features role-based access control, instant messaging, typing indicators, and online status tracking.

## Technology Stack

### Frontend
- **React 18** with TypeScript and functional components
- **Tailwind CSS** for modern, responsive styling
- **Zustand** for lightweight state management
- **React Router** for client-side routing
- **Socket.IO Client** for real-time communication

### Backend
- **Cloudflare Workers** for serverless deployment
- **D1 Database** (SQLite-compatible) for data persistence
- **RESTful API** for all CRUD operations
- **Real-time events** via Socket.IO

### Database Schema
- **users**: User profiles with roles and online status
- **conversations**: Chat sessions (direct and group)
- **conversation_participants**: Many-to-many relationship
- **messages**: Chat messages with metadata
- **typing_indicators**: Real-time typing status

## Key Features

### Authentication & Authorization
- Youware identity integration
- Role-based access (Student/Teacher/Admin)
- Persistent user sessions

### Real-Time Communication
- Instant message delivery
- Typing indicators
- Online/offline status
- Message timestamps

### User Interface
- Modern, responsive design
- Mobile-optimized layout
- Role-based color coding
- Clean chat bubbles with sender info

### Data Management
- Conversation history
- User directory
- Search functionality
- Message persistence

## Development Commands

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Backend development (if needed)
cd backend && npm run dev

# Deploy backend
cd backend && npm run deploy
```

## API Endpoints

### Authentication
- `GET /api/auth/user-info` - Get current user information

### Users
- `GET /api/users` - Get all users except current

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation messages
- `POST /api/conversations/:id` - Send message to conversation

### Messages
- `POST /api/messages/send` - Send direct message

### Real-time Features
- `POST /api/typing` - Set typing indicator
- `PUT /api/online-status` - Set online status
- `PUT /api/offline-status` - Set offline status

## Socket.IO Events

### Client to Server
- `send_message` - Send message
- `typing` - Typing indicator update

### Server to Client
- `new_message` - Receive new message
- `typing_indicator` - Typing status update
- `user_online` - User came online
- `user_offline` - User went offline

## Component Architecture

### Pages
- `Login` - Authentication interface
- `Register` - User registration
- `Chat` - Main chat interface

### Components
- `Navbar` - Navigation and user menu
- `ChatList` - Conversation sidebar
- `ChatWindow` - Active conversation view
- `UserList` - User directory

### Stores
- `authStore` - User authentication state
- `chatStore` - Chat and real-time state

## Security Considerations

- Youware identity integration for authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- No sensitive data exposure

## Deployment

- **Frontend**: Deploy to any static hosting
- **Backend**: Cloudflare Workers at `https://backend.youware.com`
- **Database**: D1 SQLite-compatible database

## Performance Optimizations

- Component memoization
- Efficient state management
- Optimized database queries
- Lazy loading for large datasets
- Responsive image handling

## Browser Support

- Modern browsers with ES6+ support
- WebSocket support for real-time features
- Responsive design for mobile and desktop