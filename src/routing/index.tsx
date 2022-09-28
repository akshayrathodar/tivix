import react from 'react';
import { BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import Home from '../pages/index'

const Routes = () => {
    return(
        <>
            <Router>
                <Switch>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default Routes;