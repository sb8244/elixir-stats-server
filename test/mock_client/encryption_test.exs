defmodule MockClient.EncryptionTest do
  use ExUnit.Case, async: true

  alias MockClient.Encryption

  test "what is encrypted can be decrypted" do
    encrypted = Encryption.encrypt("testing", key: "secret")
    assert Encryption.decrypt(encrypted, key: "secret") == {:ok, "testing"}
  end

  test "invalid secret on decryption is an error" do
    encrypted = Encryption.encrypt("testing", key: "secret")
    assert Encryption.decrypt(encrypted, key: "no") == :error
  end

  test "invalid payload on decryption is an error" do
    encrypted = Encryption.encrypt("testing", key: "secret")
    assert Encryption.decrypt(encrypted <> "x", key: "secret") == :error
  end

  test "the payload must have --" do
    assert Encryption.decrypt("x", key: "secret") == :error
  end
end
