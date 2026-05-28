from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


class Hash:
    def bcrypt(self, password: str):
        return password_hash.hash(password)

    def verify(self, plain, hashed):
        return password_hash.verify(plain, hashed)
