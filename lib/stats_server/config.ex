defmodule StatsServer.Config do
  def client_socket_authentication_secret do
    config()[:client_socket_authentication_secret] || System.get_env("CLIENT_SOCKET_AUTHENTICATION_SECRET")
  end

  def server_socket_authentication_secret do
    config()[:server_socket_authentication_secret] || System.get_env("SERVER_SOCKET_AUTHENTICATION_SECRET")
  end

  def application_names do
    config()[:application_names] || env_application_names(System.get_env("APPLICATION_NAMES_CSV"))
  end

  defp config do
    Application.get_env(:stats_server, StatsServer.Config, [])
  end

  defp env_application_names(names) when is_bitstring(names) and names != "" do
    String.split(names, ", ")
  end

  defp env_application_names(_), do: []
end
