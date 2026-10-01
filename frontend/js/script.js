// ==========================================
// MENU DO SISTEMA
// ==========================================

const linksMenu = {
    "Início": "index.html",
    "Cavalos": "cavalos.html",
    "Passeios": "passeios.html",
    "Clientes": "clientes.html",
    "Proprietários": "proprietarios.html",
    "Equipamentos": "equipamentos.html",
    "Shop": "shop.html",
    "Relatórios": "relatorios.html"
};

const itensMenu = document.querySelectorAll('.menu .menu-item');

itensMenu.forEach(item => {

    const texto = item.textContent.trim();

    if (linksMenu[texto]) {
        item.href = linksMenu[texto];
    }

});


// ==========================================
// CAVALOS
// ==========================================

async function carregarCavalos() {

    const grid = document.querySelector('.horses-grid');

    // Se a página não tiver a área dos cavalos,
    // não faz nada.
    if (!grid) {
        return;
    }

    try {

        const resposta = await fetch(
            'http://localhost:3001/cavalos'
        );

        if (!resposta.ok) {
            throw new Error('Erro ao buscar os cavalos');
        }

        const cavalos = await resposta.json();

        grid.innerHTML = '';

        cavalos.forEach(cavalo => {

            // Remove acentos para encontrar
            // o nome correto da imagem
            const nomeImagem = cavalo.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();

            const disponibilidade =
                cavalo.disponibilidade
                    ? 'Disponível'
                    : 'Indisponível';

            const classeDisponibilidade =
                cavalo.disponibilidade
                    ? 'available'
                    : 'unavailable';

            const card =
                document.createElement('article');

            card.className = 'horse-card';

            card.innerHTML = `

                <div class="horse-image">

                    <img
                        src="images/${nomeImagem}.jpg"
                        alt="${cavalo.nome}"
                    >

                </div>


                <div class="horse-info">

                    <h4>
                        ${cavalo.nome}
                    </h4>

                    <p>
                        ${cavalo.raca}
                    </p>


                    <div class="horse-details">

                        <span>
                            Baia ${String(cavalo.baia).padStart(2, '0')}
                        </span>

                        <span class="${classeDisponibilidade}">
                            ● ${disponibilidade}
                        </span>

                    </div>

                </div>

            `;

            grid.appendChild(card);

        });

    } catch (erro) {

        console.error(
            'Erro ao carregar cavalos:',
            erro
        );

    }

}


// Executa o carregamento
carregarCavalos();