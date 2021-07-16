import './App.css';
import Provider from './context';
import Cities from './components/cities';
import Header from './Header/header';
import Footer from './Footer/footer';

function App() {
  return (
    <Provider>
      <Cities/>
      <Header/>
      <Footer />
    </Provider>
  );
}

export default App;
