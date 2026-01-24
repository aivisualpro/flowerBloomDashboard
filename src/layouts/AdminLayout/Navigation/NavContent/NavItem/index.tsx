'use client';

import PropTypes from 'prop-types';
import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// react-bootstrap
import { ListGroup } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// project imports
import NavIcon from '../NavIcon';
import { ConfigContext } from '@/contexts/ConfigContext';
import * as actionType from '@/store/actions';
import useWindowSize from '@/hooks/useWindowSize';

// -----------------------|| NAV ITEM ||-----------------------//

export default function NavItem({ item }) {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const { dispatch } = configContext;
  
  const pathname = usePathname();

  let itemTitle = item.title;
  if (item.icon) {
    itemTitle = (
      <>
        <span className="pc-mtext">{item.title}</span>
        {item.type === 'collapse' && (
          <span className="pc-arrow">
            <FeatherIcon icon="chevron-right" />
          </span>
        )}
      </>
    );
  }

  let itemTarget = item.target ? '_blank' : undefined;

  let navItemClass = ['pc-item'];
  
  // Active state check
  if (item.url && pathname === item.url) {
    navItemClass.push('active');
  }

  const navLinkClass = ['pc-link'];

  let subContent;
  if (item.external) {
    subContent = (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={navLinkClass.join(' ')}>
        <NavIcon items={item} />
        {itemTitle}
      </a>
    );
  } else {
    subContent = (
      <Link href={item.url || '#'} className={navLinkClass.join(' ')} target={itemTarget}>
        <NavIcon items={item} />
        {itemTitle}
      </Link>
    );
  }
  let mainContent;
  if (windowSize.width < 992) {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')} onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
        {subContent}
      </ListGroup.Item>
    );
  } else {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
        {subContent}
      </ListGroup.Item>
    );
  }

  return <>{mainContent}</>;
}

NavItem.propTypes = { item: PropTypes.any };
