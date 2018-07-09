defmodule MockClient.Encryption do
  def encrypt(payload, key: key) do
    iv = :crypto.strong_rand_bytes(16)
    encrypted = :crypto.block_encrypt(:aes_cbc256, sha256_key(key), iv, pad_message(payload))

    [Base.encode64(iv), Base.encode64(encrypted)]
    |> Enum.join("--")
  end

  def decrypt({base64_iv, base64_encrypted}, key: key) do
    {:ok, iv} = Base.decode64(base64_iv)
    {:ok, encrypted} = Base.decode64(base64_encrypted)

    :crypto.block_decrypt(:aes_cbc256, sha256_key(key), iv, encrypted)
    |> unpad_message()
  end

  defp sha256_key(key) do
    :crypto.hash(:sha256, key)
  end

  defp pad_message(msg) do
    bytes_remaining = rem(byte_size(msg), 16)
    padding_size = 16 - bytes_remaining
    msg <> :binary.copy(<<padding_size>>, padding_size)
  end

  defp unpad_message(msg) do
    padding_size = :binary.last(msg)

    if padding_size <= 16 do
      msg_size = byte_size(msg)

      if binary_part(msg, msg_size, -padding_size) == :binary.copy(<<padding_size>>, padding_size) do
        {:ok, binary_part(msg, 0, msg_size - padding_size)}
      else
        :error
      end
    else
      :error
    end
  end
end

# res = MockClient.Encryption.encrypt("test", key: "secret")
# MockClient.Encryption.decrypt(res, key: "secret")
