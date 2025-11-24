import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BookCard from '../components/BookCard';
import { BookEntity } from '../lib/azureStorage';

export default function Home() {
  const [books, setBooks] = useState<BookEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rowKey: string) => {
    if (!confirm("Are you sure you want to remove this book?")) return;

    try {
      const res = await fetch(`/api/books/${rowKey}`, { method: 'DELETE' });
      if (res.ok) {
        setBooks(books.filter(b => b.rowKey !== rowKey));
      }
    } catch (error) {
      console.error("Failed to delete book", error);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Head>
        <title>My Library</title>
      </Head>

      <nav className="nav">
        <h1>My Library</h1>
        <Link href="/add" className="btn">
          + Add Book
        </Link>
      </nav>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          className="form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading library...</p>
      ) : filteredBooks.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#888' }}>
          {books.length === 0 ? (
            <>
              <p>Your library is empty.</p>
              <p>Start by adding some books!</p>
            </>
          ) : (
            <p>No books match your search.</p>
          )}
        </div>
      ) : (
        <div className="grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.rowKey}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              onDelete={() => handleDelete(book.rowKey)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
