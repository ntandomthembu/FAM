# API Specification for FMD Control Platform

## Overview

The FMD Control Platform provides a centralized system for reporting, managing, and responding to Foot-and-Mouth Disease (FMD) outbreaks in livestock. This document outlines the API endpoints available for interacting with the platform.

## Base URL

The base URL for all API endpoints is:

```
http://<your-server-address>/api
```

## Authentication

All endpoints require authentication. Use the following method to authenticate:

- **Token-based Authentication**: Include the token in the `Authorization` header as follows:
  
  ```
  Authorization: Bearer <your-token>
  ```

## Endpoints

### 1. Disease Incident Reporting

- **POST /incidents**
  - Description: Report a suspected disease incident.
  - Request Body:
    ```json
    {
      "farmLocation": "string",
      "numberOfAnimalsAffected": "integer",
      "species": "string",
      "symptoms": "string",
      "photos": ["string"],
      "timeSymptomsStarted": "string (ISO 8601 format)"
    }
    ```
  - Response:
    - 201 Created: Incident reported successfully.
    - 400 Bad Request: Invalid input data.

### 2. Outbreak Intelligence Map

- **GET /incidents**
  - Description: Retrieve all reported incidents.
  - Response:
    - 200 OK: Returns a list of incidents.
    ```json
    [
      {
        "id": "string",
        "farmLocation": "string",
        "status": "string",
        "createdAt": "string (ISO 8601 format)"
      }
    ]
    ```

### 3. Veterinary Investigation

- **GET /veterinary/:incidentId**
  - Description: Get details of a veterinary investigation for a specific incident.
  - Response:
    - 200 OK: Returns investigation details.
    ```json
    {
      "incidentId": "string",
      "vetAssigned": "string",
      "status": "string",
      "investigationNotes": "string"
    }
    ```

### 4. Livestock Traceability

- **GET /livestock**
  - Description: Retrieve livestock movement and traceability information.
  - Response:
    - 200 OK: Returns livestock traceability data.
    ```json
    [
      {
        "id": "string",
        "farmId": "string",
        "movementDetails": "string"
      }
    ]
    ```

### 5. Quarantine Management

- **POST /quarantine**
  - Description: Create a quarantine zone.
  - Request Body:
    ```json
    {
      "zoneLocation": "string",
      "radius": "integer",
      "reason": "string"
    }
    ```
  - Response:
    - 201 Created: Quarantine zone created successfully.
    - 400 Bad Request: Invalid input data.

### 6. Vaccination Campaign Management

- **POST /vaccination**
  - Description: Request a vaccination campaign.
  - Request Body:
    ```json
    {
      "farmId": "string",
      "vaccineType": "string",
      "numberOfAnimals": "integer"
    }
    ```
  - Response:
    - 201 Created: Vaccination campaign requested successfully.
    - 400 Bad Request: Invalid input data.

### 7. Alerts Management

- **GET /alerts**
  - Description: Retrieve alerts for farmers.
  - Response:
    - 200 OK: Returns a list of alerts.
    ```json
    [
      {
        "id": "string",
        "message": "string",
        "createdAt": "string (ISO 8601 format)"
      }
    ]
    ```

### 8. Movement Permits

- **POST /permits**
  - Description: Request a livestock movement permit.
  - Request Body:
    ```json
    {
      "farmId": "string",
      "destination": "string",
      "numberOfAnimals": "integer"
    }
    ```
  - Response:
    - 201 Created: Permit requested successfully.
    - 400 Bad Request: Invalid input data.

### 9. Export Compliance

- **GET /export-compliance**
  - Description: Retrieve export compliance documents.
  - Response:
    - 200 OK: Returns compliance documents.
    ```json
    {
      "complianceDocuments": ["string"]
    }
    ```

### 10. National Disease Dashboard

- **GET /dashboard**
  - Description: Retrieve national disease dashboard data.
  - Response:
    - 200 OK: Returns dashboard statistics.
    ```json
    {
      "activeCases": "integer",
      "vaccinationCoverage": "percentage",
      "outbreakClusters": "integer"
    }
    ```

## Error Handling

All responses will include an error message in the following format:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## Conclusion

This API specification provides a comprehensive overview of the endpoints available for the FMD Control Platform. For further details, please refer to the individual endpoint documentation or contact the development team.