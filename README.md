# PeakDay 🏔️

A full-stack web application built with Django and React, served via Nginx and containerised with Docker.
Proposed to Beyond Consulting aiming to improve user productivity through a wellness- focused timetabling application serving real- time notifications and a suite of features that promote a healthy work- life balance. 

## Tech Stack

- **Backend** – Django (Python), SQLite
- **Frontend** – React (Node.js)
- **Server** – Nginx (reverse proxy)
- **Containerisation** – Docker & Docker Compose

## Project Structure

PeakDay/
├── frontend/ # React app
│ ├── src/
│ ├── public/
│ └── data/
├── PeakDay/ # Django project settings
├── nginx/ # Nginx config
├── templates/ # Django HTML templates
├── manage.py
├── requirements.txt
├── docker-compose.yml
└── Dockerfile


## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Node.js (for local frontend development)
- Python 3.x (for local backend development)

### Run with Docker

```bash
docker-compose up --build
```

The app will be available at `http://localhost`.

### Run Locally (without Docker)

**Backend:**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the project root:
SECRET_KEY=your-django-secret-key
DEBUG=True


## License

MIT