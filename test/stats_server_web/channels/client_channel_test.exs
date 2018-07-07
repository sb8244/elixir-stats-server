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

  describe "handle_in application_names" do
    test "the application names are returned" do
      {:ok, _, socket} =
        socket("client_socket", %{})
        |> subscribe_and_join(ClientChannel, "client", %{})

      ref = push(socket, "application_names", %{})
      assert_reply(ref, :ok, %{application_names: ["Test", "Other Test"]})
    end
  end
end
