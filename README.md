# Project Installation Guide

## Prerequisites

- Node.js
- npm
- MySQL 
- Git

## Step 1: Clone the Repository

First, clone the project repository from GitHub using the following command:

```bash
git clone https://github.com/eryu456/ShyftLab.git
cd ShyftLab
```
## Step 2: Database Setup

1. Start your MySQL server using your preferred method.
2. Log in to the MySQL CLI:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

3. Create the database to be used by the project:

```sql
CREATE DATABASE db;
USE db;
```

4. Import the project's database schema and data. This step assumes you have a `.sql` file provided for the database setup:

```bash
mysql -u root -p db < path/ShyftLab/backend/shyftlab.sql
```

## Step 3: Backend Setup

1. Navigate to the `backend` folder within the project directory:

```bash
cd backend
```

2. Install the required Node.js dependencies:

```bash
npm install
```

3. Configure enviromental variables in  `server.js` accordingly

```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Your Password',
    database: 'Database Name'
})

```
4. Start the backend server
   
```bash
npm start
```


## Step 4: Frontend Setup

1. Navigate to the root of the frontend:

```bash
cd path/to/ShyftLab/frontend
```

2. Install the required Node.js dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

The React application should now be accessible at `http://localhost:3000` or `http://localhost:8000` .
