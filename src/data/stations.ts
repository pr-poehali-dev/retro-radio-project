export interface Station {
  id: string;
  name: string;
  country: string;
  genre: string;
  frequency: string;
  url: string;
  description: string;
  custom?: boolean;
}

export const DEFAULT_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Ретро FM',
    country: 'СССР',
    genre: 'Ретро',
    frequency: '88.3',
    url: 'https://retro.hostingradio.ru:8043/retro256.mp3',
    description: 'Хиты 60-80-х годов'
  },
  {
    id: '2',
    name: 'Радио Джаз',
    country: 'СССР',
    genre: 'Джаз',
    frequency: '89.1',
    url: 'https://jazz.hostingradio.ru:8030/jazz128.mp3',
    description: 'Лучший джаз круглосуточно'
  },
  {
    id: '3',
    name: 'DFM',
    country: 'СССР',
    genre: 'Электронная',
    frequency: '101.2',
    url: 'https://dfm.hostingradio.ru:8027/dfm128.mp3',
    description: 'Электронная музыка'
  },
  {
    id: '4',
    name: 'Радио Дача',
    country: 'РСФСР',
    genre: 'Народная',
    frequency: '91.5',
    url: 'https://dacha.hostingradio.ru:8060/dacha128.mp3',
    description: 'Народные хиты'
  },
  {
    id: '5',
    name: 'Маяк',
    country: 'СССР',
    genre: 'Новости',
    frequency: '103.4',
    url: 'https://icecast-vgtrk.cdnvideo.ru/mayak_mp3_192kbps',
    description: 'Информация и музыка'
  },
  {
    id: '6',
    name: 'Радио России',
    country: 'РСФСР',
    genre: 'Разное',
    frequency: '66.44',
    url: 'https://icecast-vgtrk.cdnvideo.ru/rr_mp3_192kbps',
    description: 'Первая кнопка'
  },
  {
    id: '7',
    name: 'Орфей',
    country: 'СССР',
    genre: 'Классика',
    frequency: '99.2',
    url: 'https://icecast-vgtrk.cdnvideo.ru/orpheus_mp3_192kbps',
    description: 'Классическая музыка'
  },
  {
    id: '8',
    name: 'Радио Культура',
    country: 'СССР',
    genre: 'Культура',
    frequency: '91.6',
    url: 'https://icecast-vgtrk.cdnvideo.ru/kultura_mp3_192kbps',
    description: 'Искусство и культура'
  },
];
