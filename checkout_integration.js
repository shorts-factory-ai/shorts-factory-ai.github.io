// site/checkout_integration.js

// URL do seu Script Google (A mesma que voce usa no Webhook)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjfiuU0kW1HrYdM8HgfsAqqrNnXw1I0OHZYBjHNxcRUqAWUDN-sRd82VoBQJzc35ovgg/exec";

async function iniciarCompra() {
    const emailInput = document.getElementById("email-cliente");
    const btn = document.getElementById("btn-comprar");
    const msg = document.getElementById("msg-status");
    
    if (!emailInput || !emailInput.value.includes("@")) {
        alert("Por favor, digite um e-mail válido para receber sua licença.");
        if(emailInput) emailInput.focus();
        return;
    }
    
    const email = emailInput.value.trim();
    
    // UI Loading
    const textoOriginal = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Gerando Link...";
    if(msg) msg.innerText = "Aguarde, conectando ao Mercado Pago...";
    
    try {
        // Envia requisição para o Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "create_preference", email: email }),
            headers: { "Content-Type": "text/plain" } // text/plain evita problemas de CORS no GAS
        });
        
        const data = await response.json();
        
        if (data.checkout_url) {
            if(msg) msg.innerText = "Redirecionando...";
            // Redireciona o usuário para o pagamento
            window.location.href = data.checkout_url;
        } else {
            throw new Error(data.error || "Erro desconhecido ao gerar link");
        }
        
    } catch (error) {
        console.error(error);
        alert("Erro ao iniciar pagamento: " + error.message);
        btn.disabled = false;
        btn.innerText = textoOriginal;
        if(msg) msg.innerText = "Erro. Tente novamente.";
    }
}
