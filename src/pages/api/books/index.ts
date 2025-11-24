import type { NextApiRequest, NextApiResponse } from 'next';
import { getTableClient, BookEntity } from '../../../lib/azureStorage';
import { fetchBookByIsbn } from '../../../lib/googleBooks';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = getTableClient("Books");

    // Ensure table exists (in a real app, do this in a startup script or infrastructure code)
    try {
        await client.createTable();
    } catch (e) {
        // Table might already exist, ignore
    }

    if (req.method === 'GET') {
        try {
            const books: BookEntity[] = [];
            const iterator = client.listEntities<BookEntity>();

            for await (const entity of iterator) {
                books.push(entity);
            }

            res.status(200).json(books);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    } else if (req.method === 'POST') {
        try {
            const { isbn, title, author, rating } = req.body;

            let bookData: Partial<BookEntity> = {
                partitionKey: "Library", // Single partition for simple personal app
                rowKey: isbn || uuidv4(),
                title,
                author,
                isbn,
                rating: rating ? parseInt(rating) : undefined,
                readDate: new Date().toISOString(),
            };

            if (isbn) {
                const details = await fetchBookByIsbn(isbn);
                if (details) {
                    bookData = {
                        ...bookData,
                        title: details.title || title,
                        author: details.authors ? details.authors.join(", ") : author,
                        coverUrl: details.imageLinks?.thumbnail,
                    };
                }
            }

            await client.createEntity(bookData as BookEntity);
            res.status(201).json(bookData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to add book' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
