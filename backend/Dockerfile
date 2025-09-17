FROM python:3.12-slim
WORKDIR /app
# copy requirements from the build context (./backend when using docker-compose build ./backend)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
# copy the rest of the backend sources
COPY . ./
EXPOSE 4000
CMD ["python", "app.py"]