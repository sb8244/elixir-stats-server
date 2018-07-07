defmodule StatsServerWeb.ServerChannel do
  use Phoenix.Channel

  def join("server", _message, socket) do
    {:ok, socket}
  end
end
