import { gql, useMutation, useQuery } from '@apollo/client';

// Mutation to create a user
const CREATE_USER = gql`
  mutation CreateUser($userData: UserInput!) {
    createUser(userData: $userData) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation to login a user
const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Query to get the logged-in user's info
const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
    }
  }
`;

// Mutation to save a book for a logged-in user
const SAVE_BOOK = gql`
  mutation SaveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
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

// Mutation to delete a saved book for a logged-in user
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

// Query to search books using Google Books API
const SEARCH_GOOGLE_BOOKS = gql`
  query SearchGoogleBooks($query: String!) {
    searchGoogleBooks(query: $query) {
      bookId
      title
      authors
      description
      image
    }
  }
`;

export const useGetMe = () => {
  const { loading, error, data } = useQuery(GET_ME);

  return {
    loading,
    error,
    me: data?.me,
  };
};

export const useCreateUser = () => {
  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER);

  const createUser = async (userData) => {
    try {
      const { data } = await createUserMutation({
        variables: { userData },
      });
      return data.createUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    loading,
    error,
    createUser,
  };
};

export const useLoginUser = () => {
  const [loginUserMutation, { loading, error }] = useMutation(LOGIN_USER);

  const loginUser = async (userData) => {
    try {
      const { data } = await loginUserMutation({
        variables: { userData },
      });
      return data.loginUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    loading,
    error,
    loginUser,
  };
};

export const useSaveBook = () => {
  const [saveBookMutation, { loading, error, data }] = useMutation(SAVE_BOOK);

  const saveBook = async (bookData) => {
    try {
      const { data } = await saveBookMutation({
        variables: { bookData },
      });
      return data.saveBook;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loading,
    error,
    data,
    saveBook,
  };
};

export const useDeleteBook = () => {
  const [deleteBookMutation, { loading, error, data }] = useMutation(DELETE_BOOK);

  const deleteBook = async (bookId) => {
    try {
      const { data } = await deleteBookMutation({
        variables: { bookId },
      });
      return data.deleteBook;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loading,
    error,
    data,
    deleteBook,
  };
};

export const useSearchGoogleBooks = () => {
  const { loading, error, data } = useQuery(SEARCH_GOOGLE_BOOKS);

  return {
    loading,
    error,
    data: data?.searchGoogleBooks,
  };
};