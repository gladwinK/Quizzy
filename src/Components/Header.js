import React from 'react'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function Header() {
    return (
        <Navbar dark color='' style={{backgroundColor:'#1f1f1f'}} className=''>
            <Nav >
                <NavbarBrand>Quizzy</NavbarBrand>
            </Nav>
        </Navbar>
    )
}
