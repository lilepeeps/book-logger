import type { NextApiRequest, NextApiResponse } from 'next';
import { getTableClient } from '../../../lib/azureStorage';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    const client = getTableClient("Books");

    if (req.method === 'DELETE') {
        try {
            // Assuming partitionKey is always "Library" for now
            await client.deleteEntity("Library", id as string);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete book' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
