import React from "react";
import { Navbar, NavbarBrand, Nav, NavLink, NavItem } from "reactstrap";
import { useLocation, Link, NavLink as RRNavLink } from "react-router-dom";

const getName = (link) => {
  switch (link) {
    case "/parts":
      return "Parts printing page";
    case "/inventory":
      return "Inventory recap page";
    case "/printer":
      return "Printer fleet overview";
    case "/":
      return "Home page";
    default:
      return link;
  }
};

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
      <Nav style={{ color: "white" }} navbar>
        <NavItem>{getName(useLocation().pathname)}</NavItem>
      </Nav>
    </Navbar>
  </div>
);
