import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Container } from 'semantic-ui-react'

import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import MenuBar from './components/MenuBar.js'

function App() {
    return (
        <Router>
            <Container>
                <MenuBar />
                <Route exact path='/' component={Home}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/register' component={Register}/>
            </Container>
        </Router>
    );
}

export default App;
