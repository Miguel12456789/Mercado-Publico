# Mercado Público

**Mercado Público** is a web application developed to facilitate the consultation, analysis, and export of data related to public procurement in Portugal. The platform integrates information from the **Base Gov** portal and other databases, allowing users to access public contract data in a clear, organized, and transparent way, in accordance with the Public Contracts Code.

## Features

### Users

- Advanced search for public contracts  
- Filtering by contract object, location, procedure type, and legal regime  
- Detailed visualization of contracts and entities  
- Result pagination for improved performance  
- Data export in CSV, XLS, and PDF formats  
- Intuitive and responsive interface  

### Administration / System

- Integration with multiple MongoDB databases (organized by year)  
- Modular back-end and front-end architecture  
- Dynamic page rendering using EJS  
- Route and controller management with Express.js  
- Scalable structure prepared for future features  

## Technologies Used

- **Front-end:** HTML, CSS, JavaScript, EJS  
- **Back-end:** Node.js, Express.js  
- **Database:** MongoDB  
- **Other Tools:**  
  - Git & GitHub (version control)  
  - Visual Studio Code  
  - Multer (file handling)  
  - dotenv (environment variables)  


First, run the development server:

```bash
node src/server.js
```

Open [http://localhost:5000/](http://localhost:5000/) with your browser to see the result

### Installation:

Install Node in oficial website [https://nodejs.org/pt](https://nodejs.org/pt)

Check the "Add to PATH" option if it appears

#### First instalation: 

After installing node, open the terminal and type:

```bash
node -v
npm -v
```

Run project

```bash
npm install
npm install express
npm install ejs
npm start
```

if it doesn't work try

```bash
npm init -y
```
