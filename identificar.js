const fileInput = document.getElementById('fileInput');
const resultDiv = document.getElementById('result');

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        resultDiv.innerHTML = "Identificando a planta, aguarde...";

        reader.onload = function () {
            const imageData = reader.result;
            identifyPlant(imageData);
        };

        reader.readAsDataURL(file);
    }
});

function identifyPlant(imageData) {
    const descriptions = {
        "aloe vera": {
            nomePopular: "Babosa",
            nomeCientifico: "Aloe vera",
            descricao: "A babosa é uma planta suculenta famosa pelo seu gel transparente, que tem propriedades hidratantes, cicatrizantes e anti-inflamatórias. O gel é amplamente utilizado em cosméticos para tratar queimaduras, hidratar a pele e o cabelo. Além disso, o uso interno (sob orientação médica) de babosa pode auxiliar na digestão e no alívio de problemas intestinais. A planta é resistente à seca e fácil de cultivar, sendo comum em jardins e vasos. Porém, o uso de sua casca deve ser evitado, pois pode ser tóxica."
        },
        "peumus boldus": {
            nomePopular: "Boldo",
            nomeCientifico: "Peumus boldus",
            descricao: "O boldo é uma planta medicinal conhecida por suas propriedades digestivas e hepatoprotetoras. Suas folhas contêm substâncias que auxiliam no funcionamento do fígado e no alívio de problemas digestivos, sendo amplamente utilizada na forma de chá."
        },
        "plectranthus barbatus": {
            nomePopular: "Boldo",
            nomeCientifico: "Plectranthus barbatus",
            descricao: "O boldo é uma planta medicinal conhecida por suas propriedades digestivas e hepatoprotetoras. Suas folhas contêm substâncias que auxiliam no funcionamento do fígado e no alívio de problemas digestivos, sendo amplamente utilizada na forma de chá."
        },
        "coleus barbatus": {
            nomePopular: "Boldo",
            nomeCientifico: "Coleus barbatus",
            descricao: "O boldo é uma planta medicinal conhecida por suas propriedades digestivas e hepatoprotetoras. Suas folhas contêm substâncias que auxiliam no funcionamento do fígado e no alívio de problemas digestivos, sendo amplamente utilizada na forma de chá."
        },
        "mentha spicata": {
            nomePopular: "Hortelã",
            nomeCientifico: "Mentha spicata",
            descricao: "A hortelã é uma planta aromática popular, usada principalmente em chás e como tempero na culinária. Suas folhas contêm mentol, que oferece um sabor refrescante e propriedades calmantes, digestivas e descongestionantes. O chá de hortelã é tradicionalmente utilizado para aliviar problemas digestivos, náuseas e resfriados. A hortelã também é cultivada em jardins e vasos por seu aroma agradável e crescimento rápido. Além disso, é usada em cosméticos e produtos de higiene bucal, como balas e cremes dentais."
        },
        "mentha suaveolens": {
            nomePopular: "Hortelã",
            nomeCientifico: "Mentha suaveolens",
            descricao: "A hortelã é uma planta aromática popular, usada principalmente em chás e como tempero na culinária. Suas folhas contêm mentol, que oferece um sabor refrescante e propriedades calmantes, digestivas e descongestionantes. O chá de hortelã é tradicionalmente utilizado para aliviar problemas digestivos, náuseas e resfriados. A hortelã também é cultivada em jardins e vasos por seu aroma agradável e crescimento rápido. Além disso, é usada em cosméticos e produtos de higiene bucal, como balas e cremes dentais."
        },
        "pereskia aculeata": {
            nomePopular: "Ora-pro-nóbis",
            nomeCientifico: "Pereskia aculeata",
            descricao: "A ora-pro-nóbis é uma planta trepadeira que se destaca por seu alto valor nutricional. Suas folhas são ricas em proteínas, fibras, ferro e cálcio, sendo usadas na alimentação, especialmente em sopas, refogados e até pães. Além disso, é popular na medicina tradicional por suas propriedades anti-inflamatórias, cicatrizantes e para ajudar no controle do colesterol e diabetes. Também é cultivada como planta ornamental, com seus espinhos e folhas atraindo atenção em cercas-vivas e jardins."
        },
        "psidium guajava": {
            nomePopular: "Goiabeira",
            nomeCientifico: "Psidium guajava",
            descricao: "A goiabeira é uma árvore frutífera tropical, conhecida por seu fruto saboroso e nutritivo. As goiabas são ricas em vitamina C, fibras e antioxidantes, sendo consumidas in natura ou processadas em sucos, doces e geleias. As folhas da goiabeira também têm propriedades medicinais, sendo usadas para tratar diarreias, reduzir o colesterol e melhorar a digestão. Além de sua importância na alimentação, a goiabeira também é cultivada ornamentalmente em pomares e jardins, atraindo polinizadores com suas flores brancas."
        }
    };

    fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
            "Content-Type": "https://api.plant.id/v2/identify",
            "Api-Key": "khL6Rl2E9vfxZlDaghj2GKb4nIvLDWcyM4NZec0Lftcv7tNrWH"
        },
        body: JSON.stringify({
            images: [imageData],
            plant_language: "pt",
            plant_details: ["common_names", "url", "name_authority", "wiki_description"]
        })
    })
    .then(response => response.json())
    .then(data => {
        const suggestion = data?.suggestions?.[0];
        if (suggestion) {
            const name = suggestion.plant_name.toLowerCase();
            const confidence = (suggestion.probability * 100).toFixed(2);
            const planta = descriptions[name];

            if (planta) {
                resultDiv.innerHTML = `
                <strong>Nome Popular:</strong> ${planta.nomePopular}<br>
                <strong>Nome Científico:</strong> ${planta.nomeCientifico}<br>
                <strong>Confiança:</strong> ${confidence}%<br><br>
                <strong>Descrição:</strong> ${planta.descricao}<br><br>
                <a href="pesquisar.html">
                    <button class="saiba-mais-btn">Pesquise com IA</button>
                </a>
            `;
            
            } else {
                resultDiv.innerHTML = `
                    Planta identificada como: <strong>${name}</strong><br>
                    Confiança: ${confidence}%<br><br>
                    Esta planta não está entre as 5 do projeto.
                `;
            }
        } else {
            resultDiv.innerHTML = "Não foi possível identificar a planta.";
        }
    })
    .catch(error => {
        console.error("Erro ao identificar planta:", error);
        resultDiv.innerHTML = "Erro ao identificar a planta.";
    });
}
