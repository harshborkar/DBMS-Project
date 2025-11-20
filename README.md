🌿 LeafLink

A simple and intuitive website for tracking plant-watering schedules. LeafLink helps users add plants, set watering durations, upload custom images, and receive email notifications when it's time to water again — all powered by Supabase authentication and storage.

📚 Table of Contents

Introduction

Features

Tech Stack

Project Structure

Installation

Environment Setup

Usage

Supabase Setup

Examples

Troubleshooting

Contributors

License

🌱 Introduction

LeafLink is a lightweight plant-watering tracker that lets users keep their plants healthy with minimal effort. Users can authenticate via Supabase, add plants with custom images, define watering durations, and receive automated email reminders. The interface is built with Tailwind CSS for clean, responsive styling.

✨ Features

Supabase Authentication (email/password)

Add Plants with names, descriptions, and custom images

Set Watering Durations individually

Automatic Email Notifications based on watering schedules

Supabase Storage for plant images

Responsive UI built with Tailwind

Simple, fast setup via npx

🛠 Tech Stack

Frontend: HTML / JavaScript (or framework if you specify later)

Styling: Tailwind CSS

Backend / DB: Supabase

Email Notifications: Supabase Functions (Edge Functions)

(If you're using a specific framework like React, Next.js, SvelteKit, or vanilla JS, tell me and I’ll update this section.)

📁 Project Structure

Generic version — I will refine if you share your actual file tree.

LeafLink/
├─ public/
│  ├─ images/
│  └─ favicon.ico
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ styles/
│  └─ utils/
├─ supabase/
│  ├─ functions/
│  └─ migrations/
├─ package.json
└─ README.md

⚙️ Installation
# Clone the repository
git clone https://github.com/your-username/leaflink.git
cd leaflink

# Install dependencies
npm install

# Start development server
npx your-dev-command

🔑 Environment Setup

You said no special environment configuration is needed —
I’ll assume your Supabase keys are already handled internally or injected automatically.
If this changes, I can add a .env.example section.

🚀 Usage

Sign up or log in using Supabase authentication

Add a plant with:

Name

Watering duration (e.g., every 3 days)

Optional custom image

Receive email reminders when it’s time to water

View and manage all plants from your dashboard

🗄 Supabase Setup
Tables Required

plants

Column	Type	Notes
id	uuid	Primary key
user_id	uuid	FK to auth.users
name	text	Plant name
image_url	text	Stored via Supabase Storage
watering_days	integer	Duration in days
last_watered	timestamp	Updated automatically
Storage Buckets

plant-images (public or authenticated)

Edge Function (Email Notifications)

Triggered daily to check overdue plants and send email alerts.

I can generate the actual SQL and Edge Function code if you'd like.

📸 Examples

Add screenshots here — send me the images if you'd like them included.

👥 Contributors

Your Name — Harsh Borkar

📝 License

No license specified (default: all rights reserved).


If you want, I can also:
