defmodule StatsServerWeb.ServerSocket do
  use Phoenix.Socket

  ## Channels
  channel("server:*", StatsServerWeb.ServerChannel)

  ## Transports
  transport(
    :websocket,
    Phoenix.Transports.WebSocket,
    check_origin: false
  )

  def connect(%{"application_name" => app_name, "server_id" => server_id, "token" => token}, socket) do
    if token == StatsServer.Config.server_socket_authentication_secret() do
      socket =
        socket
        |> assign(:application_name, app_name)
        |> assign(:server_id, server_id)

      {:ok, socket}
    else
      :error
    end
  end

  def id(%{assigns: %{application_name: app_name, server_id: server_id}}), do: "server_socket:#{app_name}:#{server_id}"
end
