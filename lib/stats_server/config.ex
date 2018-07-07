defmodule StatsServer.Config do
  def client_socket_authentication_secret do
    config()[:client_socket_authentication_secret] || System.get_env("CLIENT_SOCKET_AUTHENTICATION_SECRET")
  end

  def application_names do
    config()[:application_names] || []
  end

  defp config do
    Application.get_env(:stats_server, StatsServer.Config, [])
  end
end
