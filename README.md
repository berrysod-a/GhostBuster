# UniCredit - Student Marketplace

A Next.js application for a credit-based student marketplace where users can teach classes, learn from others, and complete tasks for rewards.

## Features
- **Authentication**: Phone OTP Login (Demo mode: Use code `123456`)
- **Classes**: Upload video classes and earn credits when others attend
- **Tasks**: Post tasks with credit rewards or complete tasks to earn
- **Wallet**: Real-time credit balance and atomic transactions

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with your credentials (see `.env.example` or ask the developer).
   - MongoDB URI
   - NextAuth Secret
   - Cloudinary Credentials

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack
- Next.js 14 (App Router)
- MongoDB & Mongoose
- NextAuth.js
- Tailwind-like Custom CSS
- Cloudinary (Video Storage)
