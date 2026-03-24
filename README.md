# Simple Expense Tracker 💰

A simple full-stack Expense Tracker web application built with Vanilla JS, Node.js, Express, and MySQL. It allows users to add incomes and expenses, keeps a transaction history, and calculates the total balance.

## Features
- Add new transactions (Income or Expense)
- View a history of all transactions
- Real-time calculation of Total Income, Total Expense, and Net Balance
- Responsive and modern UI styled with Tailwind CSS
- REST API backend to manage data securely

## Tech Stack
- **Frontend:** HTML, JavaScript, Tailwind CSS (via CDN)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Other Tools:** `dotenv` for environment variables, `cors` for cross-origin requests

## Prerequisites ⚙️
Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) (v14 or higher)
- You have installed and configured [MySQL](https://www.mysql.com/)

## Installation & Setup 🚀

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashodhar-exe/Simple-Expense-Tracker.git
   cd Simple-Expense-Tracker
   ```

2. **Configure the Database:**
   - Open your MySQL console or Workbench.
   - Create a database called `expense_tracker`:
     ```sql
     CREATE DATABASE expense_tracker;
     USE expense_tracker;
     ```
   - Create the `expenses` table:
     ```sql
     CREATE TABLE expenses (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       amount DECIMAL(10, 2) NOT NULL,
       category ENUM('income', 'expense') NOT NULL,
       date DATE NOT NULL
     );
     ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Configuration:**
   - In the `backend` folder, duplicate `.env.example` and rename it to `.env`.
   - Update your `.env` file with your MySQL database credentials:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=expense_tracker
     ```

5. **Start the Application:**
   From the `backend` directory, run:
   ```bash
   node server.js
   ```
   *The server will start on port 5000 and the frontend application will be hosted automatically.*

6. **View the Application:**
   Open your browser and navigate to: `http://localhost:5000`

## Deployment 🌐
This project is deployment-ready. It uses environment variables for secure connection strings and the Node server successfully serves the static frontend assets via `express.static()`. You can host the `backend` folder directly on platforms like [Render](https://render.com), [Heroku](https://heroku.com), or [Railway](https://railway.app).
