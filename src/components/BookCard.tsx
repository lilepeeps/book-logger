import React from 'react';

interface BookCardProps {
    title: string;
    author: string;
    coverUrl?: string;
    onDelete?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, coverUrl, onDelete }) => {
    return (
        <div className="card">
            {coverUrl ? (
                <img src={coverUrl} alt={title} className="card-image" />
            ) : (
                <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    No Cover
                </div>
            )}
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-author">{author}</p>
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                        style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0 }}
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookCard;
