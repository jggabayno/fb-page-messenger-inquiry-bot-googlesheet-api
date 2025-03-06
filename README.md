# Facebook page Messenger Inquiry Bot with Google Sheets

## Overview
A chatbot built with Facebook Page Messenger and Google Sheets for data storage. Developed using Express.js.

## Features

- **🤖 Messenger Bot** – Automates responses to user inquiries.
- **📂 Google Sheets Integration** – Stores and manages inquiry data.
- **💬 Live Chat** – Enables real-time customer interactions.
- **🔗 Facebook Graph API Webhook** – Handles Messenger events and interactions.

## Tech Stack

- **Backend:** Node.js, Express
- **API:** Facebook Graph API, Axios
- **Storage:** Google Sheets

## Getting started

### Requirements

- Yarn or npm

### Setup

1. Clone the repository.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Use the `.env.example` file as a reference to create your own `.env` for environment setup.

## Running the Application

### Development Mode

To start the development server:

```sh
yarn start
```

After running, access the application at:

```sh
http://localhost:3000/
```

## Deployment


### Deployment Options
You can deploy the backend using AWS EC2 or **any other cloud service** of your choice.

### Deploy to Render (Manual)
Install Render CLI:

```
curl -fsSL https://github.com/render/render-cli/releases/latest/download/install.sh | sh
```

Login to Render:
```
render login --token YOUR_RENDER_API_KEY
```

Deploy the backend:

```
render deploy --service-id YOUR_RENDER_SERVICE_ID
```

### GitHub Actions (Automated Deployment)
1. Add RENDER_API_KEY and RENDER_SERVICE_ID to:

   **GitHub → Repo Settings → Secrets → Actions**

2. Push changes to staging or main, and GitHub Actions will handle deployment.