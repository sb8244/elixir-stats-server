defmodule StatsServer.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    children = [
      supervisor(StatsServerWeb.Endpoint, []),
      {Registry, keys: :unique, name: StatsServer.Collector.Server.registry_name()}
    ]

    opts = [strategy: :one_for_one, name: StatsServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    StatsServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
