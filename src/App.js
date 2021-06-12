import './App.css';
import Provider from './context';
import Cities from './Cities/cities';
import Header from './Header/header';
import Footer from './Footer/footer';

function App() {
  return (
    <Provider>
      <Header/>
      <Cities/>
      <Footer />
    </Provider>
  );
}

export default App;
