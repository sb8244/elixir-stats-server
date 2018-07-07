defmodule StatsServerWeb.PageControllerTest do
  use StatsServerWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "app.js"
  end
end
