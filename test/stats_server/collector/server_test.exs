defmodule StatsServer.Collector.ServerTest do
  use ExUnit.Case, async: true

  alias StatsServer.Collector.Server
  alias StatsServer.Collector.CollectionRecord

  test "a collector can be started up", %{test: test_name} do
    {:ok, pid} = Server.start_link(collectable_id: test_name)
    assert is_pid(pid)
  end

  describe "add_item/1" do
    setup %{test: test_name} do
      {:ok, pid} = Server.start_link(collectable_id: test_name)

      {:ok, %{pid: pid}}
    end

    test "the item is added to the collected list", %{pid: pid, test: test_name} do
      record = %CollectionRecord{producer_id: "1", encrypted_item: "test"}
      record2 = %CollectionRecord{producer_id: "2", encrypted_item: "test2"}

      {:ok, state} = Server.add_item(pid, record)

      assert state == %{
        collectable_id: test_name,
        collected: [
          record
        ]
      }

      {:ok, state2} = Server.add_item(pid, record2)

      assert state2 == %{
        collectable_id: test_name,
        collected: [
          record2,
          record
        ]
      }
    end
  end
end
