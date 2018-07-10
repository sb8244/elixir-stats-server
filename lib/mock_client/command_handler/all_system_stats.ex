defmodule MockClient.CommandHandler.AllSystemStats do
  def call("all_system_stats") do
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
    gc_stats() ++ memory_stats() ++ process_stats() ++ reductions() ++ run_queue()
  end

  defp gc_stats() do
    {count, words_reclaimed, 0} = :erlang.statistics(:garbage_collection)

    [
      %{label: "gc count", value: count},
      %{label: "gc words reclaimed", value: words_reclaimed}
    ]
  end

  defp memory_stats(), do: :erlang.memory() |> Enum.map(fn {k, v} -> %{label: "memory #{k}", value: v} end)

  defp process_stats() do
    [
      %{label: "process count", value: :erlang.system_info(:process_count)}
    ]
  end

  defp run_queue() do
    [
      %{label: "run queue size", value: :erlang.statistics(:run_queue)}
    ]
  end

  defp reductions() do
    {total, since_last_call} = :erlang.statistics(:exact_reductions)

    [
      %{label: "reductions count", value: total},
      %{label: "reductions since last call", value: since_last_call}
    ]
  end
end
