defmodule MockClient.CommandHandler.AllSystemStats do
  def call("all_system_stats") do
    payload = get_system_stats()
    Poison.encode!(payload)
  end

  def call(_) do
    :unmatched
  end

  defp get_system_stats() do
    %{
      gc: gc_stats(),
      memory: memory_stats(),
      process: process_stats(),
      reductions: reductions(),
      run_queue: run_queue()
    }
  end

  defp gc_stats() do
    {count, words_reclaimed, 0} = :erlang.statistics(:garbage_collection)
    %{
      count: count,
      words_reclaimed: words_reclaimed
    }
  end

  defp memory_stats(), do: :erlang.memory() |> Enum.into(%{})

  defp process_stats() do
    %{
      count: :erlang.system_info(:process_count)
    }
  end

  defp run_queue(), do: :erlang.statistics(:run_queue)

  defp reductions() do
    {total, since_last_call} = :erlang.statistics(:exact_reductions)
    %{
      total: total,
      since_last_call: since_last_call
    }
  end
end
