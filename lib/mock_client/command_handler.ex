defmodule MockClient.CommandHandler do
  @command_handlers [MockClient.CommandHandler.AllSystemStats]

  def call(command) do
    @command_handlers
    |> Enum.reduce(:unmatched, fn handler_mod, result ->
      case handler_mod.call(command) do
        :unmatched -> result
        output -> output
      end
    end)
    |> case do
      :unmatched -> {:error, "No handler matched the requested command #{command}"}
      result -> {:ok, result}
    end
  end
end
