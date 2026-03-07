export type Service = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  url: string;
  isExternal: boolean;
};

export const services: Service[] = [
  {
    id: "maru-batsu-shindan",
    name: "○×診断",
    description: "カードを○×に振り分けるAI診断ゲーム",
    thumbnail: "/portal-site/thumbnails/maru-batsu.png",
    tags: ["診断", "AI"],
    url: "https://maru-batsu.okaka-club.com/",
    isExternal: true,
  },
  {
    id: "one-night-jinroh",
    name: "ゆるふわじんろう",
    description: "みんなで遊べるオンラインワンナイト人狼",
    thumbnail: "/portal-site/thumbnails/one-night-jinroh.png",
    tags: ["ゲーム", "マルチプレイ"],
    url: "https://one-night.okaka-club.com/",
    isExternal: true,
  },
];
