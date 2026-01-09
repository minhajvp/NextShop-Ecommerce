export type Product = {
     id: number;
  title: string;
  price: number;
  image: string;
}

export const products : Product[] = [
    {
    id: 1,
    title: "Wireless Headphones",
    price: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 2999,
    image: "https://t4.ftcdn.net/jpg/06/60/68/37/360_F_660683718_qo0q1V2RuLO56S7cu4VMb078m10U6WW8.jpg",
  },
  {
    id: 3,
    title: "Gaming Mouse",
    price: 999,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Razer_Naga_2014_MMO_Gaming_Mouse_%2814714867599%29.jpg",
  },
]