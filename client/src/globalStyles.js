import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 html {
 

}

  body {
    background-color: #fff0f1f1;
    font-family: 'Roboto Slab', serif;
    margin-bottom: 80px
  }

  .input {
    background: #ecf0f3;
    padding: 10px;
    padding-left: 20px;
    height: 50px;
    font-size: 14px;
    border-radius: 50px;
    box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
  }

  .container-shadow{
    padding: 40px;
    border-radius: 20px;
    box-sizing: border-box;
    background-color: #ecf0f3;
    box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  }

 

  .card-title {
    
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 50px;

    background-color: ##d4d4d4;

  }



  /* width 
::-webkit-scrollbar {
  width: 10px;
}

Track 
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
}
 
 Handle 
::-webkit-scrollbar-thumb {
  background: red; 
  border-radius: 10px;
}

 Handle on hover 
::-webkit-scrollbar-thumb:hover {
  background: #b30000; 
}
*/
`;

export default GlobalStyle;
