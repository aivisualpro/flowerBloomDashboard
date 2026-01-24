'use client';

import React, { useState, useEffect } from 'react';

// react-bootstrap
import { ListGroup, Row, Col, Button, Dropdown } from 'react-bootstrap';

// third party
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FeatherIcon from 'feather-icons-react';

// project imports
import navigation from '@/menu-items';
import { BASE_TITLE } from '@/config/constant';

// -----------------------|| BREADCRUMB ||-----------------------//

export default function Breadcrumb() {
  const [main, setMain] = useState({});
  const [item, setItem] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    navigation.items.map((item) => {
      if (item.type && item.type === 'group') {
        getCollapse(item);
      }
      return false;
    });
  });

  const getCollapse = (items) => {
    if (items.children) {
      items.children.filter((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type && collapse.type === 'item') {
          if (pathname === (process.env.NEXT_PUBLIC_APP_BASE_NAME || '') + collapse.url) {
            setMain(items);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  let mainContent;
  let itemContent;
  let breadcrumbContent;
  let title = '';
  if (main && main.type === 'collapse') {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link href="#">{main.title}</Link>
      </ListGroup.Item>
    );
  }

  if (item && item.type === 'item') {
    title = item.title;
    itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link href="#">{title}</Link>
      </ListGroup.Item>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="page-header-title">
                  <h5 className="m-b-10">{title}</h5>
                </div>
                  <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
                    <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </ListGroup.Item>
                  {mainContent}
                  {itemContent}
                </ListGroup>
              </Col>
              {main.title === 'Layouts' && (
                <Col md={4} className="text-md-end action_button">
                  <Button variant="secondary" size="sm" className="rounded-pill">
                    Action
                  </Button>
                  <div className="btn-group ms-2">
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" size="sm" className="arrow-none rounded-pill">
                        <FeatherIcon icon="plus" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end">
                        <Dropdown.Item as={Link} href="#">
                          Action
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} href="#">
                          Another action
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} href="#">
                          Something else here
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      );
    }

    document.title = title + BASE_TITLE;
  }

  return <>{breadcrumbContent}</>;
}
