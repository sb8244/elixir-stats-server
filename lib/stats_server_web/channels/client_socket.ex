defmodule StatsServerWeb.ClientSocket do
  use Phoenix.Socket

  ## Channels
  channel "client", StatsServerWeb.ClientChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  def connect(%{"secret" => secret}, socket) do
    if secret == StatsServer.Config.client_socket_authentication_secret() do
      {:ok, socket}
    else
      :error
    end
  end

  def id(_socket), do: "client_socket"
end
