import files from './photos.generated.json'

export const photos = {
  embrace: {
    ...files['STD-11'],
    alt: 'Valeria y Eduardo abrazados bajo las ramas de un árbol.',
  },
  announcement: {
    ...files['STD-29'],
    alt: 'Valeria y Eduardo comparten el anuncio de su boda junto al lago.',
  },
  dance: {
    ...files['STD-3'],
    alt: 'Valeria y Eduardo se inclinan juntos como en un paso de baile, a la orilla del lago.',
  },
  kiss: {
    ...files['STD-33'],
    alt: 'Eduardo besa la frente de Valeria mientras ella sonríe.',
  },
  walk: {
    ...files['STD-34'],
    alt: 'Valeria y Eduardo caminan de la mano por el parque.',
  },
  bench: {
    ...files['STD-60'],
    alt: 'Valeria y Eduardo sentados juntos en una banca del parque.',
  },
  joy: {
    ...files['STD-63'],
    alt: 'Valeria abraza a Eduardo por la espalda mientras levanta su ramo.',
  },
  church: {
    ...files.iglesia,
    alt: 'Interior de la Iglesia de San Francisco de Asís, con bancas de madera y una cruz frente al jardín.',
  },
  salon: {
    ...files.salon,
    alt: 'Vista del Salón Jardín “Santa María”, el lugar de la recepción.',
  },
}
