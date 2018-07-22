defmodule StatsServerWeb.ServerChannelTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ServerChannel

  @valid_socket_assigns %{application_name: "test", server_id: "test"}

  def start_socket(opts \\ %{}) do
    assigns = Map.merge(@valid_socket_assigns, opts)

    {:ok, _, s = %Phoenix.Socket{}} =
      socket("server_socket:test", assigns)
      |> subscribe_and_join(ServerChannel, "server:#{assigns.application_name}", %{})

    s
  end

  describe "join" do
    test "the socket can be joined" do
      start_socket()
    end

    test "an invalid socket app name can not be joined" do
      assert socket("server_socket:test", @valid_socket_assigns)
             |> subscribe_and_join(ServerChannel, "server:mismatch", %{}) == {:error, %{reason: "application name mismatch"}}
    end

    test "presence is tracked", context do
      test = to_string(context.test)
      start_socket(%{application_name: test})

      list = StatsServerWeb.ServerPresence.connected_server_list()

      assert [
               %{
                 application_name: ^test,
                 online_at: online_at,
                 phx_ref: phx_ref,
                 server_id: "test"
               }
             ] = list

      assert is_bitstring(online_at)
      assert is_bitstring(phx_ref)
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

      ref = push(start_socket(), "collect_results", %{command_id: "a", encrypted_response: "b", server_id: "c", collected_at_ms: 1})
      assert_reply(ref, :ok, %{})

      expected_payload = %{application_name: "test", command_id: "a", encrypted_response: "b", server_id: "c", collected_at_ms: 1}
      assert_receive %Phoenix.Socket.Broadcast{event: "collect_results", payload: ^expected_payload, topic: "client"}
    end
  end
end
