defmodule StatsServerWeb.ServerChannelTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ServerChannel

  def start_socket() do
    {:ok, _, s = %Phoenix.Socket{}} =
      socket("server_socket:test", %{application_name: "test"})
      |> subscribe_and_join(ServerChannel, "server:test", %{})

    s
  end

  describe "join" do
    test "the socket can be joined" do
      start_socket()
    end

    test "an invalid socket app name can not be joined" do
      assert socket("server_socket:test", %{application_name: "test"})
             |> subscribe_and_join(ServerChannel, "server:mismatch", %{}) == {:error, %{reason: "application name mismatch"}}
    end
  end

  describe "handle_out dispatch_command" do
    test "the socket is pushed the command" do
      socket = start_socket()
      broadcast_from!(socket, "dispatch_command", %{command_id: "a", encrypted_command: "b"})
      assert_push("dispatch_command", %{command_id: "a", encrypted_command: "b"})
    end
  end

  describe "handle_in collect_results" do
    test "the server:application_name topic is broadcasted the encrypted command" do
      StatsServerWeb.Endpoint.subscribe("client")

      ref = push(start_socket(), "collect_results", %{command_id: "a", encrypted_response: "b", server_id: "c"})
      assert_reply(ref, :ok, %{})

      expected_payload = %{application_name: "test", command_id: "a", encrypted_response: "b", server_id: "c"}
      assert_receive %Phoenix.Socket.Broadcast{event: "collect_results", payload: ^expected_payload, topic: "client"}
    end
  end
end
