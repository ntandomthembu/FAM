# Deployment Instructions for FMD Control Platform

This document provides instructions for deploying the FMD Control Platform. Follow the steps below to set up the application in your environment.

## Prerequisites

Before deploying the application, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (or your preferred database)

## Environment Configuration

1. **Clone the Repository**

   Clone the repository to your local machine:

   ```
   git clone https://github.com/your-repo/fmd-control-platform.git
   cd fmd-control-platform
   ```

2. **Set Up Environment Variables**

   Copy the example environment file and update the variables as needed:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file to configure your database connection, Redis settings, and any other necessary environment variables.

## Database Setup

1. **Run Migrations**

   Ensure your database is running, then execute the migrations to set up the database schema:

   ```
   npm run migrate
   ```

2. **Seed the Database (Optional)**

   If you want to populate the database with initial data, run the seed command:

   ```
   npm run seed
   ```

## Running the Application

### Development Mode

To run the application in development mode, use the following command:

```
npm run dev
```

This will start the server and watch for changes in the source files.

### Production Mode

For production deployment, build the application and start the server:

```
npm run build
npm start
```

### Docker Deployment

To deploy the application using Docker, follow these steps:

1. **Build the Docker Image**

   ```
   docker build -t fmd-control-platform .
   ```

2. **Run the Docker Container**

   Use Docker Compose to start the application:

   ```
   docker-compose up
   ```

## Accessing the Application

Once the application is running, you can access it via:

- **API**: `http://localhost:3000/api`
- **Dashboard**: `http://localhost:3000/dashboard`
- **Mobile App**: Use the mobile application to connect to the API.

## Monitoring and Logging

Monitor the application logs to ensure everything is running smoothly. You can check logs using:

```
docker-compose logs
```

## Troubleshooting

If you encounter issues during deployment, check the following:

- Ensure all environment variables are correctly set.
- Verify that the database is running and accessible.
- Check the application logs for any error messages.

## Conclusion

You have successfully deployed the FMD Control Platform. For further information, refer to the user guide or API documentation.