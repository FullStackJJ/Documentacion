var bolas = [];
var radio = 3;
var velocidad;
var moneda = [true, false];
var bolasStop;
var separadores = [];

// Paleta de colores inspirada en TRON
var paletaTron = [
  [82, 231, 255],  // Azul claro
  [255, 65, 54],   // Rojo
  [46, 213, 115],  // Verde
  [255, 234, 0],   // Amarillo
  [155, 89, 255],  // Púrpura
  [255, 121, 63],  // Naranja
  [0, 255, 255],   // Cian
  [255, 0, 255]    // Magenta
];

function setup() {
  createCanvas(500, 625);
  bolasStop = createGraphics(500, 625);
  velocidad = (radio * 5) / 3;
}

function draw() {
  background(0, 100);

  for (let s of separadores) {
    s.show();
  }

  // DIBUJA BOLAS YA DETENIDAS (ARRAY DIVERSO)
  image(bolasStop, 0, 0);

  // CREAR BOLAS - Aumentamos la frecuencia para estresar la GPU
  if (frameCount % radio == 0) { // Más frecuente que en el original
    bolas.push(new Bola(width / 2, -radio, radio));
  }

  // DIVIDIR BOLAS AL IR CAYENDO
  for (let i = 0; i < bolas.length; i++) {
    if (bolas[i].caer) {
      for (let j = 25; j < height / 2; j += radio) {
        if (bolas[i].y > j && bolas[i].y < j + 2 * velocidad) {
          let suerte = random(moneda);
          if (suerte) {
            bolas[i].x += velocidad;
          } else {
            bolas[i].x -= velocidad;
          }
        }
      }
    }
  }

  // MOSTRAR BOLAS Y CHEQUEAR LA INTERSECCIÓN CON OTRAS
  for (let i = 0; i < bolas.length; i++) {
    bolas[i].show();
    for (let j = i + 1; j < bolas.length; j++) {
      let d = dist(bolas[i].x, bolas[i].y, bolas[j].x, bolas[j].y);

      // DETENER BOLAS AL CHOCAR CON OTRAS
      if (d < (bolas[i].r + bolas[j].r)) {
        bolas[j].caer = false; // Detiene bola
        
        // Usar el color de la bola al dibujarla en el lienzo de bolas detenidas
        let colorBola = bolas[j].color;
        bolasStop.fill(colorBola[0], colorBola[1], colorBola[2]);
        bolasStop.ellipse(bolas[j].x, bolas[j].y, bolas[j].r * 2);
        
        bolas.splice(i, 1); // Remueve bola del array
      }
    }

    // DETENER BOLAS AL TERMINAR DE CAER
    if (bolas[i].y > height - 2 * radio) {
      bolas[i].caer = false;
      
      // Usar el color de la bola al dibujarla en el lienzo de bolas detenidas
      let colorBola = bolas[i].color;
      bolasStop.fill(colorBola[0], colorBola[1], colorBola[2]);
      bolasStop.ellipse(bolas[i].x, bolas[i].y, bolas[i].r * 2);
    }

    bolas[i].move();
  }
  
  print("FPS: " + frameRate());
  print("Balls: " + bolas.length);
}

// PELOTITAS
class Bola {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.caer = true;
    // Asignar un color aleatorio de la paleta de TRON
    this.color = random(paletaTron);
  }

  show() {
    // Usar el color asignado a esta bola
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    if (this.caer) {
      this.y += velocidad;
    }
  }
}

class Separador {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r * 2);
  }
}