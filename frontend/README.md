# Tomato Health frontend

This React + Vite frontend sends a selected image to the existing FastAPI service at `POST /predict` using multipart form data with the field name `file`. The API returns `class` and `confidence` fields, which the page displays directly.

## Start locally

Open two PowerShell terminals.

**Terminal 1 — backend**, from the project root:

```powershell
cd "C:\Users\USER\Documents\IT\Tomato Health Prediction"
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Starting from the project root is important because `api/main.py` loads `model/1.keras` as a relative path. If your Python environment has not installed the backend packages yet, run `python -m pip install -r api\requirements.txt` first.

**Terminal 2 — frontend:**

```powershell
cd "C:\Users\USER\Documents\IT\Tomato Health Prediction\frontend"
npm.cmd install
npm.cmd run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). Vite uses `.env.development` locally and `.env.production` for production builds. Change the relevant `VITE_API_URL` value if you want to use a different API, then restart Vite or rebuild.

## Try a prediction

1. Confirm the backend is running by opening `http://127.0.0.1:8000/ping`.
2. In the frontend, choose or drop a tomato leaf image.
3. Select **Analyse leaf** and wait for the result from the model.
4. Confirm the disease label and confidence score appear. Use **Analyse another** to start again.

The backend permits browser requests from Vite at `http://localhost:5173`. In Vercel, set `VITE_API_URL` to `https://tomato-health-prediction.onrender.com` in the project settings, then redeploy. After you know your Vercel domain, add a Render environment variable named `FRONTEND_ORIGINS` with the exact frontend origin (including `https://`, without a path). The backend keeps localhost allowed and adds this configured origin. You can provide multiple origins separated by commas.
