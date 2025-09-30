// ============================================
// MÚSICA LITÚRGICA CATÓLICA - JAVASCRIPT
// ============================================

// ==========================================
// 1. MENU MOBILE - Fechar ao clicar em link
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navigationLinks = document.querySelectorAll('.navigation a');

  // Fechar menu ao clicar em qualquer link
  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menuToggle) {
        menuToggle.checked = false;
      }
    });
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.header');
    const navigation = document.querySelector('.navigation');

    if (menuToggle && menuToggle.checked) {
      if (!header.contains(e.target) && !navigation.contains(e.target)) {
        menuToggle.checked = false;
      }
    }
  });
});

// ==========================================
// 2. FORMULÁRIO DE CONTATO - Validação e Alertas
// ==========================================
function validarFormularioContato() {
  const form = document.querySelector('form');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    // Validações
    if (nome === '') {
      mostrarAlerta('Por favor, preencha seu nome completo.', 'erro');
      return;
    }

    if (nome.length < 3) {
      mostrarAlerta('Nome deve ter pelo menos 3 caracteres.', 'erro');
      return;
    }

    if (email === '') {
      mostrarAlerta('Por favor, preencha seu e-mail.', 'erro');
      return;
    }

    if (!validarEmail(email)) {
      mostrarAlerta('Por favor, insira um e-mail válido.', 'erro');
      return;
    }

    if (assunto === '') {
      mostrarAlerta('Por favor, selecione um assunto.', 'erro');
      return;
    }

    if (mensagem === '') {
      mostrarAlerta('Por favor, escreva uma mensagem.', 'erro');
      return;
    }

    if (mensagem.length < 10) {
      mostrarAlerta('A mensagem deve ter pelo menos 10 caracteres.', 'erro');
      return;
    }

    // Se passou em todas as validações
    mostrarAlerta(
      `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. Retornaremos em breve para ${email}.`,
      'sucesso'
    );

    // Limpar formulário após 2 segundos
    setTimeout(() => {
      form.reset();
    }, 2000);
  });
}

// Função auxiliar para validar e-mail
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ==========================================
// 3. SISTEMA DE ALERTAS
// ==========================================
function mostrarAlerta(mensagem, tipo) {
  // Remover alerta anterior se existir
  const alertaExistente = document.querySelector('.alerta-feedback');
  if (alertaExistente) {
    alertaExistente.remove();
  }

  // Criar elemento de alerta
  const alerta = document.createElement('div');
  alerta.className = `alerta-feedback alerta-${tipo}`;
  alerta.innerHTML = `
        <span class="alerta-icone">${tipo === 'sucesso' ? '✓' : '⚠'}</span>
        <span class="alerta-mensagem">${mensagem}</span>
        <button class="alerta-fechar" onclick="this.parentElement.remove()">×</button>
    `;

  // Adicionar ao body
  document.body.appendChild(alerta);

  // Animar entrada
  setTimeout(() => {
    alerta.classList.add('alerta-show');
  }, 10);

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    alerta.classList.remove('alerta-show');
    setTimeout(() => {
      alerta.remove();
    }, 300);
  }, 5000);
}

// ==========================================
// 4. FILTRO DE CURSOS (Página de Cursos)
// ==========================================
function inicializarFiltroCursos() {
  const cursosContainer = document.querySelector('.courses-container');

  if (!cursosContainer) return;

  // Criar barra de filtros
  const heroSection = document.querySelector('.courses-hero');

  if (!heroSection || document.querySelector('.filter-bar')) return;

  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  filterBar.innerHTML = `
        <h3>Filtrar Cursos:</h3>
        <div class="filter-buttons">
            <button class="filter-btn active" data-filter="todos">Todos</button>
            <button class="filter-btn" data-filter="online">Online</button>
            <button class="filter-btn" data-filter="presencial">Presencial</button>
            <button class="filter-btn" data-filter="hibrido">Híbrido</button>
        </div>
        <div class="search-bar">
            <input type="text" id="search-cursos" placeholder="🔍 Buscar cursos..." />
        </div>
    `;

  heroSection.appendChild(filterBar);

  // Adicionar eventos aos botões de filtro
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Remover active de todos
      filterButtons.forEach((b) => b.classList.remove('active'));
      // Adicionar active no clicado
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      filtrarCursos(filter);
    });
  });

  // Adicionar evento de busca
  const searchInput = document.getElementById('search-cursos');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      buscarCursos(this.value);
    });
  }
}

function filtrarCursos(filtro) {
  const cards = document.querySelectorAll('.course-card');

  cards.forEach((card) => {
    if (filtro === 'todos') {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
    } else {
      const badge = card.querySelector(`.badge.${filtro}`);

      if (badge) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    }
  });

  // Mostrar mensagem se não houver resultados
  verificarResultados();
}

function buscarCursos(termo) {
  const cards = document.querySelectorAll('.course-card');
  termo = termo.toLowerCase();

  let encontrados = 0;

  cards.forEach((card) => {
    const titulo = card.querySelector('h3').textContent.toLowerCase();
    const descricao = card.querySelector('p').textContent.toLowerCase();

    if (titulo.includes(termo) || descricao.includes(termo)) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
      encontrados++;
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });

  verificarResultados();
}

function verificarResultados() {
  const cursosContainer = document.querySelector('.courses-container');
  const cards = document.querySelectorAll('.course-card');
  const visibleCards = Array.from(cards).filter(
    (card) => card.style.display !== 'none'
  );

  // Remover mensagem anterior se existir
  const mensagemExistente = document.querySelector('.no-results');
  if (mensagemExistente) {
    mensagemExistente.remove();
  }

  if (visibleCards.length === 0) {
    const mensagem = document.createElement('div');
    mensagem.className = 'no-results';
    mensagem.innerHTML = `
            <p>😔 Nenhum curso encontrado com os filtros selecionados.</p>
            <button onclick="resetarFiltros()" class="btn-reset">Limpar Filtros</button>
        `;
    cursosContainer.appendChild(mensagem);
  }
}

function resetarFiltros() {
  // Resetar botões
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn) => btn.classList.remove('active'));
  document.querySelector('[data-filter="todos"]').classList.add('active');

  // Resetar busca
  const searchInput = document.getElementById('search-cursos');
  if (searchInput) {
    searchInput.value = '';
  }

  // Mostrar todos os cursos
  filtrarCursos('todos');
}

// ==========================================
// 5. BOTÕES DA HOME - Funcionalidade
// ==========================================
function configurarBotoesHome() {
  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      const texto = this.textContent.toLowerCase();

      if (texto.includes('entrar')) {
        mostrarAlerta(
          'Funcionalidade de login em desenvolvimento. Entre em contato para mais informações.',
          'info'
        );
      } else if (texto.includes('cursos')) {
        window.location.href = 'cursos.html';
      }
    });
  });
}

// ==========================================
// 6. ANIMAÇÃO DE SCROLL SUAVE
// ==========================================
function configurarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ==========================================
// 7. CONTADOR DE CARACTERES NO TEXTAREA
// ==========================================
function adicionarContadorCaracteres() {
  const textarea = document.getElementById('mensagem');

  if (!textarea) return;

  const container = textarea.parentElement;
  const contador = document.createElement('div');
  contador.className = 'contador-caracteres';
  contador.innerHTML = '<span id="char-count">0</span> / 500 caracteres';

  container.appendChild(contador);

  textarea.setAttribute('maxlength', '500');

  textarea.addEventListener('input', function () {
    const count = this.value.length;
    document.getElementById('char-count').textContent = count;

    if (count > 450) {
      contador.style.color = '#e76f51';
    } else {
      contador.style.color = '#666';
    }
  });
}

// ==========================================
// INICIALIZAÇÃO GLOBAL
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  validarFormularioContato();
  inicializarFiltroCursos();
  configurarBotoesHome();
  configurarScrollSuave();
  adicionarContadorCaracteres();

  console.log(
    '✅ JavaScript carregado com sucesso - Música Litúrgica Católica'
  );
});
