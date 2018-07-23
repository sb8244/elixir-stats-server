# Stage 1

FROM elixir:1.6.5

MAINTAINER sb8244

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get -y install openssl locales locales-all git nodejs npm

# Install hex
RUN /usr/local/bin/mix local.hex --force && \
    /usr/local/bin/mix local.rebar --force && \
    /usr/local/bin/mix hex.info

WORKDIR /app

ADD assets/package.json assets/

RUN cd assets && npm install

COPY mix.exs mix.lock ./

RUN mix do deps.get, deps.compile

COPY assets/ assets/

RUN cd assets && npm run deploy

COPY . .

RUN MIX_ENV='prod' mix phx.digest
RUN MIX_ENV='prod' mix release --env=prod

# Stage 2

ARG BUILD_VERSION=0.0.1

# For if there are ever db migrations
# COPY ./priv/repo/migrations/* /app/lib/stats_server-$BUILD_VERSION/priv/repo/migrations/

COPY ./rel/vm.args /app/releases/stats_server/releases/$BUILD_VERSION/

WORKDIR /app/releases/stats_server/releases/$BUILD_VERSION

ENTRYPOINT ["./stats_server.sh"]

CMD ["foreground"]
