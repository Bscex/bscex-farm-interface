import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

interface NavProp {
    showMenu: boolean
}

const Nav: React.FC<NavProp> = ({showMenu}) => {
  return (
    <StyledNav showMenu={showMenu}>
      <StyledLink exact activeClassName="active" to="/">
        Home
      </StyledLink>
      <StyledAbsoluteLink href="https://swapx.bscex.org">
        SwapX
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://governance.bscex.org">
        Governance
      </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav<{ showMenu: boolean }>`
  align-items: center;
  display: flex;

  @media (max-width: 767px) {
    transition: all .15s linear;
    flex-direction: column;
    align-items: flex-start;
    height: ${({ theme, showMenu }) => (showMenu ? '80px' : '0px')};
    overflow: hidden;
  }
`

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.color.white};
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[4]}px;
  margin-right: ${(props) => props.theme.spacing[4]}px;
  padding-top: ${(props) => props.theme.spacing[4]}px;
  padding-bottom: ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
  position: relative;
  &:after{
    position: absolute;
    content: '';
    height: 3px;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  &:hover {
    &:after{
      background-color: ${(props) => props.theme.color.primary.main};
    }
  }
  &.active {
    &:after{
      background-color: ${(props) => props.theme.color.primary.main};
    }
  }
  @media (max-width: 767px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
  @media (max-width: 767px) {
    display: none;
  }
`

const StyledLink2 = styled(NavLink)`
  color: ${(props) => props.theme.color.white};
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[4]}px;
  margin-right: ${(props) => props.theme.spacing[4]}px;
  padding-top: ${(props) => props.theme.spacing[4]}px;
  padding-bottom: ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
  position: relative;
  &:after{
    position: absolute;
    content: '';
    height: 3px;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  &:hover {
    &:after{
      background-color: ${(props) => props.theme.color.primary.main};
    }
  }
  &.active {
    &:after{
      background-color: ${(props) => props.theme.color.primary.main};
    }
  }
  @media (max-width: 767px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }
`



const StyledAbsoluteLink = styled.a`
  color: ${(props) => props.theme.color.white};
  font-weight: 700;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;

  &:hover {
    color: #ffffff;
  }
  &.active {
    color: ${(props) => props.theme.color.primary.main};
  }
  @media (max-width: 767px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
    padding-top: 10px;
  }
`
const StyledAbsoluteLink2 = styled.a`
  color: ${(props) => props.theme.color.white};
  font-weight: 700;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: #ffffff;
  }
  &.active {
    color: ${(props) => props.theme.color.primary.main};
  }
  @media (max-width: 767px) {
    padding-left: ${(props) => props.theme.spacing[2]}px;
    padding-right: ${(props) => props.theme.spacing[2]}px;
  }


  @media (max-width: 767px) {
    display: none;
  }
`

export default Nav
