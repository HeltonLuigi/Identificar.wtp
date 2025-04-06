const form = document.getElementById('form-pesquisa');
const perguntaInput = document.getElementById('pergunta');
const respostaDiv = document.getElementById('resposta');
const botao = form.querySelector('button');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pergunta = perguntaInput.value.trim();

    if (!pergunta) {
        respostaDiv.innerHTML = "Digite uma pergunta!";
        return;
    }

    respostaDiv.innerHTML = "";
    botao.innerText = "Pesquisando...";
    botao.disabled = true;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um especialista em plantas medicinais e jardinagem. Responda de forma clara, precisa e em português." },
                    { role: "user", content: pergunta }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            respostaDiv.innerHTML = `Erro: ${data.error.message}`;
            console.error(data.error);
        } else {
            const resposta = data.choices?.[0]?.message?.content;
            respostaDiv.innerHTML = resposta || "Não consegui gerar uma resposta.";
        }
    } catch (error) {
        console.error("Erro ao buscar resposta:", error);
        respostaDiv.innerHTML = "Ocorreu um erro ao buscar a resposta.";
    }

    botao.innerText = "Pesquisar";
    botao.disabled = false;
});
