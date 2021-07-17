import './App.css';
import Provider from './context';
import Cities from './components/cities';
import Footer from './Footer/footer';

function App() {
  return (
    <Provider>
      <Cities/>
      <Footer />
    </Provider>
  );
}

export default App;
