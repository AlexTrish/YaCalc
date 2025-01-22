document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('settingsMenu').style.display = 'flex';
  });
  
  document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex';
  });
  
  document.getElementById('ChangeMacros').addEventListener('click', () => {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('editMacros').style.display = 'flex';
  })
  
  document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('editMacros').style.display = 'none';
    document.getElementById('settingsMenu').style.display = 'flex';
  })
  
  
  const inputMacros = document.getElementById('inputMacros');
  const highlightedMacros = document.getElementById('highlightedMacros');
  
  function updateHighlighting() {
    const text = inputMacros.value;
  
    const regex = /\$(Дата|ОЦ|ЭТН|IDO)\$/g;
  
    const highlightedText = text.replace(regex, match => {
      const keyword = match.slice(1, -1);
      return `<span style="color: #964f4f;">$</span><span style="color: #058001;">${keyword}</span><span style="color: #964f4f;">$</span>`;
    });

    highlightedMacros.innerHTML = `<span style="font-weight: 400; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; color: black;">${highlightedText}</span><br/>`;
  }
  
  inputMacros.style.color = 'transparent';
  inputMacros.style.caretColor = '#000';
  
  inputMacros.addEventListener('input', updateHighlighting);
  
  inputMacros.addEventListener('scroll', () => {
    highlightedMacros.scrollTop = inputMacros.scrollTop;
  });


  document.getElementById("saveBtn").addEventListener("click", () => {
    const macrosText = document.getElementById("inputMacros").value;
  
    document.cookie = `textTemplate=${encodeURIComponent(macrosText)};path=/;max-age=31536000`;
    successAlert("Шаблон успешно сохранён!");
    document.getElementById('editMacros').style.display = 'none';
    document.getElementById('settingsMenu').style.display = 'flex';
  });





  (function() {
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlertBtn = document.getElementById('closeAlertBtn');
    
    function showCustomAlert(message, type = 'success') {
      alertMessage.textContent = message;
      
      customAlert.classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');
      customAlert.classList.add(`alert-${type}`);
      customAlert.classList.add('show');
      customAlert.style.display = 'grid';
  

      setTimeout(() => {
        customAlert.classList.remove('show');
        customAlert.style.display = 'none';
      }, 5000);
    }
  
    closeAlertBtn.addEventListener('click', () => {
      customAlert.classList.remove('show');
      customAlert.style.display = 'none';
    });
  
    window.alert = function(message) {
      showCustomAlert(message, 'success');
    };

    window.successAlert = function(message) {
      showCustomAlert(message, 'success');
    };
  
    window.dangerAlert = function(message) {
      showCustomAlert(message, 'danger');
    };
  
    window.warningAlert = function(message) {
      showCustomAlert(message, 'warning');
    };
  
    window.infoAlert = function(message) {
      showCustomAlert(message, 'info');
    };
  })();
  
  