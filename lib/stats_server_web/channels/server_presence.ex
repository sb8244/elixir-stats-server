defmodule StatsServerWeb.ServerPresence do
  use Phoenix.Presence,
    otp_app: :stats_server,
    pubsub_server: StatsServer.PubSub
end
