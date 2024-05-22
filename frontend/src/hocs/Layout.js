import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { useLocation, useNavigate} from 'react-router-dom';
import { checkAuthenticated, load_user,googleAuthenticate } from '../actions/auth';

import queryString from "query-string"
const Layout = ( props )=> {

    let location=useLocation()
    let navigate = useNavigate();

    useEffect(() => {
        console.log("second")
        const values= queryString.parse(location.search)
        const state= values.state ? values.state :null;
        const code= values.code ? values.code :null;
    if(state && code){
        props.googleAuthenticate(state,code)
        navigate('/project'); 
    }else{
        props.checkAuthenticated();
        props.load_user();
    }


    }, [location]);

    return (
        <div>
            <Navbar />
            {props.children}
        </div>
    );
};

export default connect(null, { checkAuthenticated, load_user,googleAuthenticate })(Layout);