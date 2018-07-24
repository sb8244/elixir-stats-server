defmodule StatsServerWeb.HealthControllerTest do
  use StatsServerWeb.ConnCase

  describe "GET /health" do
    test "responds with a 200", %{conn: conn} do
      conn = get(conn, "/health")
      assert conn.status == 204
    end
  end
end
