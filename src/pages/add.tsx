import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import Scanner to avoid SSR issues with html5-qrcode
const Scanner = dynamic(() => import('../components/Scanner'), { ssr: false });

export default function AddBook() {
    const router = useRouter();
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleScan = (decodedText: string) => {
        setIsbn(decodedText);
        setScanning(false);
        // Optional: Auto-submit or fetch details immediately
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn, title, author }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert("Failed to add book");
            }
        } catch (error) {
            console.error("Error adding book", error);
            alert("Error adding book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Head>
                <title>Add Book</title>
            </Head>

            <nav className="nav">
                <h1>Add Book</h1>
                <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    &larr; Back to Library
                </Link>
            </nav>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    {!scanning ? (
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setScanning(true)}
                            style={{ width: '100%' }}
                        >
                            Scan Barcode
                        </button>
                    ) : (
                        <div>
                            <Scanner onScanSuccess={handleScan} />
                            <button
                                type="button"
                                onClick={() => setScanning(false)}
                                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancel Scan
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">ISBN</label>
                        <input
                            type="text"
                            className="form-input"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            placeholder="Scan or enter ISBN"
                        />
                        <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                            If ISBN is provided, we'll try to fetch details automatically.
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Book Title (Optional if ISBN provided)"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Author</label>
                        <input
                            type="text"
                            className="form-input"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Author Name (Optional if ISBN provided)"
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Adding...' : 'Add to Library'}
                    </button>
                </form>
            </div>
        </div>
    );
}
