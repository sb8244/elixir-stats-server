defmodule StatsServer.Collector.CollectionRecord do
  @enforce_keys [:producer_id, :encrypted_item]
  defstruct @enforce_keys
end
