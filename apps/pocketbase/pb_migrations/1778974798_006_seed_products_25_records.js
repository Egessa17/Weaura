/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Classic Cotton T-Shirt");
    record0.set("description", "Comfortable everyday cotton t-shirt perfect for casual wear");
    record0.set("price", 29.99);
    record0.set("original_price", 39.99);
    record0.set("category", "Men");
    record0.set("sizes", "XS,S,M,L,XL,XXL");
    record0.set("colors", "Black,White,Navy,Gray");
    record0.set("stock_quantity", 50);
    record0.set("rating", 4.5);
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
    record1.set("name", "Premium Denim Jacket");
    record1.set("description", "Timeless denim jacket with classic styling and durability");
    record1.set("price", 89.99);
    record1.set("original_price", 129.99);
    record1.set("category", "Men");
    record1.set("sizes", "S,M,L,XL");
    record1.set("colors", "Navy,Black,Light Blue");
    record1.set("stock_quantity", 35);
    record1.set("rating", 4.8);
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
    record2.set("name", "Slim Fit Chinos");
    record2.set("description", "Modern slim fit chinos for a polished look");
    record2.set("price", 59.99);
    record2.set("original_price", 79.99);
    record2.set("category", "Men");
    record2.set("sizes", "28,30,32,34,36,38");
    record2.set("colors", "Khaki,Navy,Black,Gray");
    record2.set("stock_quantity", 45);
    record2.set("rating", 4.3);
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
    record3.set("name", "Wool Blend Sweater");
    record3.set("description", "Cozy wool blend sweater ideal for cooler weather");
    record3.set("price", 79.99);
    record3.set("original_price", 99.99);
    record3.set("category", "Men");
    record3.set("sizes", "S,M,L,XL");
    record3.set("colors", "Navy,Gray,Black,Burgundy");
    record3.set("stock_quantity", 28);
    record3.set("rating", 4.6);
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
    record4.set("name", "Athletic Performance Shirt");
    record4.set("description", "Moisture-wicking athletic shirt for sports and fitness");
    record4.set("price", 44.99);
    record4.set("original_price", 59.99);
    record4.set("category", "Men");
    record4.set("sizes", "XS,S,M,L,XL");
    record4.set("colors", "Black,White,Navy,Gray");
    record4.set("stock_quantity", 60);
    record4.set("rating", 4.4);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Elegant Floral Dress");
    record5.set("description", "Beautiful floral print dress perfect for special occasions");
    record5.set("price", 99.99);
    record5.set("original_price", 149.99);
    record5.set("category", "Women");
    record5.set("sizes", "XS,S,M,L,XL");
    record5.set("colors", "Multicolor,Navy,Black");
    record5.set("stock_quantity", 25);
    record5.set("rating", 4.7);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Casual Summer Blouse");
    record6.set("description", "Light and breathable blouse ideal for warm weather");
    record6.set("price", 49.99);
    record6.set("original_price", 69.99);
    record6.set("category", "Women");
    record6.set("sizes", "XS,S,M,L,XL,XXL");
    record6.set("colors", "White,Cream,Light Blue,Pink");
    record6.set("stock_quantity", 55);
    record6.set("rating", 4.5);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Professional Blazer");
    record7.set("description", "Tailored blazer for business and professional settings");
    record7.set("price", 129.99);
    record7.set("original_price", 179.99);
    record7.set("category", "Women");
    record7.set("sizes", "XS,S,M,L,XL");
    record7.set("colors", "Black,Navy,Gray,Burgundy");
    record7.set("stock_quantity", 20);
    record7.set("rating", 4.8);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Cozy Cardigan");
    record8.set("description", "Soft and warm cardigan perfect for layering");
    record8.set("price", 69.99);
    record8.set("original_price", 89.99);
    record8.set("category", "Women");
    record8.set("sizes", "XS,S,M,L,XL,XXL");
    record8.set("colors", "Cream,Gray,Navy,Black");
    record8.set("stock_quantity", 40);
    record8.set("rating", 4.6);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Denim Jacket Women");
    record9.set("description", "Classic women's denim jacket with modern fit");
    record9.set("price", 84.99);
    record9.set("original_price", 119.99);
    record9.set("category", "Women");
    record9.set("sizes", "XS,S,M,L,XL");
    record9.set("colors", "Light Blue,Dark Blue,Black");
    record9.set("stock_quantity", 32);
    record9.set("rating", 4.5);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Stainless Steel Watch");
    record10.set("description", "Elegant stainless steel watch with precision movement");
    record10.set("price", 199.99);
    record10.set("original_price", 299.99);
    record10.set("category", "Accessories");
    record10.set("sizes", "One Size");
    record10.set("colors", "Silver,Gold,Black");
    record10.set("stock_quantity", 15);
    record10.set("rating", 4.9);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Leather Belt");
    record11.set("description", "Premium leather belt with quality buckle");
    record11.set("price", 39.99);
    record11.set("original_price", 59.99);
    record11.set("category", "Accessories");
    record11.set("sizes", "28,30,32,34,36,38,40");
    record11.set("colors", "Black,Brown,Tan");
    record11.set("stock_quantity", 70);
    record11.set("rating", 4.4);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "Canvas Crossbody Bag");
    record12.set("description", "Durable canvas bag perfect for daily use");
    record12.set("price", 54.99);
    record12.set("original_price", 79.99);
    record12.set("category", "Accessories");
    record12.set("sizes", "One Size");
    record12.set("colors", "Black,Navy,Khaki,Gray");
    record12.set("stock_quantity", 45);
    record12.set("rating", 4.6);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Wool Scarf");
    record13.set("description", "Soft wool scarf for warmth and style");
    record13.set("price", 34.99);
    record13.set("original_price", 49.99);
    record13.set("category", "Accessories");
    record13.set("sizes", "One Size");
    record13.set("colors", "Navy,Gray,Black,Burgundy");
    record13.set("stock_quantity", 60);
    record13.set("rating", 4.5);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Designer Sunglasses");
    record14.set("description", "Stylish sunglasses with UV protection");
    record14.set("price", 89.99);
    record14.set("original_price", 149.99);
    record14.set("category", "Accessories");
    record14.set("sizes", "One Size");
    record14.set("colors", "Black,Brown,Gold");
    record14.set("stock_quantity", 25);
    record14.set("rating", 4.7);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Casual Polo Shirt");
    record15.set("description", "Classic polo shirt for casual and semi-formal occasions");
    record15.set("price", 44.99);
    record15.set("original_price", 64.99);
    record15.set("category", "Men");
    record15.set("sizes", "XS,S,M,L,XL,XXL");
    record15.set("colors", "White,Navy,Black,Red");
    record15.set("stock_quantity", 55);
    record15.set("rating", 4.3);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Cargo Pants");
    record16.set("description", "Practical cargo pants with multiple pockets");
    record16.set("price", 64.99);
    record16.set("original_price", 89.99);
    record16.set("category", "Men");
    record16.set("sizes", "28,30,32,34,36,38");
    record16.set("colors", "Khaki,Black,Navy,Olive");
    record16.set("stock_quantity", 40);
    record16.set("rating", 4.2);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Linen Shirt");
    record17.set("description", "Breathable linen shirt perfect for summer");
    record17.set("price", 54.99);
    record17.set("original_price", 79.99);
    record17.set("category", "Men");
    record17.set("sizes", "S,M,L,XL,XXL");
    record17.set("colors", "White,Cream,Light Blue");
    record17.set("stock_quantity", 35);
    record17.set("rating", 4.4);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Maxi Dress");
    record18.set("description", "Elegant maxi dress for evening wear");
    record18.set("price", 119.99);
    record18.set("original_price", 169.99);
    record18.set("category", "Women");
    record18.set("sizes", "XS,S,M,L,XL");
    record18.set("colors", "Black,Navy,Burgundy,Gold");
    record18.set("stock_quantity", 18);
    record18.set("rating", 4.8);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Skinny Jeans");
    record19.set("description", "Classic skinny fit jeans with stretch");
    record19.set("price", 69.99);
    record19.set("original_price", 99.99);
    record19.set("category", "Women");
    record19.set("sizes", "24,25,26,27,28,29,30");
    record19.set("colors", "Dark Blue,Black,Light Blue");
    record19.set("stock_quantity", 50);
    record19.set("rating", 4.5);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("name", "Leather Handbag");
    record20.set("description", "Premium leather handbag with elegant design");
    record20.set("price", 149.99);
    record20.set("original_price", 229.99);
    record20.set("category", "Accessories");
    record20.set("sizes", "One Size");
    record20.set("colors", "Black,Brown,Tan");
    record20.set("stock_quantity", 12);
    record20.set("rating", 4.9);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("name", "Baseball Cap");
    record21.set("description", "Classic baseball cap for casual style");
    record21.set("price", 24.99);
    record21.set("original_price", 34.99);
    record21.set("category", "Accessories");
    record21.set("sizes", "One Size");
    record21.set("colors", "Black,Navy,White,Gray");
    record21.set("stock_quantity", 80);
    record21.set("rating", 4.3);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("name", "Silk Tie");
    record22.set("description", "Premium silk tie for formal occasions");
    record22.set("price", 44.99);
    record22.set("original_price", 69.99);
    record22.set("category", "Accessories");
    record22.set("sizes", "One Size");
    record22.set("colors", "Navy,Black,Burgundy,Gold");
    record22.set("stock_quantity", 35);
    record22.set("rating", 4.6);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("name", "Hooded Sweatshirt");
    record23.set("description", "Comfortable hooded sweatshirt for casual wear");
    record23.set("price", 59.99);
    record23.set("original_price", 84.99);
    record23.set("category", "Men");
    record23.set("sizes", "XS,S,M,L,XL,XXL");
    record23.set("colors", "Black,Gray,Navy,White");
    record23.set("stock_quantity", 65);
    record23.set("rating", 4.5);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("name", "Crop Top");
    record24.set("description", "Trendy crop top perfect for summer outfits");
    record24.set("price", 34.99);
    record24.set("original_price", 49.99);
    record24.set("category", "Women");
    record24.set("sizes", "XS,S,M,L,XL");
    record24.set("colors", "White,Black,Pink,Yellow");
    record24.set("stock_quantity", 45);
    record24.set("rating", 4.4);
  try {
    app.save(record24);
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
