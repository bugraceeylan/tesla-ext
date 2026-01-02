(async () => {
  console.log("🚀 BOT BAŞLATILDI (Debug Fixli)");

  const fullUrl = "https://www.tesla.com/inventory/api/v4/inventory-results?query=" +
    encodeURIComponent(JSON.stringify({
      query: { model: "my", condition: "new", options: {}, arrangeby: "Price", order: "asc", market: "NL", language: "nl", super_region: "emea" },
      offset: 0, count: 50, outsideOffset: 0, outsideSearch: false
    }));

  const checkInventory = async () => {
    try {
      const res = await fetch(fullUrl, { credentials: "include" });
      console.log("🔁 HTTP Status:", res.status);
      const data = await res.json();
      console.log("📦 Inventory Response:", data);

      const vehicle = data.results?.[0];
      if (vehicle) {
        console.log(`✅ Araç bulundu: ${data.total_matches_found}`);
        const vehicle = data.results?.[0];
        console.log("JSON",JSON.stringify(vehicle, null, 2));

        console.log("🔍 Araç Key'leri:", Object.keys(vehicle));
        console.log("📦 ADL_OPTS:", vehicle.ADL_OPTS);
        console.log("📦 OptionCodeData:", vehicle.OptionCodeData);
        console.log("📦 CompositorViews:", vehicle.CompositorViews);        const inventoryId = vehicle.InventoryID || vehicle.Inventory_ID || vehicle.id;
        const vin = vehicle.VIN || vehicle.vin;

        console.log("❗ VIN:", vin, "InventoryID:", inventoryId);

        if (inventoryId) {
          const rn = await createReservation(inventoryId);
          console.log("✅ RN:", rn);
        } else {
          console.error("❌ Inventory ID bulunamadı");
        }
      } else {
        console.log("⏳ Henüz sonuç yok.");
      }
    } catch (err) {
      console.error("❌ Hata:", err);
    }
  };

  const createReservation = async (inventoryId) => {
    const payload = {
      locale: "nl_NL",
      model: "my",
      inventoryId,
      trim: "modely",
      paint: "PMNG",
      wheels: "WY19B",
      interior: "IBW0",
      deliveryPostalCode: "1011",
      deliveryLocation: "Amsterdam",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "+31612345678",
      terms: true
    };

    const res = await fetch("/coinorder/api/v4/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json?.reservationNumber) return json.reservationNumber;
    throw new Error("Rezervasyon başarısız: " + JSON.stringify(json));
  };

  setInterval(checkInventory, 5000);
})();
