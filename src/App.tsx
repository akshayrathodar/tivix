import Routes from './routing/index';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routes />
    </div>
  );
}

export default App;
