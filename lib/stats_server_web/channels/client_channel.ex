defmodule StatsServerWeb.ClientChannel do
  use Phoenix.Channel

  def join("client", _message, socket) do
    {:ok, socket}
  end
end
