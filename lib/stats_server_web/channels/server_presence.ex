defmodule StatsServerWeb.ServerPresence do
  use Phoenix.Presence,
    otp_app: :stats_server,
    pubsub_server: StatsServer.PubSub

  def connected_server_list() do
    list("client")
    |> Map.get("servers", %{})
    |> Map.get(:metas, [])
  end

  def track(socket, payload) do
    track(
      socket.channel_pid,
      "client",
      "servers",
      Map.merge(
        %{
          online_at: inspect(System.system_time(:seconds))
        },
        payload
      )
    )
  end
end
