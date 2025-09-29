/**
 * Moodleface script file.
 * @module moodleface
 */

// arrumar os caminhos aq
const links = {
  un1: "/unidade 1/un1.html",
  un2: "/unidade 2/un2.html",
  un3: "/unidade 3/un3.html",
  un4: "/unidade 4/un4.html",
  un5: "/unidade 5/un5.html",
  q1: "/quiz1.html",
  q2: "/quiz2.html",
  q3: "/quiz3.html",
  q4: "/quiz4.html",
  q5: "/quiz5.html",
  media: "/media.html",
  "Tomada de OpiniÃ£o": "/tomada_opiniao.html", 
  about: "/sobre.html",
  booklet: "/livro_curso.html",
  presentation: "/apresentacao.html",
};

const main = document.querySelector("main");
fetch("/moodleface/moodleface.svg")
  .then((response) => response.text())
  .then((svg) => {
    main.insertAdjacentHTML("afterbegin", svg);
  })
  .then(() => {
    const svg = main.querySelector("svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    const allElements = main.querySelectorAll("svg [id]");

    allElements.forEach((el) => {
      const id = el.getAttribute("id");
      if (links[id]) {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          window.open(links[id], "_self"); 
        });
      }
    });
  });
