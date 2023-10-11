import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

import Keycloak from 'keycloak-js';

let initOptions = {
  url: 'https://boomerang-keycloak.azurewebsites.net/auth',
  realm: 'Boomerang',
  clientId: 'react-web',
  onLoad: 'check-sso', // check-sso | login-required
  KeycloakResponseType: 'code',

  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
}

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: initOptions.onLoad,
  KeycloakResponseType: 'code',
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", checkLoginIframe: false,
  pkceMethod: 'S256',
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  console.error("Authenticated Failed");
});

function App() {

  const [infoMessage, setInfoMessage] = useState('');
  const employee = {
    "name": "string",
    "email": "string",
    "phone": "string",
    "bio": "string",
    "deleted": true,
    "profilePictureUrl": "string",
    "fullName": "string",
    "preferredName": "string",
    "surname": "string",
    "dateOfBirth": "2023-09-20T10:31:02.865Z",
    "address": "string",
    "emergencyContactPerson": "string",
    "emergencyContactNumber": "string",
    "highestCompletedEducation": "string",
    "university": "string",
    "graduationDate": "2023-09-20T10:31:02.865Z",
    "workEmail": "string",
    "employmentStartDate": "2023-09-20T10:31:02.865Z",
    "isActive": true,
    "resignationDate": "2023-09-20T10:31:02.865Z",
    "resignationComment": "string",
    "gender": 0,
    "maritalStatus": 0
  };
  
  function createEmployee(){
     axios.post('https://localhost:7121/api/employees', employee)
        .then(response =>console.log(response));
  }
  function loginCustom(){
    
    kc.login({idpHint:'Azure'})  
  }
  return (
    <div className="App">
      {/* <Auth /> */}
      <div className='grid'>
        <div className='col-12'>
          <h1>My React App</h1>
        </div>
        <div className='col-12'>
          <h1 id='app-header-2'>Keycloak</h1>
        </div>
      </div>
      <div className="grid">
        <div className="col">
        <button onClick={() => { setInfoMessage(kc.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }} className="m-1" label='Is Authenticated' />
         
          <button onClick={() => { loginCustom() }}  label='Login' severity="success" />
          <button onClick={() => { setInfoMessage(kc.token) }} label='Show Access Token' severity="info" />
          <button onClick={() => { setInfoMessage(JSON.stringify(kc.tokenParsed)) }} label='Show Parsed Access token' severity="info" />
          <button onClick={() => { setInfoMessage(kc.isTokenExpired(5).toString()) }}  label='Check Token expired' severity="warning" />
          <button onClick={() => { kc.updateToken(10).then((refreshed)=>{ setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, (e)=>{setInfoMessage('Refresh Error')}) }} className="m-1" label='Update Token (if about to expire)' />  {/** 10 seconds */}
          <button onClick={() => { kc.logout({ redirectUri: 'http://localhost:3000/' }) }}  label='Logout' severity="danger" />
          <button onClick={() => {createEmployee() }}  label='Login' severity="success" />
          
        </div>
      </div>

      {/* <div className='grid'>
      <div className='col'>
        <h2>Is authenticated: {kc.authenticated}</h2>
      </div>
        </div> */}


      <div className='grid'>
        <div className='col-2'></div>
        <div className='col-8'>
        <h3>Info Pane</h3>
          <div>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </div>
        </div>
        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App;