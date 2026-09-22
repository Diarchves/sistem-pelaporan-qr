FROM node:20-alpine

WORKDIR /app

# Salin package.json dan install dependensi
COPY package*.json ./
RUN npm install

# Salin seluruh kode frontend
COPY . .

EXPOSE 5173

# Jalankan Vite server dengan host binding 0.0.0.0 agar dapat diakses dari luar kontainer
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
