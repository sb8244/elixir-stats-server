defmodule StatsServerWeb.ClientChannelTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ClientChannel

  describe "join" do
    test "the socket can be joined" do
      {:ok, _, %Phoenix.Socket{}} =
        socket("client_socket", %{})
        |> subscribe_and_join(ClientChannel, "client", %{})
    end
  end
end
