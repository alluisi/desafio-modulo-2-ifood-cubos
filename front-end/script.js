const filmes = document.querySelector('.movies');
const setaDireita = document.querySelector('.btn-next');
const setaEsquerda = document.querySelector('.btn-prev');
const pesquisar = document.querySelector('.input');
const destaque = document.querySelector('.highlight');
const modal = document.querySelector(".modal");
const modalFechar = document.querySelector(".modal__close");
const modalTitulo = document.querySelector(".modal__title");
const modalImagem = document.querySelector(".modal__img");
const modalDescricao = document.querySelector(".modal__description");
const modalDivGeneros = document.querySelector(".modal__genres");
const modalClassificacao = document.querySelector(".modal__average");
const body = document.querySelector('body');
const themeButton = document.querySelector('.btn-theme');

function iniciarPagina() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (resposta) {
        if (!resposta.ok) {
            console.log("ERRO");
            return;
        }

        const promiseBody = resposta.json();
        buscarFilmes(promiseBody);
        destaqueDoDiaInfo();
    });
}

iniciarPagina();

function buscarFilmes(promessa) {
    promessa.then(function (body) {
        body.results.forEach(function (filme) {
            const cartaz = document.createElement('div');
            cartaz.classList.add('movie');
            cartaz.setAttribute('id', filme.id);
            cartaz.classList.add('hidden');
            cartaz.style.backgroundImage = `url(${filme.poster_path})`;

            const informacoes = document.createElement('div');
            informacoes.classList.add('movie__info');

            const titulo = document.createElement('span');
            titulo.classList.add('movie__title');
            titulo.textContent = filme.title;

            const estrela = document.createElement('img');
            estrela.src = './assets/estrela.svg';
            estrela.alt = 'Estrela';

            const avaliacao = document.createElement('span');
            avaliacao.classList.add('movie__rating');

            avaliacao.append(estrela);
            avaliacao.innerHTML += filme.vote_average;

            informacoes.append(titulo, avaliacao);
            cartaz.append(informacoes);
            filmes.append(cartaz);
        });

        carrosselDeFilmes(filmes);
        controlarModal(filmes);
    });
}

function carrosselDeFilmes(movies) {
    function primeiraPagina() {
        for (let i = 0; i < 5; i++) {
            (movies.children[i]).classList.remove('hidden');
        }
    }

    primeiraPagina();

    function segundaPagina() {
        for (let i = 5; i < 10; i++) {
            (movies.children[i]).classList.remove('hidden');
        }
    }

    function terceiraPagina() {
        for (let i = 10; i < 15; i++) {
            (movies.children[i]).classList.remove('hidden');
        }
    }

    function quartaPagina() {
        for (let i = 15; i < 20; i++) {
            (movies.children[i]).classList.remove('hidden');
        }
    }

    let pagina = 0;
    setaDireita.addEventListener('click', function () {
        for (let div of movies.children) {
            div.classList.add('hidden');
        }

        if (pagina === 0) {
            segundaPagina();
        } else if (pagina === 1) {
            terceiraPagina();
        } else if (pagina === 2) {
            quartaPagina();
        } else {
            primeiraPagina()
        }

        if (pagina < 4) {
            pagina++;
        } else {
            pagina = 0;
        }
    });

    setaEsquerda.addEventListener('click', function () {
        for (let div of movies.children) {
            div.classList.add('hidden');
        }

        if (pagina === 0) {
            quartaPagina();
        } else if (pagina === 3) {
            terceiraPagina();
        } else if (pagina === 2) {
            segundaPagina();
        } else {
            primeiraPagina()
        }

        if (pagina > 0) {
            pagina--;
        } else {
            pagina = 3;
        }
    });
}

function destaqueDoDiaInfo() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (resposta) {
        if (!resposta.ok) {
            console.log("ERRO");
            return;
        }

        buscarDestaques(resposta);
    });
}

function buscarDestaques(promessa) {
    const promiseBody = promessa.json();
    promiseBody.then(function (body) {

        const link = assistirVideo();

        const tela = document.createElement('div');
        tela.classList.add('highlight__video');
        tela.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url(${body.backdrop_path}) no-repeat center / cover`;

        const play = document.createElement('img');
        play.src = './assets/play.svg';
        play.alt = 'Play';

        tela.append(play);
        link.append(tela);

        const info = document.createElement('div');
        info.classList.add('highlight__info');

        const infoTitulo = document.createElement('div');
        infoTitulo.classList.add('highlight__title-rating');

        const titulo = document.createElement('h3');
        titulo.classList.add('highlight__title');
        titulo.textContent = body.title;

        const avaliacao = document.createElement('span');
        avaliacao.classList.add('highlight__rating');
        avaliacao.textContent = body.vote_average;

        infoTitulo.append(titulo, avaliacao);

        const infoGenero = document.createElement('div');
        infoGenero.classList.add('highlight__genre-launch');

        const genero = document.createElement('span');
        genero.classList.add('highlight__genres');
        genero.textContent = buscarGeneros(body);

        const data = document.createElement('span');
        data.classList.add('highlight__launch');
        data.textContent = editarData(body);

        infoGenero.append(genero, data);

        const descricao = document.createElement('p');
        descricao.classList.add('highlight__description');
        descricao.textContent = body.overview;

        info.append(infoTitulo, infoGenero, descricao);
        destaque.append(link, info);
    });
}

function assistirVideo() {
    const link = document.createElement('a');
    link.classList.add('highlight__video-link');
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`).then(function (resposta) {
        if (!resposta.ok) {
            console.log("ERRO");
            return;
        }

        const promiseBody = resposta.json();
        promiseBody.then(function (body) {
            link.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
            link.target = '_blank';
        });
    });
    return link;
}

function buscarGeneros(busca) {
    let generos = "";
    for (let i = 0; i < busca.genres.length; i++) {
        if (i === (busca.genres.length - 1)) {
            generos += busca.genres[i].name;
        } else {
            generos += `${busca.genres[i].name}, `;
        }
    }
    return generos;
}

function editarData(busca) {
    let ano = "";
    let mes = "";
    let dia = "";
    for (let i = 0; i < busca.release_date.length; i++) {
        if (i < 4) {
            ano += busca.release_date[i];
        } else if (i > 4 && i < 7) {
            mes += busca.release_date[i];
        } else if (i > 7) {
            dia += busca.release_date[i];
        }
    }

    if (mes === '01') {
        mes = 'janeiro';
    } else if (mes === '02') {
        mes = 'fevereiro';
    } else if (mes === '03') {
        mes = 'março';
    } else if (mes === '04') {
        mes = 'abril';
    } else if (mes === '05') {
        mes = 'maio';
    } else if (mes === '06') {
        mes = 'junho';
    } else if (mes === '07') {
        mes = 'julho';
    } else if (mes === '08') {
        mes = 'agosto';
    } else if (mes === '09') {
        mes = 'setembro';
    } else if (mes === '10') {
        mes = 'outubro';
    } else if (mes === '11') {
        mes = 'novembro';
    } else {
        mes = 'dezembro';
    }

    const span = ` / ${dia} de ${mes} de ${ano}`;
    return span;
}

pesquisar.addEventListener('keydown', function (event) {
    if (!teclouEnter(event.code)) {
        return;
    } else if (!event.target.value) {
        limparPagina();
        iniciarPagina();
    } else {
        limparPagina();
        pesquisarTitulo();
    }

    limparInput(event.target);
});

function teclouEnter(tecla) {
    return tecla === 'Enter';
}

function limparPagina() {
    while (filmes.childNodes.length !== 0) {
        for (let div of filmes.childNodes) {
            div.remove();
        }
    }

    while (destaque.childNodes.length !== 0) {
        for (let div of destaque.childNodes) {
            div.remove();
        }
    }
}

function pesquisarTitulo() {
    const promiseResposta = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${pesquisar.value}`);
    promiseResposta.then(function (resposta) {
        if (!resposta.ok) {
            console.log("ERRO");
            return;
        }

        const promiseBody = resposta.json();
        buscarFilmes(promiseBody);
        destaqueDoDiaInfo();
    });
}

function limparInput(input) {
    input.value = '';
}

function controlarModal(movies) {
    abrirModal(movies);
    fecharModal();
}

function abrirModal(movies) {
    for (let item of movies.childNodes) {
        item.addEventListener("click", function () {
            const promiseResposta = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${item.id}?language=pt-BR`);
            promiseResposta.then(function (resposta) {
                if (!resposta.ok) {
                    console.log("ERRO");
                    return;
                }

                const promiseBody = resposta.json();
                criarModal(promiseBody);
            });
        });
    }
}

function criarModal(promessa) {
    promessa.then(function (body) {
        modalTitulo.textContent = body.title;
        modalImagem.src = body.backdrop_path;
        modalDescricao.textContent = body.overview;

        while (modalDivGeneros.childNodes.length !== 0) {
            for (let div of modalDivGeneros.childNodes) {
                div.remove();
            }
        }

        for (let item of body.genres) {
            const genero = document.createElement('span');
            genero.classList.add('modal__genre');
            genero.textContent = item.name;
            modalDivGeneros.append(genero);
        }

        modalClassificacao.textContent = body.vote_average;
    });
    modal.classList.remove('hidden');
}

function fecharModal() {
    modal.addEventListener("click", function (event) {
        modal.classList.add('hidden');
        event.stopPropagation();
    });

    modalFechar.addEventListener("click", function (event) {
        modal.classList.add('hidden');
        event.stopPropagation();
    });
}

const temaInicial = localStorage.getItem('tema');

themeButton.src = temaInicial === 'claro' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
setaDireita.src = temaInicial === 'claro' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';
setaEsquerda.src = temaInicial === 'claro' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';
body.style.setProperty('--cor-input', temaInicial === 'claro' ? '#979797' : '#FFFFFF');
//body.style.setProperty('--cor-de-fundo--input', temaInicial === 'claro' ? '#FFFFFF' : '#242424');
body.style.setProperty('--cor-de-texto', temaInicial === 'claro' ? '#000000' : '#FFFFFF');
body.style.setProperty('--cor-de-fundo', temaInicial === 'claro' ? '#FFFFFF' : '#242424');
body.style.setProperty('--cor-de-fundo--info', temaInicial === 'claro' ? '#FFFFFF' : '#454545');
body.style.setProperty('--cor-box--info', temaInicial === 'claro' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)');
body.style.setProperty('--cor-avaliacao', temaInicial === 'claro' ? '#A785ED' : '#A987ED');
body.style.setProperty('--cor-genero-data', temaInicial === 'claro' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)');

themeButton.addEventListener('click', function () {
    const temaInicial = localStorage.getItem('tema');

    themeButton.src = temaInicial === 'escuro' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
    setaDireita.src = temaInicial === 'escuro' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';
    setaEsquerda.src = temaInicial === 'escuro' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';
    body.style.setProperty('--cor-input', temaInicial === 'escuro' ? '#979797' : '#FFFFFF');
    //body.style.setProperty('--cor-de-fundo--input', temaInicial === 'escuro' ? '#FFFFFF' : '#242424');
    body.style.setProperty('--cor-de-texto', temaInicial === 'escuro' ? '#000000' : '#FFFFFF');
    body.style.setProperty('--cor-de-fundo', temaInicial === 'escuro' ? '#FFFFFF' : '#242424');
    body.style.setProperty('--cor-de-fundo--info', temaInicial === 'escuro' ? '#FFFFFF' : '#454545');
    body.style.setProperty('--cor-box--info', temaInicial === 'escuro' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)');
    body.style.setProperty('--cor-avaliacao', temaInicial === 'escuro' ? '#A785ED' : '#A987ED');
    body.style.setProperty('--cor-genero-data', temaInicial === 'escuro' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)');

    localStorage.setItem('tema', temaInicial === 'claro' ? 'escuro' : 'claro');
});