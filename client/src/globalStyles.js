import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 html {
 

}

  body {
    background-color: #fff0f1f1;
    font-family: 'Roboto Slab', serif;
    margin-bottom: 80px
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
