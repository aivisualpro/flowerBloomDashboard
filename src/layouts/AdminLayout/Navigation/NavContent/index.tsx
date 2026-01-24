'use client';

import PropTypes from 'prop-types';
import { useContext } from 'react';
import Link from 'next/link';

// react-bootstrap
import { Card, ListGroup } from 'react-bootstrap';

// project imports
import NavGroup from './NavGroup';
import { ConfigContext } from '@/contexts/ConfigContext';

// third party
import SimpleBar from 'simplebar-react';

// assets
import logo from '@/assets/images/logo.svg';

// -----------------------|| NAV CONTENT ||-----------------------//

interface NavContentProps {
  navigation: any[];
  activeNav?: any;
}

export default function NavContent({ navigation, activeNav }: NavContentProps) {
  const configContext = useContext(ConfigContext);

  const { collapseLayout } = configContext.state;

  const navItems = navigation.map((item) => {
    let navItem = <></>;
    switch (item.type) {
      case 'group':
        if (activeNav) {
          navItem = (
            <div key={`nav-group-${item.id}`}>
              <NavGroup group={item} id={item.id} />
            </div>
          );
        } else {
          navItem = <NavGroup group={item} key={`nav-group-${item.id}`} id={item.id} />;
        }
        return navItem;
      default:
        return false;
    }
  });

  let navContentNode = (
    <SimpleBar style={{ height: 'calc(100vh - 70px)' }}>
      <ListGroup variant="flush" as="ul" bsPrefix=" " className="pc-navbar">
        {navItems}
      </ListGroup>
    </SimpleBar>
  );

  if (collapseLayout) {
    navContentNode = (
      <ListGroup variant="flush" as="ul" bsPrefix=" " className="pc-navbar">
        {navItems}
      </ListGroup>
    );
  }

  const mHeader = (
    <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <Link
        href="/"
        className="b-brand"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
      >
        <img src="/logo.png" alt="Flower Bloom Control Center" className="logo logo-lg" style={{ height: '40px', objectFit: 'contain', marginBottom: '10px' }} />
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: '"Lobster", cursive', fontSize: '22px', color: '#fff', display: 'block', lineHeight: '1.2' }}>Flower Bloom</span>
          <span style={{ fontFamily: '"Quicksand", sans-serif', fontSize: '11px', color: '#cbd5e1', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>Control Center</span>
        </div>
      </Link>
    </div>
  );

  let mainContent;

  mainContent = (
    <>
      {mHeader}

      <div className="navbar-content next-scroll">{navContentNode}</div>
    </>
  );

  return <>{mainContent}</>;
}

NavContent.propTypes = { navigation: PropTypes.any, activeNav: PropTypes.any };
