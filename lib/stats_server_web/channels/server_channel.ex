defmodule StatsServerWeb.ServerChannel do
  use Phoenix.Channel

  intercept(["dispatch_command"])

  def join("server:" <> app_name, _message, socket = %{assigns: %{application_name: socket_app_name}}) do
    if app_name == socket_app_name do
      {:ok, socket}
    else
      {:error, %{reason: "application name mismatch"}}
    end
  end

  def handle_out("dispatch_command", payload = %{command_id: _, encrypted_command: _}, socket) do
    push(socket, "dispatch_command", payload)

    {:noreply, socket}
  end

  def handle_in(
        "collect_results",
        %{"command_id" => id, "encrypted_response" => resp, "server_id" => server_id},
        socket = %{assigns: %{application_name: app_name}}
      ) do
    payload = %{
      application_name: app_name,
      command_id: id,
      encrypted_response: resp,
      server_id: server_id
    }

    StatsServerWeb.Endpoint.broadcast("client", "collect_results", payload)

    {:reply, {:ok, %{}}, socket}
  end
end
