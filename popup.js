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

    let orderIds = routePoints
      .map(point => point.external_order_id)
      .filter(id => id && id.trim() !== "")
      .join(", ");
    
    const orderIdText = orderIds === "" ? "отсутствует" : orderIds;
    document.getElementById("orderId").textContent = orderIdText;

    const createdDate = new Date(claim.created_ts);
    const options = { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = createdDate.toLocaleString('ru-RU', options).split(',')[0];
    const [day, month] = formattedDate.split('.');
    const shortDate = `${day}.${month}`;

    const preparedText = `
Заказ от ${shortDate}, отправитель - 
Местное время (+00:00) 
сумма заказа ОЦ - ${totalCost.toFixed(2)} руб
Дубли - нет 
Дубли в трекере - нет
№ договора - 
id этн - ${claim.id}
id order - ${orderIdText} 
Батчинг/Мульти/Простой
Звонки в админке - 
По трекеру - 

Причина обращения - 
Мини вывод -
    `.trim();

    const copyTextElement = document.getElementById("copyText");
    if (copyTextElement) {
      copyTextElement.value = preparedText;
    }

  } catch (error) {
    alert("Ошибка обработки JSON: " + error.message);
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const textToCopy = document.getElementById("copyText").value;

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showCopyNotification();
      })
      .catch(err => {
        console.error("Ошибка копирования: ", err);
        alert("Не удалось скопировать текст.");
      });
  } else {
    alert("Нет текста для копирования.");
  }
});

function showCopyNotification() {
  const notification = document.getElementById("copyNotification");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function isValidJsonStructure(data) {
  return typeof data === 'object' &&
         data.claim &&
         Array.isArray(data.claim.route_points) &&
         Array.isArray(data.claim.items);
}