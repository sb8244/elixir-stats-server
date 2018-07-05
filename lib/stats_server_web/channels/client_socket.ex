defmodule StatsServerWeb.ClientSocket do
  use Phoenix.Socket

  ## Channels
  # channel "room:*", StatsServerWeb.RoomChannel

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
