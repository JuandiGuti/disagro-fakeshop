require("dotenv").config();
const { connectDB } = require("../db");
const Coupon = require("../models/coupons");

async function run() {
  await connectDB();
  const payload = [
    { code: "PROD01", type: "ALL", discountPct: 10, active: true },
    {
      code: "SERVI01",
      type: "SOME",
      productIds: [1, 2, 3],
      discountPct: 15,
      active: true,
    },
  ];
  for (const c of payload) {
    await Coupon.updateOne({ code: c.code }, { $set: c }, { upsert: true });
  }
  console.log("Cupones seed cargados");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
