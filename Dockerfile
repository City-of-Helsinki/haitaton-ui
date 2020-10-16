FROM registry.redhat.io/rhel8/nginx-116
EXPOSE 8000
COPY ./build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY .env .
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
