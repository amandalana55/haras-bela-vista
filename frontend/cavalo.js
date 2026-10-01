async function carregarcavalo() {

    try {

        const resposta =
            await fetch('/cavalo');

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }

        const cavalos =
            await resposta.json();

        console.log(
            'cavalos:',
            cavalos
        );

        const grid =
            document.getElementById('horsesGrid');

        if (!grid) {

            console.error(
                'Elemento #horsesGrid não encontrado.'
            );

            return;
        }

        grid.innerHTML = '';

        cavalos.forEach(cavalo => {

            const nomeImagem =
                cavalo.nome
                    .normalize('NFD')
                    .replace(
                        /[\u0300-\u036f]/g,
                        ''
                    )
                    .toLowerCase();

            const card =
                document.createElement('article');

            card.className =
                'horse-card';

            card.addEventListener(
                'click',
                function () {

                    window.location.href =
                        `/cavalo.html?id=${cavalo.id_cavalo}`;

                }
            );

            card.innerHTML = `

                <div class="horse-image">

                    <img
                        src="/images/${nomeImagem}.jpg"
                        alt="${cavalo.nome}"
                        onerror="this.style.display='none'"
                    >

                </div>

                <div class="horse-info">

                    <h4>${cavalo.nome}</h4>

                    <p>${cavalo.raca}</p>

                    <div class="horse-details">

                        <span>
                            Baia
                            ${String(cavalo.baia).padStart(2, '0')}
                        </span>

                        <span class="${
                            cavalo.disponibilidade
                                ? 'available'
                                : 'unavailable'
                        }">

                            ●

                            ${
                                cavalo.disponibilidade
                                    ? 'Disponível'
                                    : 'Indisponível'
                            }

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

carregarcavalo();