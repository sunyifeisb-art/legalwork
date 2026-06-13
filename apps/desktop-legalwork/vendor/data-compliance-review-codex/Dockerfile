FROM python:3.11-slim

WORKDIR /app

COPY data-compliance-web/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY data-compliance-web/ .

EXPOSE 8080

CMD gunicorn app:app --bind 0.0.0.0:8080 --workers 2 --timeout 120
