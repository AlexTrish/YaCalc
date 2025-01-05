document.getElementById("filterBtn").addEventListener("click", () => {
  const input = document.getElementById("jsonInput").value;

  try {
    const data = JSON.parse(input);
    const claim = data.claim;
    const routePoints = claim?.route_points || [];
    const items = claim?.items || [];

    if (!claim || !items.length || !routePoints.length) {
      throw new Error("Некорректный формат JSON");
    }

    const totalCost = items.reduce((sum, item) => {
      const cost = parseFloat(item.cost_value) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + cost * quantity;
    }, 0);

    document.getElementById("totalCost").textContent = totalCost.toFixed(2) + "\u00A0руб";
    document.getElementById("claimId").textContent = claim.id;
    document.getElementById("orderId").textContent = routePoints
      .map(point => point.external_order_id)
      .join(", ");
  } catch (error) {
    alert("Ошибка обработки JSON: " + error.message);
  }
});