import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import AssetHome from './Home'
import AssetDetail from './Detail';
import AssetAddUpdate from './AddUpdate';

class Asset extends Component {
    render() {
        return (
            <Switch>
                <Route path='/assets/asset' component={AssetHome} exact />
                <Route path='/assets/asset/detail' component={AssetDetail} />
                <Route path='/assets/asset/addupdate' component={AssetAddUpdate} />
                <Redirect to='/assets/asset' />
            </Switch>
        );
    }
}

export default Asset;