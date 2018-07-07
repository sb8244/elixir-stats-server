defmodule StatsServerWeb.ServerChannelTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ServerChannel

  def start_socket() do
    {:ok, _, s = %Phoenix.Socket{}} =
      socket("server_socket:test", %{})
      |> subscribe_and_join(ServerChannel, "server", %{})

    s
  end

  describe "join" do
    test "the socket can be joined" do
      start_socket()
    end
  end
end
