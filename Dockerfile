# Use the official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy the HTML file and script to the Nginx HTML directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Copy the video files to the Nginx HTML directory
COPY cloudy_4k.mp4 /usr/share/nginx/html/
COPY default_4k.mp4 /usr/share/nginx/html/
COPY rainy_4k.mp4 /usr/share/nginx/html/
COPY sunny_4k.mp4 /usr/share/nginx/html/
COPY winter_4k.mp4 /usr/share/nginx/html/

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]

