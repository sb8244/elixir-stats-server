defmodule StatsServerWeb.HealthController do
  use StatsServerWeb, :controller

  def show(conn, _) do
    conn
    |> send_resp(204, "")
  end
end
