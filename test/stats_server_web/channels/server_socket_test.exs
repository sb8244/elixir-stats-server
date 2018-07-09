defmodule StatsServerWeb.ServerSocketTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ServerSocket

  describe "authentication" do
    test "a authentication secret can be used to connect" do
      {:ok, %Phoenix.Socket{id: "server_socket:test TEST:test"}} =
        connect(ServerSocket, %{
          "application_name" => "test TEST",
          "server_id" => "test",
          "token" => "server_testing"
        })
    end

    test "an invalid authentication secret is an error" do
      :error =
        connect(ServerSocket, %{
          "application_name" => "test",
          "server_id" => "test",
          "token" => StatsServer.Config.client_socket_authentication_secret()
        })
    end
  end
end
