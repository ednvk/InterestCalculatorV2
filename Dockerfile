# Lightweight Nginx image
FROM nginx:1.27-alpine

# Work in Nginx's default web root
WORKDIR /usr/share/nginx/html

# Remove default index
RUN rm -rf ./*

# Copy your static files
# (add/remove lines if you have more files or folders)
COPY index.html .
COPY styles.css .
COPY script.js .
# COPY assets/ ./assets/   # uncomment if you have images/fonts/etc.

# Expose HTTP
EXPOSE 80

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1
