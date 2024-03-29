import { Pixel } from './image.ts';

// prettier-ignore
export type ColorNames = 'azulejo' | 'grafito' | 'flan' | 'chicle' | 'ladrillo' | 'arandano' | 'jade' | 'menta' | 'acero' | 'arena' | 'mantequilla' | 'chapopote' | 'uva' | 'musgo' | 'cobalto' | 'hielo' | 'mota' | 'vino' | 'blanco' | 'ambar' | 'lapis' | 'marino' | 'fresa' | 'cedro' | 'bombon' | 'pulpo' | 'tortilla' | 'manzana' | 'turquesa' | 'vinca' | 'borrador' | 'pitahaya' | 'obsidiana' | 'ajolote' | 'limon' | 'pastel' | 'papel' | 'hierro' | 'magia' | 'cielo' | 'plata' | 'lavanda' | 'cajeta' | 'alien' | 'princesa' | 'nube';

// prettier-ignore
export const palette: { [key in ColorNames]: Pixel } = {
  azulejo: {
    hex: '#1f84cc',       r: 31,    g: 132,   b: 204,   a: 1,       h: 205,   s: 74,    l: 46,
    neighbors: ['cielo', 'cobalto'],
  },
  grafito: {
    hex: '#3d3640',       r: 61,    g: 54,    b: 64,    a: 1,       h: 282,   s: 8,     l: 23,
    neighbors: ['hierro', 'chapopote'],
  },
  flan: {
    hex: '#fabb64',       r: 250,   g: 187,   b: 100,   a: 1,       h: 35,    s: 94,    l: 69,
    neighbors: ['tortilla', 'ambar'],
  },
  chicle: {
    hex: '#f7577f',       r: 247,   g: 87,    b: 127,   a: 1,       h: 345,   s: 91,    l: 65,
    neighbors: ['bombon', 'fresa'],
  },
  ladrillo: {
    hex: '#cc5f29',       r: 204,   g: 95,    b: 41,    a: 1,       h: 20,    s: 67,    l: 48,
    neighbors: ['ambar', 'arandano'],
  },
  arandano: {
    hex: '#66050d',       r: 102,   g: 5,     b: 13,    a: 1,       h: 355,   s: 91,    l: 21,
    neighbors: ['ladrillo', 'manzana', 'vino'],
  },
  jade: {
    hex: '#0f474d',       r: 15,    g: 71,    b: 77,    a: 1,       h: 186,   s: 67,    l: 18,
    neighbors: ['turquesa', 'cedro', 'marino'],
  },
  menta: {
    hex: '#1fcccc',       r: 31,    g: 204,   b: 204,   a: 1,       h: 180,   s: 74,    l: 46,
    neighbors: ['hielo', 'turquesa'],
  },
  acero: {
    hex: '#aca1b3',       r: 172,   g: 161,   b: 179,   a: 1,       h: 277,   s: 11,    l: 67,
    neighbors: ['plata', 'hierro'],
  },
  arena: {
    hex: '#fff7cc',       r: 255,   g: 247,   b: 204,   a: 1,       h: 51,    s: 100,   l: 90,
    neighbors: ['mantequilla', 'tortilla'],
  },
  mantequilla: {
    hex: '#f7ff99',       r: 247,   g: 255,   b: 153,   a: 1,       h: 65,    s: 100,   l: 80,
    neighbors: ['arena', 'alien'],
  },
  chapopote: {
    hex: '#241f26',       r: 36,    g: 31,    b: 38,    a: 1,       h: 283,   s: 10,    l: 14,
    neighbors: ['obsidiana', 'grafito'],
  },
  uva: {
    hex: '#380899',       r: 56,    g: 8,     b: 153,   a: 1,       h: 260,   s: 90,    l: 32,
    neighbors: ['lavanda', 'lapis'],
  },
  musgo: {
    hex: '#9eed77',       r: 158,   g: 237,   b: 119,   a: 1,       h: 100,   s: 77,    l: 70,
    neighbors: ['alien', 'mota'],
  },
  cobalto: {
    hex: '#1262b3',       r: 18,    g: 98,    b: 179,   a: 1,       h: 210,   s: 82,    l: 39,
    neighbors: ['azulejo', 'lapis'],
  },
  hielo: {
    hex: '#7ae0f5',       r: 122,   g: 224,   b: 245,   a: 1,       h: 190,   s: 86,    l: 72,
    neighbors: ['menta'],
  },
  mota: {
    hex: '#12b362',       r: 18,    g: 179,   b: 98,    a: 1,       h: 150,   s: 82,    l: 39,
    neighbors: ['musgo', 'limon'],
  },
  vino: {
    hex: '#400020',       r: 64,    g: 0,     b: 32,    a: 1,       h: 330,   s: 100,   l: 13,
    neighbors: ['pulpo', 'arandano'],
  },
  blanco: {
    hex: '#ffffff',       r: 255,   g: 255,   b: 255,   a: 1,       h: 0,     s: 0,     l: 100,
    neighbors: ['papel'],
  },
  ambar: {
    hex: '#f59149',       r: 245,   g: 145,   b: 73,    a: 1,       h: 25,    s: 90,    l: 62,
    neighbors: ['flan', 'ladrillo', 'cajeta'],
  },
  lapis: {
    hex: '#000066',       r: 0,     g: 0,     b: 102,   a: 1,       h: 240,   s: 100,   l: 20,
    neighbors: ['cobalto', 'uva', 'marino'],
  },
  marino: {
    hex: '#030f33',       r: 3,     g: 15,    b: 51,    a: 1,       h: 225,   s: 89,    l: 11,
    neighbors: ['jade', 'lapis'],
  },
  fresa: {
    hex: '#e62e4d',       r: 230,   g: 46,    b: 77,    a: 1,       h: 350,   s: 79,    l: 54,
    neighbors: ['chicle', 'manzana'],
  },
  cedro: {
    hex: '#00806a',       r: 0,     g: 128,   b: 106,   a: 1,       h: 170,   s: 100,   l: 25,
    neighbors: ['limon', 'jade'],
  },
  bombon: {
    hex: '#fc7ea8',       r: 252,   g: 126,   b: 168,   a: 1,       h: 340,   s: 95,    l: 74,
    neighbors: ['pastel', 'chicle'],
  },
  pulpo: {
    hex: '#660546',       r: 102,   g: 5,     b: 70,    a: 1,       h: 320,   s: 91,    l: 21,
    neighbors: ['pitahaya', 'vino'],
  },
  tortilla: {
    hex: '#ffea80',       r: 255,   g: 234,   b: 128,   a: 1,       h: 50,    s: 100,   l: 75,
    neighbors: ['arena', 'flan'],
  },
  manzana: {
    hex: '#b31b34',       r: 179,   g: 27,    b: 52,    a: 1,       h: 350,   s: 74,    l: 40,
    neighbors: ['fresa', 'arandano'],
  },
  turquesa: {
    hex: '#088199',       r: 8,     g: 129,   b: 153,   a: 1,       h: 190,   s: 90,    l: 32,
    neighbors: ['menta', 'jade'],
  },
  vinca: {
    hex: '#afbbfa',       r: 175,   g: 187,   b: 250,   a: 1,       h: 230,   s: 88,    l: 83,
    neighbors: ['nube', 'cielo'],
  },
  borrador: {
    hex: '#df76ba',       r: 223,   g: 118,   b: 186,   a: 1,       h: 321,   s: 47,    l: 87,
    neighbors: ['pitahaya', 'pastel'],
  },
  pitahaya: {
    hex: '#b3128a',       r: 179,   g: 18,    b: 138,   a: 1,       h: 315,   s: 82,    l: 39,
    neighbors: ['borrador', 'pulpo'],
  },
  obsidiana: {
    hex: '#0c0a0d',       r: 12,    g: 10,    b: 13,    a: 1,       h: 280,   s: 13,    l: 5,
    neighbors: ['chapopote'],
  },
  ajolote: {
    hex: '#e9abf5',       r: 233,   g: 171,   b: 245,   a: 1,       h: 290,   s: 79,    l: 82,
    neighbors: ['nube', 'pastel'],
  },
  limon: {
    hex: '#089969',       r: 8,     g: 153,   b: 105,   a: 1,       h: 160,   s: 90,    l: 32,
    neighbors: ['mota', 'cedro'],
  },
  pastel: {
    hex: '#fa96c8',       r: 250,   g: 150,   b: 200,   a: 1,       h: 330,   s: 91,    l: 78,
    neighbors: ['ajolote', 'bombon', 'borrador'],
  },
  papel: {
    hex: '#eee6f2',       r: 238,   g: 230,   b: 242,   a: 1,       h: 280,   s: 32,    l: 93,
    neighbors: ['blanco', 'plata'],
  },
  hierro: {
    hex: '#796c80',       r: 121,   g: 108,   b: 128,   a: 1,       h: 279,   s: 8,     l: 46,
    neighbors: ['acero', 'grafito'],
  },
  magia: {
    hex: '#a37af5',       r: 163,   g: 122,   b: 245,   a: 1,       h: 260,   s: 86,    l: 72,
    neighbors: ['princesa', 'lavanda'],
  },
  cielo: {
    hex: '#7aadf5',       r: 122,   g: 173,   b: 245,   a: 1,       h: 215,   s: 86,    l: 72,
    neighbors: ['vinca', 'azulejo'],
  },
  plata: {
    hex: '#d5ced9',       r: 213,   g: 206,   b: 217,   a: 1,       h: 278,   s: 13,    l: 83,
    neighbors: ['papel', 'acero'],
  },
  lavanda: {
    hex: '#6246eb',       r: 98,    g: 70,    b: 235,   a: 1,       h: 250,   s: 80,    l: 60,
    neighbors: ['magia', 'uva'],
  },
  cajeta: {
    hex: '#b36b24',       r: 179,   g: 107,   b: 36,    a: 1,       h: 30,    s: 67,    l: 42,
    neighbors: ['ambar'],
  },
  alien: {
    hex: '#d0fa7d',       r: 208,   g: 250,   b: 125,   a: 1,       h: 80,    s: 93,    l: 74,
    neighbors: ['mantequilla', 'musgo'],
  },
  princesa: {
    hex: '#d0bbfa',       r: 208,   g: 187,   b: 250,   a: 1,       h: 260,   s: 86,    l: 86,
    neighbors: ['nube', 'magia'],
  },
  nube: {
    hex: '#dfd9ff',       r: 223,   g: 217,   b: 255,   a: 1,       h: 249,   s: 100,   l: 93,
    neighbors: ['princesa', 'ajolote', 'vinca'],
  },
};

/** This function creates an array of Pixels based on an array of ColorNames. */
export const createPalette = (names: ColorNames[]): Pixel[] => names.map((name) => palette[name]);
