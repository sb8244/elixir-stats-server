defmodule StatsServer.Application do
  use Application

  alias StatsServer.Config

  def start(_type, _args) do
    import Supervisor.Spec
    ensure_configured!()

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
      {StatsAgent.Socket, [application_name: "MockServer", authentication_secret: secret, encryption_key: "secret", url: url]},
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

  defp ensure_configured!() do
    if Config.client_socket_authentication_secret() == nil do
      throw "Config.client_socket_authentcation_secret is not set. You can set this using CLIENT_SOCKET_AUTHENTICATION_SECRET"
    end

    if Config.server_socket_authentication_secret() == nil do
      throw "Config.server_socket_authentication_secret is not set. You can set this using SERVER_SOCKET_AUTHENTICATION_SECRET"
    end

    if length(Config.application_names()) == 0 do
      throw "Config.application_names is not set. You can set this using APPLICATION_NAMES_CSV"
    end
  end
end
