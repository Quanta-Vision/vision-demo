# Demo Features

1. Multi-Tenant IAM Dashboard
+ **Admin login**: Secure (admin API key or login)
+ **Create/Rotate API Keys**: Generate keys for each agent/company/consumer
+ **List/Manage API Keys**: List, disable/enable, update allowed APIs, see usage
+ **Audit Log**: Show who created/rotated/deleted which keys
+ **Per-key API Usage Stats**: Requests count, last used, per endpoint

2. Person Management Portal (per Consumer)
+ **List Persons**: Table with search, filter, and pagination (only their own people)
+ **Add Person**: Upload images, name, user ID
+ **Update Person**: Upload new images, update metadata
+ **Delete Person**: With confirmation
+ **Batch Delete**: Checkbox + multi-select
+ **Person Details**: View all images, registration dates, and embedding summary

3. Recognition / Rollcall Demo

+ **Live Recognize UI**:
    - Upload photo from file/camera
    - Instantly get match result (name, time, confidence)
    - Show rollcall logs for recent recognitions, including photo/thumbnail, time, status

4. Liveness/Spoofing Detection Demo

+ **Upload/Camera Capture Liveness Test**:
    - Upload an image or take from webcam
    - See immediate feedback if live/spoof (with score)
    - Explain what liveness means ("prevents spoofing with phone screen/photo")

5. API Playground (Swagger/Redoc/Custom UI)
+ **Live API Docs (Swagger)**:
    - Try endpoints live with token in header
    - Show error if key is wrong or not allowed

+ **Code Samples**:
    - Show Python, cURL, Postman snippets for each endpoint

6. Consumer Isolation Demo
+ **Login as two different consumers, show**:
    - Each only sees their own persons, logs, and rollcalls
    - Try “recognize” with another consumer’s person: will fail
    - Security notice: “Your data is always isolated”

7. Audit & Logs Viewer
+ Table/grid of all API actions (per consumer and globally for admin)
+ Download logs as CSV/Excel

**Optional Advanced (for max wow)**
+ **Face Cluster Visualization**:
    - t-SNE/UMAP plot of all embeddings for this consumer
+ **Realtime Attendance Board**:
    - See “last seen” of each user, refreshes in real time
+ **Webhook Configuration**:
    - Let consumer configure a webhook to be called on recognition event

---
# Installation Library
```
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom
```

# Initial Folder Structure
```
src/
  api/             # API calls (axios wrappers)
  components/      # Reusable UI components
  pages/           # Main views: Dashboard, Persons, Recognition, Liveness, etc
  routes/          # React Router definitions
  App.tsx
  main.tsx / index.tsx
```