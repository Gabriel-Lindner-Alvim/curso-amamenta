const totalPaginas = 15;
let paginaAtual = parseInt(sessionStorage.getItem("paginaAtual")) || 1;
const cachePaginas = {};
const imagensPrecarregadas = window.imagensPrecarregadas || new Set();
window.imagensPrecarregadas = imagensPrecarregadas;


async function carregarPagina(numero) {
  try {

    let html;
    if (cachePaginas[numero]) {
      html = cachePaginas[numero];
    } else {
      const resposta = await fetch(`paginas_unidade4/pagina${numero}.html`);
      html = await resposta.text();
      cachePaginas[numero] = html;
    }

    const area = document.getElementById("area-principal");
    area.innerHTML = html;

    function ajustarAlturaFullBleed() {
      const fullBleed = document.querySelector('.full-bleed');
      if (!fullBleed) return;

      // remove altura extra antes de recalcular
      fullBleed.style.minHeight = "";  

      // posição inferior atual da div em relação ao topo da página
      const bottomDiv = fullBleed.getBoundingClientRect().bottom + window.scrollY;

      // altura total do body/documento
      const alturaPagina = document.body.scrollHeight;

      // quanto falta para o final da página
      const faltante = alturaPagina - bottomDiv;

      // aplica a nova altura mínima (conteúdo + espaço faltante)
      fullBleed.style.minHeight = (fullBleed.scrollHeight + Math.max(faltante, 0)) + "px";
    }

    // chama no load inicial
    window.addEventListener("load", ajustarAlturaFullBleed);
    // chama no resize (tela maior → menor ou menor → maior)
    window.addEventListener("resize", ajustarAlturaFullBleed);
    ajustarAlturaFullBleed();


    const accordionButtons = area.querySelectorAll('.accordion-button');
    accordionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.accordion-with-image');
        if (!wrapper) return;

        const imgWrap = wrapper.querySelector('.accordion-footer-img');
        if (!imgWrap) return;

        // alterna visibilidade manualmente
        if (imgWrap.style.display === 'none') {
          imgWrap.style.display = 'block';
        } else {
          imgWrap.style.display = 'none';
        }
      });
    });

        // --- TABS (Green/Yellow/Red sections) ---
    const tabButtons = area.querySelectorAll(".tab-btn");
    const tabPanels = area.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove 'active' from all buttons and panels
        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));

        // Add 'active' to clicked button and matching panel
        btn.classList.add("active");
        const targetPanel = area.querySelector(`#${btn.dataset.tab}`);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });

    const icones = area.querySelectorAll(".icon-button");
    const paineis = area.querySelectorAll(".painel");

    icones.forEach(icone => {
      icone.addEventListener("click", () => {
        icones.forEach((i, index) => {
          i.classList.remove("active");
          const img = i.querySelector("img");
          img.src = `./img/slide8/${index + 1}.svg`; // volta para imagem normal
        });

        paineis.forEach(p => p.classList.remove("active"));

        icone.classList.add("active");

        // troca imagem para versão hover do botão clicado
        const imgAtivo = icone.querySelector("img");
        const indice = Array.from(icones).indexOf(icone) + 1;
        imgAtivo.src = `./img/slide8/${indice}-hover.svg`;

        const painel = area.querySelector(`#${icone.dataset.panel}`);
        if (painel) painel.classList.add("active");
      });
    });
    
    

    const stepButtons = area.querySelectorAll(".step");
    const stepPanels = area.querySelectorAll(".step-panel");

    stepButtons.forEach(step => {
      step.addEventListener("click", () => {
        stepButtons.forEach(s => s.classList.remove("active"));
        stepPanels.forEach(p => p.classList.remove("active"));

        step.classList.add("active");
        const panel = area.querySelector(`#step${step.dataset.step}`);
        if (panel) panel.classList.add("active");
      });
    });

     const hoverBoxes = area.querySelectorAll('.hover-swap');
    hoverBoxes.forEach(box => {
      const topImg = box.querySelector('.variant-top');
      const bottomImg = box.querySelector('.variant-bottom');

      function showTop(){
        topImg.style.opacity = 1;
        bottomImg.style.opacity = 0;
      }
      function showBottom(){
        topImg.style.opacity = 0;
        bottomImg.style.opacity = 1;
      }
      function reset(){
        topImg.style.opacity = 0;
        bottomImg.style.opacity = 0;
      }

      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const half = rect.height / 2;

        if (y < half) {
          showTop();
        } else {
          showBottom();
        }
      });

      box.addEventListener('mouseleave', reset);
    });

    const trigger = area.querySelector('#img-reveal');
    if (trigger) {
      const targetSel = trigger.getAttribute('data-target');
      const target = area.querySelector(targetSel);
      if (target) {
        trigger.addEventListener('click', () => {
          target.classList.toggle('is-open');
          const open = target.classList.contains('is-open');
          target.setAttribute('aria-hidden', String(!open));
          trigger.style.display = "none";
        });
      }
    }

    const elementosParaAnimarDireita = area.querySelectorAll(".animar-slide-direita");
      elementosParaAnimarDireita.forEach(el => {
        el.classList.add("slide-in-right");
      });
    
    const elementosParaAnimarEsquerda = area.querySelectorAll(".animar-slide-esquerda");
    elementosParaAnimarEsquerda.forEach(el => {
      el.classList.add("slide-in-left");
    });
    
    area.querySelectorAll('.thecard').forEach(card => {
        card.addEventListener('click', () => {
          card.classList.toggle('flipped');
        });
      });

    const imagensCards = area.querySelectorAll('.img-hover-effect');
    const cardInicial = area.querySelector('.img-3');
      if (cardInicial) {
        cardInicial.classList.add('active');
      }
    imagensCards.forEach(card => {
      card.addEventListener('click', () => {
        imagensCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    atualizarContadorSlides();

    const svgContainers = area.querySelectorAll("[data-svg]");
    const svgPromises = Array.from(svgContainers).map(div => {
      const file = div.getAttribute("data-svg");
      const id = div.id;
      return loadSVG(file, id);
    });

    await Promise.all(svgPromises);

    document.getElementById("nextBtn").hidden = numero === totalPaginas;
    document.getElementById("prevBtn").hidden = numero === 1;


    if (numero + 1 <= totalPaginas && !cachePaginas[numero + 1]) {
      const respostaProx = await fetch(`paginas_unidade4/pagina${numero + 1}.html`);
      const htmlProx = await respostaProx.text();
      cachePaginas[numero + 1] = htmlProx;

      await preloadImagens(htmlProx, respostaProx.url, { fetchExternalCSS: true });

      preloadImagens(htmlProx);
      preloadSVGs(htmlProx);
    }

  } catch (erro) {
    document.getElementById("area-principal").innerHTML = "<p>Erro ao carregar a página.</p>";
    console.error("Erro ao carregar página:", erro);
  }
}


document.getElementById("prevBtn").addEventListener("click", () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    sessionStorage.setItem("paginaAtual", paginaAtual);
    carregarPagina(paginaAtual);
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    sessionStorage.setItem("paginaAtual", paginaAtual);
    carregarPagina(paginaAtual);
  }
});

carregarPagina(paginaAtual);

async function loadSVG(_svgFilePath, _id) {
  try {
    const response = await fetch(_svgFilePath);
    const svgCode = await response.text();
    document.getElementById(_id).innerHTML = svgCode;
  } catch (error) {
    console.error("Erro ao carregar o arquivo SVG:", error);
  }
}

async function goto(event, _selectorHide, _selectorShow){
  goto2(_selectorHide);
  goto3(_selectorShow);

  try {
   event.stopPropagation();
 } catch (exceptionVar) {
  return;
} finally {
  return;
}
};

function atualizarContadorSlides() {
  const contador = document.getElementById("contador-slides");
  const spanAtual = document.getElementById("pagina-atual");

  if (paginaAtual === 0) {
    contador.style.display = "none";
  } else {
    contador.style.display = "block";
    spanAtual.textContent = paginaAtual;
  }
}

function toAbsolute(url, baseHref) {
  try { return new URL(url, baseHref).href; }
  catch { return url; }
}

function coletarUrlsDeSrcset(srcset) {
  if (!srcset) return [];
  return srcset
    .split(',')
    .map(p => p.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function coletarUrlsDeCssTexto(cssText) {
  const urls = [];
  // captura url("..."), url('...') e url(...)
  const re = /url\(\s*(?:'([^']*)'|"([^"]*)"|([^'")]+))\s*\)/g;
  let m;
  while ((m = re.exec(cssText)) !== null) {
    const u = m[1] || m[2] || m[3];
    if (u && !u.startsWith('data:')) urls.push(u.trim());
  }
  return urls;
}

// --- Principal ---
// options.fetchExternalCSS: também busca <link rel="stylesheet"> e varre url() do CSS
async function preloadImagens(html, baseHref = document.baseURI, options = { fetchExternalCSS: false }) {
  const temp = document.createElement('div');

  // Ajuda a resolver URLs relativas do HTML futuro
  const base = document.createElement('base');
  base.href = baseHref;
  temp.appendChild(base);

  const content = document.createElement('div');
  content.innerHTML = html;
  temp.appendChild(content);

  const urls = new Set();

  // 1) <img src> e <img srcset>
  content.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src) urls.add(toAbsolute(src, baseHref));
    const srcset = img.getAttribute('srcset');
    coletarUrlsDeSrcset(srcset).forEach(u => urls.add(toAbsolute(u, baseHref)));
  });

  // 2) <source srcset> (picture etc.)
  content.querySelectorAll('source[srcset]').forEach(s => {
    coletarUrlsDeSrcset(s.getAttribute('srcset'))
      .forEach(u => urls.add(toAbsolute(u, baseHref)));
  });

  // 3) Lazy attrs (data-src, data-srcset)
  content.querySelectorAll('[data-src]').forEach(el => {
    urls.add(toAbsolute(el.getAttribute('data-src'), baseHref));
  });
  content.querySelectorAll('[data-srcset]').forEach(el => {
    coletarUrlsDeSrcset(el.getAttribute('data-srcset'))
      .forEach(u => urls.add(toAbsolute(u, baseHref)));
  });

  // 4) Background-image em style inline
  content.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style') || '';
    coletarUrlsDeCssTexto(style).forEach(u => urls.add(toAbsolute(u, baseHref)));
  });

  // 5) <style> embutido (background em classes inline no próprio HTML)
  content.querySelectorAll('style').forEach(styleEl => {
    const cssText = styleEl.textContent || '';
    coletarUrlsDeCssTexto(cssText).forEach(u => urls.add(toAbsolute(u, baseHref)));
  });

  // 6) SVG <image href / xlink:href>
  content.querySelectorAll('svg image[href], svg image[xlink\\:href]').forEach(img => {
    const raw = img.getAttribute('href') || img.getAttribute('xlink:href');
    if (raw) urls.add(toAbsolute(raw, baseHref));
  });

  // 7) (Opcional) CSS externos linkados neste HTML
  if (options.fetchExternalCSS) {
    const linkHrefs = Array.from(
      content.querySelectorAll('link[rel~="stylesheet"][href]')
    ).map(l => toAbsolute(l.getAttribute('href'), baseHref));

    // Baixa e varre url(...) dos CSS
    const cssTexts = await Promise.allSettled(
      linkHrefs.map(href => fetch(href).then(r => r.ok ? r.text() : ''))
    );
    cssTexts.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        coletarUrlsDeCssTexto(res.value).forEach(u => urls.add(toAbsolute(u, baseHref)));
      }
    });
  }

  // Dispara o aquecimento da cache de imagens
  urls.forEach(u => {
    if (!imagensPrecarregadas.has(u)) {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = u;
      imagensPrecarregadas.add(u);
    }
  });

  // retorna a lista (útil para debugar)
  return Array.from(urls);
}


function preloadSVGs(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const svgs = tempDiv.querySelectorAll("[data-svg]");

  svgs.forEach(div => {
    const file = div.getAttribute("data-svg");
    if (file && !imagensPrecarregadas.has(file)) {
      fetch(file); // navegador irá guardar no cache
      imagensPrecarregadas.add(file);
    }
  });
}