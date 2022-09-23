FROM registry.redhat.io/rhel8/nginx-116
EXPOSE 8000
COPY ./build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

# Copy default environment config and setup script
# Copy package.json so env.sh can read it
COPY ./scripts/env.sh /opt/env.sh
COPY .env /opt/.env
COPY package.json /opt/package.json
RUN chmod +x /opt/env.sh

COPY .env .

CMD ["/bin/bash", "-c", "/opt/env.sh /opt /usr/share/nginx/html && nginx -g \"daemon off;\""]
