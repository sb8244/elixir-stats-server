defmodule StatsServerWeb.ClientSocketTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ClientSocket

  describe "authentication" do
    test "a authentication secret can be used to connect" do
      {:ok, %Phoenix.Socket{id: "client_socket"}} = connect(ClientSocket, %{"token" => "testing"})
    end

    test "an invalid authentication secret is an error" do
      :error = connect(ClientSocket, %{"token" => "nope"})
    end
  end
end
