FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS staticbuilder

USER root
RUN npm install --ignore-scripts -g yarn

COPY . /builder/
WORKDIR /builder
RUN chown -R default:root /builder

USER default

RUN yarn && yarn cache clean --force
RUN REACT_APP_DISABLE_SENTRY=0 yarn build

FROM registry.access.redhat.com/ubi9/nginx-124:latest
EXPOSE 8000
COPY --from=staticbuilder ./builder/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy default environment config and setup script
# Copy package.json so env.sh can read it
COPY --from=staticbuilder ./builder/scripts/env.sh /opt/env.sh
COPY --from=staticbuilder ./builder/.env /opt/.env
COPY --from=staticbuilder ./builder/package.json /opt/package.json

# Copy script that injects environment variables to nginx.conf
COPY ./scripts/nginx-env.sh /opt/nginx-env.sh
# The script copies /opt/nginx.conf to /etc/nginx/nginx.conf
# while replacing the environment variables
COPY --from=staticbuilder ./builder/nginx/nginx.conf /opt/nginx.conf

USER root
# Create the environment file so that the user that will run the backend has
# permission to overwrite the config based on environment variables.
RUN touch env-config.js && \
    chmod a+rw env-config.js && \
# Set permissions for running scripts and updating the config
    chmod +x /opt/env.sh && \
    chmod +x /opt/nginx-env.sh && \
    chmod a+w /etc/nginx/nginx.conf
USER default

ENV REACT_APP_DISABLE_SENTRY=0

CMD ["/bin/bash", "-c", "/opt/env.sh /opt /usr/share/nginx/html && /opt/nginx-env.sh && nginx -g \"daemon off;\""]
