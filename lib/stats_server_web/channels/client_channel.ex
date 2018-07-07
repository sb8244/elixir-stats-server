defmodule StatsServerWeb.ClientChannel do
  use Phoenix.Channel

  alias StatsServer.Config

  def join("client", _message, socket) do
    {:ok, socket}
  end

  def handle_in("application_names", _payload, socket) do
    {:reply, {:ok, %{application_names: Config.application_names()}}, socket}
  end

  def handle_in("dispatch_command", %{"application_name" => app_name, "command_id" => id, "encrypted_command" => command}, socket) do
    server_params = %{
      command_id: id,
      encrypted_command: command
    }
    StatsServerWeb.Endpoint.broadcast("server:#{app_name}", "dispatch_command", server_params)

    {:reply, {:ok, %{}}, socket}
  end
end
