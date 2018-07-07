use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :stats_server, StatsServerWeb.Endpoint,
  http: [port: 4001],
  server: false

config :stats_server, StatsServer.Config,
  client_socket_authentication_secret: "testing",
  application_names: ["Test", "Other Test"]

# Print only warnings and errors during test
config :logger, level: :warn
