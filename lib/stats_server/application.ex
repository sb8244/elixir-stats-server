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
    [
      MockClient.Socket,
      {MockClient.Socket, [id: "MockClient.Socket Other", server_id: "Other Server"]}
    ] ++ Enum.map((1..30), fn i ->
      {MockClient.Socket, [id: "MockClient.Socket #{i}", server_id: "Server #{i}"]}
    end)
  end

  def children(_), do: []
end
