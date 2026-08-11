# DTP

## Overview

## Architecture

## Tech Stack

## Project Structure

## Prerequisites

## Environment Variables

## Running the Application

### Using Docker

### Running Without Docker

## Services

## API Health Check

## Git Workflow

## Contributing

## Troubleshooting




## Overview

DTP is a full-stack web application consisting of a React frontend
and a Node.js/Express backend.

The application uses MongoDB Atlas for database services and Docker
Compose for local containerized development.


## Architecture

Browser
   |
   | HTTP / fetch
   v
React Frontend
   |
   | HTTP API
   v
Node.js + Express Backend
   |
   v
MongoDB Atlas


##Docker:
Docker Compose
     |
     +----------------+
     |                |
     v                v
Frontend           Backend
Nginx              Node.js
:80                :8080
     |                |
     +-------+--------+
             |
             v
       MongoDB Atlas

       




## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript / TypeScript
- Nginx

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB Atlas

### Development & Deployment
- Docker
- Docker Compose
- Git
- GitHub



## Project Structure

```text
DTP/
├── BasicNodeSet-up-Part3-main/   # Backend
├── YourAIChat-main/              # Frontend
├── docker-compose.yml
├── .gitignore
└── README.md



## Prerequisites

- Git
- Docker Desktop
- GitHub access
- MongoDB Atlas connection details




## Environment Variables

Create the required `.env` files from the provided `.env.example`
files.

Never commit `.env` files or production credentials to Git.


## Running With Docker

From the project root:

```bash
docker compose up --build



## API Health Check

The backend exposes a health-check endpoint:

`GET /api/v1/healthCheck/`

When the backend is running locally:

`http://localhost:8080/api/v1/healthCheck/`


## Running Without Docker

### Backend

```bash
cd BasicNodeSet-up-Part3-main
npm install
npm run dev
