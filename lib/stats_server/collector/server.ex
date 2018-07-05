defmodule StatsServer.Collector.Server do
  alias StatsServer.Collector.CollectionRecord

  def start_link(collectable_id: collectable_id) do
    key = collectable_id
    GenServer.start_link(__MODULE__, [collectable_id: collectable_id], name: {:via, Registry, {registry_name(), key}})
  end

  def registry_name, do: StatsServer.Collector.ServerRegistry

  def init(collectable_id: id) do
    {:ok, %{
      collectable_id: id,
      collected: []
    }}
  end

  def add_item(pid, record = %CollectionRecord{}) do
    GenServer.call(pid, {:add_item, record})
  end

  def handle_call({:add_item, record}, _from, state = %{collected: collected}) do
    new_state = Map.put(state, :collected, [record | collected])
    {:reply, {:ok, new_state}, new_state}
  end
end
