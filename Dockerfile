# Dockerfile para o sistema de restaurante
FROM python:3.10-slim

# Definir variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=5000

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY backend/requirements-prod.txt requirements.txt

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

RUN python backend/migrate_railway.py

# Copiar código do backend
COPY backend/ .

# Criar diretório para banco de dados
RUN mkdir -p src/database

# Expor porta
EXPOSE 5000

# Comando para executar a aplicação
CMD ["gunicorn", "--config", "gunicorn.conf.py", "wsgi:app"]