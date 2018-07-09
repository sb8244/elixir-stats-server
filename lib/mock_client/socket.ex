defmodule MockClient.Socket do
  @moduledoc false
  require Logger
  alias Phoenix.Channels.GenSocketClient
  @behaviour GenSocketClient

  def child_spec(opts) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [opts]},
      type: :worker,
      restart: :permanent,
      shutdown: 500
    }
  end

  def start_link(opts) do
    socket_opts = Keyword.put(opts, :url, "ws://localhost:4000/server_socket/websocket")

    GenSocketClient.start_link(
      __MODULE__,
      Phoenix.Channels.GenSocketClient.Transport.WebSocketClient,
      socket_opts
    )
  end

  def init(opts) do
    url = Keyword.fetch!(opts, :url)
    connect_interval_s = Keyword.get(opts, :connect_interval_s, 3)

    url_params = [
      application_name: "MockServer",
      token: StatsServer.Config.server_socket_authentication_secret()
    ]

    state = %{
      first_join: true,
      application_name: "MockServer",
      connect_interval_s: connect_interval_s
    }

    {:connect, url, url_params, state}
  end

  def handle_message(topic, "dispatch_command", %{"command_id" => cid, "encrypted_command" => encrypted_command}, transport, state) do
    {:ok, command} = MockClient.Encryption.decrypt(encrypted_command, key: "secret")
    {:ok, response} = MockClient.CommandHandler.call(command)
    {:ok, _} =
      GenSocketClient.push(transport, topic, "collect_results", %{
        command_id: cid,
        encrypted_response: MockClient.Encryption.encrypt(response, key: "secret"),
        server_id: 'MockElixir'
      })

    {:ok, state}
  end

  def handle_message(topic, event, payload, _transport, state) do
    Logger.warn("unhandled message on topic #{topic}: #{event} #{inspect(payload)}")
    {:ok, state}
  end

  def handle_connected(transport, state = %{application_name: app_name}) do
    Logger.debug("connected")
    GenSocketClient.join(transport, "server:#{app_name}")
    {:ok, state}
  end

  def handle_disconnected(reason, state = %{connect_interval_s: connect_interval_s}) do
    Logger.error("disconnected: #{inspect(reason)}")
    Process.send_after(self(), :connect, :timer.seconds(connect_interval_s))
    {:ok, state}
  end

  def handle_joined(topic, _payload, _transport, state) do
    Logger.debug("joined the topic #{topic}")
    {:ok, state}
  end

  def handle_join_error(topic, payload, _transport, state) do
    Logger.error("join error on the topic #{topic}: #{inspect(payload)}")
    {:ok, state}
  end

  def handle_channel_closed(topic, payload, _transport, state = %{connect_interval_s: connect_interval_s}) do
    Logger.error("disconnected from the topic #{topic}: #{inspect(payload)} reconnecting in #{connect_interval_s}s")
    Process.send_after(self(), {:join, topic}, :timer.seconds(connect_interval_s))
    {:ok, state}
  end

  def handle_reply(_topic, _ref, %{"response" => response, "status" => "ok"}, _transport, state) when response == %{} do
    {:ok, state}
  end

  def handle_reply(topic, _ref, payload, _transport, state) do
    Logger.warn("unhandled reply on topic #{topic}: #{inspect(payload)}")
    {:ok, state}
  end

  def handle_info(:connect, _transport, state) do
    Logger.info("connecting")
    {:connect, state}
  end

  def handle_info({:join, topic}, transport, state = %{connect_interval_s: connect_interval_s}) do
    Logger.debug("joining the topic #{topic}")

    case GenSocketClient.join(transport, topic) do
      {:error, reason} ->
        Logger.error("error joining the topic #{topic}: #{inspect(reason)}")
        Process.send_after(self(), {:join, topic}, :timer.seconds(connect_interval_s))

      {:ok, _ref} ->
        :ok
    end

    {:ok, state}
  end

  def handle_info(message, _transport, state) do
    Logger.warn("Unhandled info #{inspect(message)}")
    {:ok, state}
  end

  def handle_call(message, _from, _transport, state) do
    Logger.warn("Unhandled handle_call #{inspect(message)}")
    {:noreply, state}
  end
end
