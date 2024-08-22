FROM public.ecr.aws/docker/library/node:20-alpine as staticbuilder
COPY . /builder/
WORKDIR /builder
RUN yarn && yarn cache clean --force
RUN REACT_APP_DISABLE_SENTRY=0 yarn build

FROM public.ecr.aws/docker/library/nginx:1.22.1
# Install mods for nginx that include the Headers More mod, that allows the
# removal of the Server -header
RUN apt-get update && apt-get --no-install-recommends install -y nginx-extras && apt-get clean
EXPOSE 8000
COPY --from=staticbuilder ./builder/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Create the environment file so that the user that will run the backend has
# permission to overwrite the config based on environment variables.
RUN touch env-config.js
RUN chmod a+rw env-config.js

# Copy default environment config and setup script
# Copy package.json so env.sh can read it
COPY --from=staticbuilder ./builder/scripts/env.sh /opt/env.sh
COPY --from=staticbuilder ./builder/.env /opt/.env
COPY --from=staticbuilder ./builder/package.json /opt/package.json
RUN chmod +x /opt/env.sh

# Copy script that injects environment variables to nginx.conf
COPY ./scripts/nginx-env.sh /opt/nginx-env.sh
# The script copies /opt/nginx.conf to /etc/nginx/nginx.conf
# while replacing the environment variables
COPY --from=staticbuilder ./builder/nginx/nginx.conf /opt/nginx.conf
RUN chmod +x /opt/nginx-env.sh

RUN chmod a+w /etc/nginx/nginx.conf

ENV REACT_APP_DISABLE_SENTRY=0

CMD ["/bin/bash", "-c", "/opt/env.sh /opt /usr/share/nginx/html && /opt/nginx-env.sh && nginx -g \"daemon off;\""]
