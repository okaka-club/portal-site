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
    id: "one-night-jinroh",
    name: "ゆるふわじんろう",
    description: "みんなで遊べるオンラインワンナイト人狼",
    thumbnail: "/thumbnails/one-night-jinroh.png",
    tags: ["ゲーム", "マルチプレイ"],
    url: "https://yuru-jinrou.com/#/",
    isExternal: true,
    detailUrl: "/games/yurufuwa-jinroh/",
  },
];
