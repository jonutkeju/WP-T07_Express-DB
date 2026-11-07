import type { Request, Response } from 'express';
import prisma from '../prisma.js';

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Validasi gagal: ID harus berupa angka' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}