defmodule StatsServer.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    children =
      [
        supervisor(StatsServerWeb.Endpoint, [])
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
      {MockClient.Socket, []},
      {MockClient.Socket, [id: MockClient.Socket.Two]}
    ]
  end

  def children(_), do: []
end
