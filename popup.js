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

    if (!isValidJsonStructure(data)) {
      throw new Error("Некорректная структура JSON");
    }

    const totalCost = items.reduce((sum, item) => {
      const cost = parseFloat(item.cost_value) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + cost * quantity;
    }, 0);

    document.getElementById("totalCost").textContent = `${totalCost.toFixed(2)}\u00A0руб`;
    document.getElementById("claimId").textContent = claim.id;

    let orderIds = [...new Set(routePoints
      .map(point => point.external_order_id)
      .filter(id => id && id.trim() !== ""))]
      .join(", ");    
    
    const orderIdText = orderIds === "" ? "отсутствует" : orderIds;
    document.getElementById("orderId").textContent = orderIdText;

    // Формирование текста для быстрого ответа
    document.getElementById("copyTextFast").value = 
      orderIdText === "отсутствует" ? claim.id : `${claim.id} ${orderIdText}`;

    const createdDate = new Date(claim.created_ts);
    const options = { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = createdDate.toLocaleString('ru-RU', options).split(',')[0];
    const [day, month] = formattedDate.split('.');
    const shortDate = `${day}.${month}`;

     function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
      return "";
    }

    const template = getCookie("textTemplate") || "";

    const preparedText = template
      .replace(/\$Дата\$/g, shortDate)
      .replace(/\$ОЦ\$/g, `${totalCost.toFixed(2)} руб`)
      .replace(/\$IDO\$/g, orderIdText)
      .replace(/\$ЭТН\$/g, claim.id);

    const copyTextElement = document.getElementById("copyText");
    if (copyTextElement) {
      copyTextElement.value = preparedText;
    }

  } catch (error) {
    dangerAlert("Ошибка обработки JSON: " + error.message);
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const textToCopy = document.getElementById("copyText").value;

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        successAlert("Текст скопирован успешно!")
      })
      .catch(err => {
        warningAlert("Не удалось скопировать текст.");
      });
  } else {
    infoAlert("Нет текста для копирования.");
  }
});

function isValidJsonStructure(data) {
  return typeof data === 'object' &&
         data.claim &&
         Array.isArray(data.claim.route_points) &&
         Array.isArray(data.claim.items);
}
