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

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ message: 'Validasi gagal: name wajib diisi berupa teks' });
      return;
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      res.status(400).json({ message: 'Validasi gagal: price wajib diisi berupa angka positif' });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        price: Number(price),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.body.id ?? req.params.id);
    const { name, price } = req.body;

    if (!id || isNaN(id)) {
      res.status(400).json({ message: 'Validasi gagal: id wajib disertakan dan berupa angka' });
      return;
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ message: 'Validasi gagal: name wajib diisi berupa teks' });
      return;
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
      res.status(400).json({ message: 'Validasi gagal: price wajib diisi berupa angka positif' });
      return;
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      res.status(404).json({ message: 'Produk yang akan diupdate tidak ditemukan' });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        price: Number(price),
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk' });
  }
}