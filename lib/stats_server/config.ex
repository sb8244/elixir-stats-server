defmodule StatsServer.Config do
  def client_socket_authentication_secret do
    System.get_env("CLIENT_SOCKET_AUTHENTICATION_SECRET")
  end
end
