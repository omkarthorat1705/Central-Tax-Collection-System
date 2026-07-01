const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRepository = require("../repositories/authRepository");

const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/auth");

const login = async (authorityCode, username, password) => {
  const user = await authRepository.getUserForLogin(authorityCode, username);

  if (!user) {
    throw new Error("Invalid User");
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    {
      user_id: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      role: user.role,

      tenant_id: user.tenant_id,
      tenant_name: user.tenant_name,
      tenant_code: user.tenant_code,
    },
  };
};

module.exports = {
  login,
};
