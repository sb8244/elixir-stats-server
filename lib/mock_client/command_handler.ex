defmodule MockClient.CommandHandler do
  @command_handlers [MockClient.CommandHandler.AllSystemStats, MockClient.CommandHandler.ProcessCount]

  def call(command, opts \\ []) do
    command_handlers = Keyword.get(opts, :handlers, @command_handlers)

    command_handlers
    |> Enum.reduce(:unmatched, fn handler_mod, result ->
      case handler_mod.call(command) do
        :unmatched -> result
        output -> output
      end
    end)
    |> case do
      :unmatched -> {:error, "No handler matched the requested command: #{command}"}
      result -> {:ok, result}
    end
  end
end
