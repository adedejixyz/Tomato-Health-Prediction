# Tomato Health frontend

This React + Vite frontend sends a selected image to the existing FastAPI service at `POST /predict` using multipart form data with the field name `file`.

## Start locally

Open two PowerShell terminals.

**Terminal 1 — backend**, from the project root:

```powershell
cd "C:\Users\USER\Documents\IT\Tomato Health Prediction"
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Starting from the project root is important because `api/main.py` loads `../model/1.keras` as a relative path. If your Python environment has not installed the backend packages yet, run `python -m pip install -r api\requirements.txt` first.

**Terminal 2 — frontend:**

```powershell
cd "C:\Users\USER\Documents\IT\Tomato Health Prediction\frontend"
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). The `.env` file sets `VITE_API_URL`; its default is `http://localhost:8000`. Restart Vite after changing `.env`.

## Try a prediction

1. Confirm the backend is running by opening `http://127.0.0.1:8000/ping`.
2. In the frontend, choose or drop a tomato leaf image.
3. Select **Analyse leaf** and wait for the result from the model.
4. Confirm the disease label and confidence score appear. Use **Analyse another** to start again.

The backend permits browser requests from Vite at `http://localhost:5173`. If you change the Vite development port, update the allowed origin in `api/main.py` as well.
