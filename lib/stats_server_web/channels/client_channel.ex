defmodule StatsServerWeb.ClientChannel do
  use Phoenix.Channel

  alias StatsServer.Config

  def join("client", _message, socket) do
    {:ok, socket}
  end

  def handle_in("application_names", _payload, socket) do
    {:reply, {:ok, %{application_names: Config.application_names()}}, socket}
  end
end
