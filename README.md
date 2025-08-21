
Built by https://www.blackbox.ai

---

# DSQUARED2 Clone

## Project Overview
DSQUARED2 Clone is an e-commerce web application inspired by the popular fashion brand, DSQUARED2. This project is designed to allow users to browse and purchase products, while also providing an admin panel for managing inventory and orders.

## Installation

To install the project, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/dsquared2-clone.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd dsquared2-clone
   ```

3. **Install the server dependencies**:

   ```bash
   npm install
   ```

4. **Navigate to the client directory and install its dependencies**:

   ```bash
   cd client
   npm install
   ```

## Usage

To run the application, you can start the server and client separately.

1. **Start the server**:
   From the root directory of the project, run:

   ```bash
   npm start
   ```

   You can also use the development mode with hot-reloading:

   ```bash
   npm run dev
   ```

2. **Start the client**:
   Open a new terminal window and navigate to the `client` directory, then run:

   ```bash
   npm start
   ```

## Features

- User-friendly e-commerce interface to browse products.
- Admin panel to manage products and orders.
- Responsive design for mobile devices.
- Secure API using CORS for better security.
  
## Dependencies

The project uses the following dependencies as listed in the `package.json`:

- **express**: ^4.18.2 - A minimal and flexible Node.js web application framework.
- **cors**: ^2.8.5 - Middleware for enabling Cross-Origin Resource Sharing.

For development purposes, it also utilizes:

- **nodemon**: ^3.0.1 - A tool that helps develop Node.js applications by automatically restarting the server when file changes are detected.

## Project Structure

The project structure is organized as follows:

```
dsquared2-clone/
├── client/                 # Client-side application
│   ├── ...                 # Other client files
├── server/                 # Server-side application
│   ├── server.js           # Entry point for the server
├── package.json            # Project metadata and dependencies
└── package-lock.json       # Exact versions of dependencies
```

## License

This project is licensed under the MIT License.