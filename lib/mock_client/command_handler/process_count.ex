defmodule MockClient.CommandHandler.ProcessCount do
  def call("process_count_stats") do
    payload =
      %{
        collected_at_ms: :erlang.system_time(:milli_seconds),
        stats: get_system_stats()
      }

    "stats|" <> Poison.encode!(payload)
  end

  def call(_) do
    :unmatched
  end

  defp get_system_stats() do
    process_stats()
  end

  defp process_stats() do
    [
      %{label: "process count", value: :erlang.system_info(:process_count)}
    ]
  end
end
