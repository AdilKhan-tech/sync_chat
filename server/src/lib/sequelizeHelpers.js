import { Op } from "sequelize";

export const isValidId = (id) => {
  const n = Number(id);
  return Number.isInteger(n) && n > 0;
};

export const toId = (id) => (id == null ? null : Number(id));

export const addApiId = (model) => {
  if (!model?.prototype) return;
  Object.defineProperty(model.prototype, "_id", {
    get() {
      return this.id;
    },
    enumerable: true,
  });
};

export const plainUser = (user) => {
  if (!user) return null;
  const obj = user.get ? user.get({ plain: true }) : { ...user };
  obj._id = obj.id;
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

export const plainMessage = (message) => {
  if (!message) return null;
  const obj = message.get ? message.get({ plain: true }) : { ...message };
  obj._id = obj.id;
  return obj;
};

export const textSearchWhere = (q) => ({
  text: { [Op.like]: `%${q}%` },
});
