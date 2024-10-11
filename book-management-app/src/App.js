import './App.css';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

// Redux setup
const ADD_BOOK = 'ADD_BOOK';
const REMOVE_BOOK = 'REMOVE_BOOK';
const EDIT_BOOK = 'EDIT_BOOK';

const initialState = {
  books: []
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOK:
      return { ...state, books: [...state.books, action.payload] };
    case REMOVE_BOOK:
      return { ...state, books: state.books.filter((_, index) => index !== action.payload) };
    case EDIT_BOOK:
      return {
        ...state,
        books: state.books.map((book, index) =>
          index === action.payload.index ? action.payload.newTitle : book
        )
      };
    default:
      return state;
  }
};

const store = createStore(bookReducer);

// Theme context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'bg-gray-900' : 'bg-gray-100';
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Components
const ListaLivros = () => {
  const books = useSelector(state => state.books);
  const dispatch = useDispatch();
  const { isDarkTheme } = useContext(ThemeContext);
  const [editIndex, setEditIndex] = useState(-1);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (index, title) => {
    setEditIndex(index);
    setEditTitle(title);
  };

  const handleSaveEdit = (index) => {
    dispatch({ type: EDIT_BOOK, payload: { index, newTitle: editTitle } });
    setEditIndex(-1);
    setEditTitle('');
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Lista de Livros</h2>
      {books.length === 0 ? (
        <p className="text-gray-500">Nenhum livro adicionado ainda.</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b">
              {editIndex === index ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-grow mr-2 p-1 text-black"
                />
              ) : (
                <span className="flex-grow">{book}</span>
              )}
              <div>
                {editIndex === index ? (
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(index, book)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => dispatch({ type: REMOVE_BOOK, payload: index })}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FormularioLivro = () => {
  const [bookTitle, setBookTitle] = useState('');
  const dispatch = useDispatch();
  const { isDarkTheme } = useContext(ThemeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookTitle.trim()) {
      dispatch({ type: ADD_BOOK, payload: bookTitle });
      setBookTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 mb-4 rounded-lg shadow-md ${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
      <input
        type="text"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        placeholder="Digite o título do livro"
        className="w-full p-2 mb-2 rounded text-black"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Adicionar Livro
      </button>
    </form>
  );
};

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-full transition-colors ${
        isDarkTheme 
          ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
          : 'bg-gray-800 text-white hover:bg-gray-700'
      }`}
    >
      {isDarkTheme ? '☀️ Tema Claro' : '🌙 Tema Escuro'}
    </button>
  );
};

const App = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <Provider store={store}>
      <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gerenciamento de Livros</h1>
            <ThemeToggle />
          </header>
          <FormularioLivro />
          <ListaLivros />
        </div>
      </div>
    </Provider>
  );
};

const AppWrapper = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWrapper;
