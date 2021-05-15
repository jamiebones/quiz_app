import React from "react";
import styled from "styled-components";

const FooterStyles = styled.div`
  #sticky-footer {
    font-size: 16px;

    background-color: #003265!important;
}


  }
`;

const Footer = () => {
  return (
    <FooterStyles>
      <footer
        id="sticky-footer"
        className="py-4 text-white-50 fixed-bottom"
      >
        <div className="container text-center">
          <small>Copyright &copy; 2021 - {new Date().getUTCFullYear()}</small>
          &nbsp;
          <small>Powered by Erudite Scholars International</small>
        </div>
      </footer>
    </FooterStyles>
  );
};

export default Footer;
