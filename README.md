# 🧠 Surgic Sense – Frontend

## 🌟 Overview

Surgic Sense is a frontend interface for an AI-powered medical application designed to assist reconstructive surgery for gunshot wounds.

The system allows medical professionals to:

- Upload 3D scan models
- Run AI-based segmentation
- View and analyze results
- Prepare scans for printing

The interface focuses on usability, clarity, and an efficient workflow.

---

## ⚙️ Features

- Upload Scan (OBJ, MTL, textures or ZIP)
- Segmentation (AI processing)
- Preview & Results (side-by-side view)
- Viewer Controls (zoom, rotate, reset)
- Print Page (preview before printing)

---

## 🔗 API Integration

The frontend communicates with a backend API.

> ⚠️ **Important**  
> For deployment, this must be replaced with the production backend URL.

API configuration is centralized in:  
`config.js`

---

## 🎮 Usage

1. Upload scan (Upload Page)
2. Run segmentation (Segmentation Page)
3. View results (View Page)
4. Print result (Print Page)

---

## 📌 Notes

- API URL must be updated before deployment
- Backend must allow CORS
- Local development uses `localhost:8000`
