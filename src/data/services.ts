export type Service = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  url: string;
  isExternal: boolean;
  detailUrl?: string;
};

export const services: Service[] = [
  {
    id: "maru-batsu-shindan",
    name: "キャラクター診断",
    description: "好きなキャラを選んで「はい」「いいえ」で答えると、あなたの性格を診断！",
    thumbnail: "/thumbnails/maru-batsu.png",
    tags: ["診断", "AI"],
    url: "https://mbs.okakaclub.com/",
    isExternal: true,
    detailUrl: "/games/maru-batsu-shindan/",
  },
  {
    id: "soritia",
    name: "ソリティア",
    description: "定番のクロンダイク・ソリティア。デイリーチャレンジやヒント機能つきで、ブラウザですぐ遊べます。",
    thumbnail: "/thumbnails/soritia.png",
    tags: ["ゲーム", "ひとりで"],
    url: "https://soritia.okakaclub.com/",
    isExternal: true,
    detailUrl: "/games/soritia/",
  },
  {
    id: "yuru-jinro",
    name: "ゆるふわじんろう",
    description: "みんなで遊べるオンラインワンナイト人狼",
    thumbnail: "/thumbnails/yuru-jinro.png",
    tags: ["ゲーム", "マルチプレイ"],
    url: "https://yuru-jinrou.okakaclub.com/",
    isExternal: true,
    detailUrl: "/games/yuru-jinro/",
  },
  {
    id: "one-phrase-jinro",
    name: "ワンフレーズ人狼",
    description: "お題を見てみんなで「せーの！」。違うお題の人を探す、2〜10人で遊べるオンライン人狼。",
    thumbnail: "/thumbnails/one-phrase-jinro.png",
    tags: ["ゲーム", "マルチプレイ"],
    url: "https://mitarashi-neko.com/games/one-phrase-jinro/",
    isExternal: true,
  },
];
