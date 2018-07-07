defmodule StatsServerWeb.ServerSocket do
  use Phoenix.Socket

  ## Channels
  channel("server", StatsServerWeb.ServerChannel)

  ## Transports
  transport(:websocket, Phoenix.Transports.WebSocket)

  def connect(%{"application_name" => app_name, "token" => token}, socket) do
    if token == StatsServer.Config.server_socket_authentication_secret() do
      {:ok, assign(socket, :application_name, app_name)}
    else
      :error
    end
  end

  def id(%{assigns: %{application_name: app_name}}), do: "server_socket:#{app_name}"
end
