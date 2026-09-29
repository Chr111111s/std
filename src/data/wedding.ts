import { photos } from './photos'

export const wedding = {
  names: 'Valeria y Eduardo',
  // Explicit offset keeps the countdown on Mexico City time for every guest.
  date: '2026-12-05T14:00:00-06:00',
  dateLabel: '05 de diciembre de 2026',
  deadline: '15 de noviembre de 2026',
  opening:
    'Damos gracias al destino por haber unido nuestros caminos, a la vida por estar juntos, a Dios por ayudarnos a que este amor se haga realidad y a nosotros por mantenerlo.',
  closing:
    'Sumando pasos de la mano. Unimos nuestros nombres, nuestras vidas y nuestras metas.',
  families: [
    {
      title: 'Padres de la novia',
      names: ['Alma Delia Pérez Mejía', 'Alberto Zavala Moncada'],
    },
    {
      title: 'Padres del novio',
      names: ['Adriana Sánchez Sánchez', 'Martín Eduardo Cuevas González'],
    },
    {
      title: 'Nuestros padrinos',
      names: ['Lourdes Flores Suárez', 'Gerardo Romero Rodríguez'],
    },
  ],
  venues: [
    {
      kind: 'church',
      photo: photos.church,
      title: 'Ceremonia religiosa',
      name: 'Iglesia de San Francisco de Asís',
      time: '02:00 PM',
      dateTime: '2026-12-05T14:00:00-06:00',
      map: 'https://maps.app.goo.gl/VWMJwPo7Tg545M2G9?g_st=ipc',
    },
    {
      kind: 'garden',
      photo: null,
      title: 'La recepción',
      name: 'Salón Jardín “Santa María”',
      time: '04:30 PM',
      dateTime: '2026-12-05T16:30:00-06:00',
      map: 'https://maps.app.goo.gl/fBiu84zzEUcg7nMB9?g_st=ic',
    },
  ],
  timeline: [
    {
      time: '02:00 PM',
      title: 'Ceremonia religiosa',
      note: 'El comienzo de nuestro para siempre.',
      icon: 'rings',
    },
    {
      time: '04:30 PM',
      title: 'Recepción',
      note: 'Un encuentro para celebrar el amor.',
      icon: 'garden',
    },
    {
      time: '05:00 PM',
      title: 'Banquete',
      note: 'Compartamos la mesa y la alegría.',
      icon: 'dining',
    },
    {
      time: '06:00 PM',
      title: 'Vals y brindis',
      note: 'Por esta historia y lo que vendrá.',
      icon: 'glasses',
    },
    {
      time: '08:00 PM',
      title: 'Baile',
      note: 'La pista nos espera.',
      icon: 'music',
    },
    {
      time: '01:00 AM',
      title: 'Fin del evento',
      note: 'Domingo 6 de diciembre. Gracias por acompañarnos.',
      icon: 'moon',
    },
  ],
  registry: '60014617',
  contacts: [
    { label: '55 4562 3019', phone: '525545623019' },
    { label: '55 8573 0063', phone: '525585730063' },
  ],
  audio: {
    title: 'Dandelions',
    artist: 'Ruth B',
    src: import.meta.env.VITE_WEDDING_AUDIO_URL ?? '/audio/musica.mp3',
  },
} as const
