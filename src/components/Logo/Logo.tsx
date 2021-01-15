import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Bscx from '../../assets/img/logo.svg'
import BscxLogo from '../../assets/img/logo-icon.svg'

const Logo: React.FC = () => {
  return (
    <StyledLogo to="/">
      <img className="d-sm-none" src={Bscx} height="38" style={{ marginTop: -4 }} />
      <img className="d-md-none" src={BscxLogo} height="40" style={{ marginTop: -4 }} />
    </StyledLogo>
  )
}

const StyledLogo = styled(Link)`
    align-items: center;
    display: flex;
    margin: 0;
    min-height: 44px;
    min-width: 44px;
    padding: 0;
    text-decoration: none;
    .d-sm-none {
        @media (max-width: 767px) {
            display: none;
        }
    }
    .d-md-none {
        @media (min-width: 768px) {
            display: none;
        }
    }
`

export default Logo
