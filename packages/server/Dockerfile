FROM node:12.14.0-slim
ARG NPM_TOKEN

# Ensure we always run in UTC time
ENV TZ utc

WORKDIR /usr/app
COPY build /usr/app/
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

# Empty cache when done to reduce layer size
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY docker/entrypoint.sh /usr/entrypoint.sh

ENTRYPOINT [ "/usr/entrypoint.sh" ]
CMD [ "server" ]