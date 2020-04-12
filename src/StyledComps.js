import styled from 'styled-components';


const StyledButton = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    margin: 0 1em;
    padding: 0.25em 1em;
`;

const ButtonHref = styled.a`
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;

  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  
`;

const StyledSection = styled.section`
    display: grid;
    background: #EEEEEE;


    grid-template-columns: 25% 1fr 25%;
    grid-template-rows: minmax(75px,auto) 1fr 25%;
    grid-gap: 1em;
    height: 85vh;
`;

const Header = styled.header`
    background: #EEEEEE;
`;

const StyledHeaderDiv = styled.div`
    display: block;
    border-radius: 4px;
    align-items: center;
    padding: 0.25em 1em;
    margin: 1em;
`;
const StyledMainDiv = styled.div`
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    background: #000000;
    padding: 0.25em 1em;
`;

const MainImage = styled.img`
  width: 150px;
  height: 31px;
`;

const ShadowLink = styled.a`
    style: display: none
`;

export  {StyledButton,ButtonHref,StyledSection,StyledMainDiv,Header,MainImage,StyledHeaderDiv,ShadowLink};