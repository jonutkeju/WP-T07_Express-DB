import type { Request, Response } from 'express';

const products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

export function getProducts(req: Request, res: Response) {
  res.status(200).json(products);
}

export function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

export function createProduct(req: Request, res: Response) {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    res.status(400).json({ message: 'Nama dan harga (price) wajib diisi' });
    return;
  }

  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  const newProduct = {
    id: newId,
    name: String(name),
    price: Number(price),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
}