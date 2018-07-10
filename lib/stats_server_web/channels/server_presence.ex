defmodule StatsServerWeb.ServerPresence do
  use Phoenix.Presence,
    otp_app: :stats_server,
    pubsub_server: StatsServer.PubSub

  def connected_server_list() do
    list("servers")
    |> Map.get("servers", %{})
    |> Map.get(:metas, [])
  end
end
