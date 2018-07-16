defmodule StatsServer.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    children =
      [
        supervisor(StatsServerWeb.Endpoint, []),
        StatsServerWeb.ServerPresence
      ] ++ children(env())

    opts = [strategy: :one_for_one, name: StatsServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    StatsServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  def env(), do: Application.get_env(:stats_server, :env)

  def children(:dev) do
    secret = StatsServer.Config.server_socket_authentication_secret()
    url = "ws://localhost:4000/server_socket/websocket"

    [
      # {StatsAgent.Socket, [application_name: "MockServer", authentication_secret: secret, encryption_key: "secret", url: url]},
      {StatsAgent.Socket,
       [
         id: "StatsAgent.Socket Other",
         application_name: "MockServer",
         authentication_secret: secret,
         encryption_key: "secret",
         server_id: "Other Server",
         url: url
       ]}
    ]
  end

  def children(_), do: []
end
