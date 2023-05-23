import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { removeBookId } from '../utils/localStorage';

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

const DELETE_BOOK = gql`
  mutation DeleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
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

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (data && data.me) {
      setUserData(data.me);
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId },
      });
      setUserData((prevState) => {
        const updatedSavedBooks = prevState.savedBooks.filter((book) => book.bookId !== bookId);
        return {
          ...prevState,
          savedBooks: updatedSavedBooks,
        };
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error :(</h2>;
  }

  if (!userData) {
    return <h2>No user data found.</h2>;
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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


export default SavedBooks;