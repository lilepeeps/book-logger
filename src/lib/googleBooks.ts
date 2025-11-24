export interface GoogleBookResult {
    title: string;
    authors: string[];
    description?: string;
    imageLinks?: {
        thumbnail: string;
    };
    publishedDate?: string;
}

export const fetchBookByIsbn = async (isbn: string): Promise<GoogleBookResult | null> => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const data = await response.json();

        if (data.totalItems > 0 && data.items && data.items.length > 0) {
            const volumeInfo = data.items[0].volumeInfo;
            return {
                title: volumeInfo.title,
                authors: volumeInfo.authors || ["Unknown Author"],
                description: volumeInfo.description,
                imageLinks: volumeInfo.imageLinks,
                publishedDate: volumeInfo.publishedDate,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching book from Google Books:", error);
        return null;
    }
};
