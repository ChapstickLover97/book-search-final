import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import Auth from '../utils/auth';

const SAVE_BOOK = gql`
  mutation SaveBook($bookDetails: BookInput!) {
    saveBook(bookDetails: $bookDetails) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;

const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
      }
    }
  }
`;

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [saveBook, { error: saveBookError }] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      try {
        cache.writeQuery({
          query: GET_ME,
          data: { me: saveBook },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    setIsLoading(true);
    try {
      const response = await searchGoogleBooks(searchInput);
      const data = await response.json();
      setSearchedBooks(data.items);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.id === bookId);
  
    if (!bookToSave.volumeInfo.description || !bookToSave.id || !bookToSave.volumeInfo.title) {
      console.error('Missing required book fields');
      return;
    }
  
    try {
      const { data } = await saveBook({
        variables: {
          bookDetails: {
            authors: bookToSave.volumeInfo.authors,
            description: bookToSave.volumeInfo.description,
            title: bookToSave.volumeInfo.title,
            bookId: bookToSave.id,
            image: bookToSave.volumeInfo.imageLinks?.thumbnail,
            link: bookToSave.volumeInfo.previewLink
          }
        },
      });
    
      setSavedBookIds((prevState) => [...prevState, bookToSave.id]);
    } catch (err) {
      console.error(err);
    }
  };
  

  // Log errors to console for debugging
  useEffect(() => {
    if (saveBookError) {
      console.error('Error occurred while saving book:', saveBookError);
    }
  }, [saveBookError]);

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {isLoading
            ? 'Loading...'
            : searchedBooks && searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks &&
            searchedBooks.map((book) => {
              return (
                <Col md='4' key={book.id}>
                  <Card border='dark'>
                    {book.volumeInfo.imageLinks?.thumbnail && <Card.Img src={book.volumeInfo.imageLinks.thumbnail} alt={`The cover for ${book.volumeInfo.title}`} variant='top' />}
                    <Card.Body>
                      <Card.Title>{book.volumeInfo.title}</Card.Title>
                      <p className='small'>Authors: {book.volumeInfo.authors.join(', ')}</p>
                      <Card.Text>{book.volumeInfo.description}</Card.Text>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedBookIds.some((savedBookId) => savedBookId === book.id)}
                          className='btn-block btn-info'
                          onClick={() => handleSaveBook(book.id)}
                        >
                          {savedBookIds.some((savedBookId) => savedBookId === book.id)
                            ? 'This book has already been saved!'
                            : 'Save this Book!'}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
