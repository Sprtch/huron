import React from "react";
import { Navbar, NavbarBrand, Nav, NavLink, NavItem } from "reactstrap";
import { Link, NavLink as RRNavLink } from "react-router-dom";

export default () => (
  <div>
    <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/">
        Separtch Printing Page
      </NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink tag={RRNavLink} to="/parts">
            Parts
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to="/inventory">
            Inventory
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={RRNavLink} to="/printer">
            Printer
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  </div>
);
