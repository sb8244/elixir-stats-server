defmodule StatsServerWeb.ServerChannel do
  use Phoenix.Channel

  intercept(["dispatch_command"])

  def join("server", _message, socket) do
    {:ok, socket}
  end

  def handle_out("dispatch_command", payload = %{command_id: _, encrypted_command: _}, socket) do
    push socket, "dispatch_command", payload

    {:noreply, socket}
  end
end
