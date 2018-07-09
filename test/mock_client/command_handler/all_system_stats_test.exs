defmodule MockClient.CommandHandler.AllSystemStatsTest do
  use ExUnit.Case, async: true

  alias MockClient.CommandHandler.AllSystemStats

  test "all_system_stats returns a variety of runtime stats" do
    payload = Poison.decode!(AllSystemStats.call("all_system_stats"))

    %{
      "gc" => %{
        "count" => _,
        "words_reclaimed" => _
      },
      "memory" => %{
        "atom" => _,
        "atom_used" => _,
        "binary" => _,
        "code" => _,
        "ets" => _,
        "processes" => _,
        "processes_used" => _,
        "system" => _,
        "total" => _
      },
      "process" => %{
        "count" => _
      },
      "reductions" => %{
        "since_last_call" => _,
        "total" => _
      },
      "run_queue" => _
    } = payload
  end
end
