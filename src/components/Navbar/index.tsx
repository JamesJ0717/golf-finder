import Link from "next/link";
import { Navbar, Nav } from "react-bootstrap";

export default function index() {
  const linkStyle = { color: "#fff" };

  return (
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect sticky="top">
      <Navbar.Brand>
        <Link href="/">
          <a style={linkStyle}>
            Local Golf
            <span role="img" aria-label="Golf Flag Emoji">
              ⛳️
            </span>
          </a>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <Link href="/handicapCalculator">
            <a className="p-2" style={linkStyle}>
              Course Handicap Calculator
            </a>
          </Link>

          <Link href="/about">
            <a className="p-2" style={linkStyle}>
              About
            </a>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
