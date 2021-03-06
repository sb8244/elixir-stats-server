defmodule StatsServerWeb.ClientChannelTest do
  use StatsServerWeb.ChannelCase, async: true

  alias StatsServerWeb.ClientChannel

  def start_socket() do
    {:ok, _, s = %Phoenix.Socket{}} =
      socket("client_socket", %{})
      |> subscribe_and_join(ClientChannel, "client", %{})

    s
  end

  describe "join" do
    test "the socket can be joined" do
      start_socket()
    end
  end

  describe "handle_out collect_results" do
    test "the socket is pushed the results" do
      socket = start_socket()
      payload = %{application_name: "test", command_id: "a", encrypted_response: "b", server_id: "c"}
      broadcast_from!(socket, "collect_results", payload)
      assert_push("collect_results", ^payload)
    end
  end

  describe "handle_in application_names" do
    test "the application names are returned" do
      ref = push(start_socket(), "application_names", %{})
      assert_reply(ref, :ok, %{application_names: ["Test", "Other Test"]})
    end
  end

  describe "handle_in dispatch_command" do
    test "the server:application_name topic is broadcasted the encrypted command" do
      StatsServerWeb.Endpoint.subscribe("server:Test")

      ref = push(start_socket(), "dispatch_command", %{application_name: "Test", encrypted_command: "x", command_id: "a", server_ids: []})
      assert_reply(ref, :ok, %{})

      expected_payload = %{command_id: "a", encrypted_command: "x", server_ids: []}
      assert_receive %Phoenix.Socket.Broadcast{event: "dispatch_command", payload: ^expected_payload, topic: "server:Test"}
    end
  end
end
