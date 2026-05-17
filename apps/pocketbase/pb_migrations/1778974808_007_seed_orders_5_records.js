/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const record0 = new Record(collection);
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@onlineshop.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@onlineshop.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("items", [{"product_id": "1", "quantity": 2, "size": "M", "color": "Black", "price": 29.99}]);
    record0.set("total_amount", 59.98);
    record0.set("transaction_id", "TXN001-2024-001");
    record0.set("payment_method", "MTN MoMo");
    record0.set("order_status", "Pending");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@onlineshop.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@onlineshop.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("items", [{"product_id": "2", "quantity": 1, "size": "L", "color": "Navy", "price": 89.99}]);
    record1.set("total_amount", 89.99);
    record1.set("transaction_id", "TXN001-2024-002");
    record1.set("payment_method", "Airtel Money");
    record1.set("order_status", "Confirmed");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@onlineshop.com'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@onlineshop.com'\""); }
    record2.set("user_id", record2_user_idLookup.id);
    record2.set("items", [{"product_id": "6", "quantity": 1, "size": "M", "color": "Multicolor", "price": 99.99}, {"product_id": "7", "quantity": 2, "size": "S", "color": "White", "price": 49.99}]);
    record2.set("total_amount", 199.97);
    record2.set("transaction_id", "TXN001-2024-003");
    record2.set("payment_method", "MTN MoMo");
    record2.set("order_status", "Shipped");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@onlineshop.com'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@onlineshop.com'\""); }
    record3.set("user_id", record3_user_idLookup.id);
    record3.set("items", [{"product_id": "11", "quantity": 1, "size": "One Size", "color": "Silver", "price": 199.99}]);
    record3.set("total_amount", 199.99);
    record3.set("transaction_id", "TXN001-2024-004");
    record3.set("payment_method", "Airtel Money");
    record3.set("order_status", "Delivered");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@onlineshop.com'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@onlineshop.com'\""); }
    record4.set("user_id", record4_user_idLookup.id);
    record4.set("items", [{"product_id": "12", "quantity": 1, "size": "34", "color": "Black", "price": 39.99}, {"product_id": "13", "quantity": 1, "size": "One Size", "color": "Black", "price": 54.99}]);
    record4.set("total_amount", 94.98);
    record4.set("transaction_id", "TXN001-2024-005");
    record4.set("payment_method", "MTN MoMo");
    record4.set("order_status", "Pending");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
