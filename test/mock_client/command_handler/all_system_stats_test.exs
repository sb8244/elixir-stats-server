defmodule MockClient.CommandHandler.AllSystemStatsTest do
  use ExUnit.Case, async: true

  alias MockClient.CommandHandler.AllSystemStats

  test "all_system_stats returns a variety of runtime stats" do
    "stats|" <> stats_payload = AllSystemStats.call("all_system_stats")
    payload = Poison.decode!(stats_payload)
    assert %{
      "collected_at_ms" => _,
      "stats" => [
        %{"label" => "gc count", "value" => _},
        %{"label" => "gc words reclaimed", "value" => _},
        %{"label" => "memory total", "value" => _},
        %{"label" => "memory processes", "value" => _},
        %{"label" => "memory processes_used", "value" => _},
        %{"label" => "memory system", "value" => _},
        %{"label" => "memory atom", "value" => _},
        %{"label" => "memory atom_used", "value" => _},
        %{"label" => "memory binary", "value" => _},
        %{"label" => "memory code", "value" => _},
        %{"label" => "memory ets", "value" => _},
        %{"label" => "process count", "value" => _},
        %{"label" => "reductions count", "value" => _},
        %{"label" => "reductions since last call", "value" => _},
        %{"label" => "run queue size", "value" => _}
      ]
    } = payload
  end
end
