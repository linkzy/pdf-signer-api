# PDF Signer API

This is a Node.js API for signing PDF documents using certificates. The API allows you to upload a PDF file and a P12 certificate file to sign the PDF, and it will return the signed PDF as a response.

## Technologies Used

- Node.js
- Express.js
- Multer for file uploads
- @signpdf/signpdf for PDF signing
- dotenv for environment configuration

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/linkzy/pdf-signer-api.git
   cd pdf-signer-api

2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables:

   Create a `.env` file in the root of the project and add the following:
   ```env
   API_SECRET_TOKEN=your-secret-token

4. Run the application:
   ```bash
   npm start

The API will be available at `http://localhost:3000`.

## API Documentation

### POST `/sign`

This endpoint allows you to sign a PDF document with a P12 certificate.

#### Request

- **Headers:**
  - `Authorization: Bearer <your-secret-token>`
  
- **Form Data (Multipart/Form-Data):**
  - `pdf` (PDF file to sign)
  - `certificate` (P12 certificate file)
  - `reason` (optional, reason for signing the document)
  - `contactInfo` (optional, contact information for the signer)
  - `name` (optional, name of the signer)
  - `location` (optional, location of the signer)
  - `widgetRectX1`, `widgetRectY1`, `widgetRectX2`, `widgetRectY2` (optional, signature widget coordinates)

#### Response

- **200 OK**: Returns the signed PDF as a response.

- **400 Bad Request**: If required parameters are missing or invalid.

- **401 Unauthorized**: If the authorization token is missing or invalid.

- **500 Internal Server Error**: If there is an error signing the PDF.


## Docker Setup

### Building and Running the Docker Image

1. Build the Docker image:
   ```bash
   docker build -t pdf-signer-api .

2. Run the Docker container:
   ```bash
   docker run -d -p 3000:3000 -e API_SECRET_TOKEN=your-secret-token pdf-signer-api

The API will be available at `http://localhost:3000`.

### Deploying with Docker Compose

If you are using Docker Compose, you can configure the application by creating a `docker-compose.yml` file:

```yaml
version: '3'

services:
  pdf-signer-api:
    image: pdf-signer-api
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_SECRET_TOKEN=your-secret-token
